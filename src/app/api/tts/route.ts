import { NextRequest, NextResponse } from 'next/server';

function chunkText(text: string, maxLen = 180): string[] {
  const clean = text.trim();
  if (clean.length <= maxLen) return [clean];

  // Split by sentence terminators or newlines or commas
  const sentences = clean.split(/([.!?,;\n]+)/);
  const chunks: string[] = [];
  let current = '';

  for (let i = 0; i < sentences.length; i++) {
    const part = sentences[i];
    if (!part) continue;
    if ((current + part).length <= maxLen) {
      current += part;
    } else {
      if (current.trim()) {
        chunks.push(current.trim());
      }
      if (part.length > maxLen) {
        // Break long words or clauses
        const words = part.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).length <= maxLen) {
            sub = sub ? `${sub} ${w}` : w;
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        if (sub) current = sub;
      } else {
        current = part;
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks.filter((c) => c.length > 0);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const lang = searchParams.get('lang') || 'te';

    if (!text || !text.trim()) {
      return new NextResponse('Text is required', { status: 400 });
    }

    const trimmed = text.trim().slice(0, 2000); // safety cap
    const chunks = chunkText(trimmed, 170);

    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      let success = false;
      const urls = [
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          chunk
        )}&tl=${lang}&client=tw-ob`,
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          chunk.replace(/[?!;:,.]/g, ' ')
        )}&tl=${lang}&client=tw-ob`,
      ];

      for (const googleTtsUrl of urls) {
        try {
          const res = await fetch(googleTtsUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            signal: AbortSignal.timeout(6000),
          });

          if (res.ok) {
            const ab = await res.arrayBuffer();
            if (ab.byteLength > 0) {
              buffers.push(Buffer.from(ab));
              success = true;
              break;
            }
          }
        } catch (err) {
          // retry with cleaned string
        }
      }

      if (!success) {
        console.warn('TTS chunk fetch failed for chunk:', chunk);
      }
    }

    if (buffers.length === 0) {
      return new NextResponse('Failed to generate audio', { status: 502 });
    }

    const combined = Buffer.concat(buffers);

    return new NextResponse(combined, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': combined.length.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('TTS Route Error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
