# TELUGUVA (తెలుగు AI) 🇮🇳

> **Understand English. Hear Telugu.**  
> A production-grade, highly accessible AI web application designed specifically to help Telugu speakers, parents, and learners understand English documents, notices, prescriptions, bills, and messages easily.

🌐 **Live Application**: [https://teluguva.vercel.app](https://teluguva.vercel.app)

---

## ✨ Features

- **Instant Dual-Tier Translations**:
  - **Natural Telugu**: Fluent, grammatically accurate, respectful Telugu.
  - **Simple Telugu**: Automatically converts heavy Sanskritized / formal words into everyday conversational Telugu (e.g. *కరెంట్ బిల్లు* instead of *విద్యుత్*, *ఇవ్వాల్సిన కాగితాలు* instead of *సమర్పించవలసిన పత్రాలు*).
- **Studio-Quality Telugu Audio (TTS)**:
  - Streaming native Telugu audio engine (`/api/tts`) with clear pronunciation.
  - 0.75× slow speed for older adults and learners.
  - English audio playback option for bilingual comprehension.
- **Document & Image Scanner (OCR)**:
  - High-accuracy OCR powered by Tesseract.js.
  - Live device camera viewfinder with auto-focus guides and snapshot capture.
  - Image quality checker warning for low-light or blurry captures.
- **Interactive Word Explanation**:
  - Tap any English word in your text to see its Telugu meaning, phonetic sound, and example sentences.
- **AI Document Assistant**:
  - Ask questions directly about the translated document (*"What is the deadline?"*, *"What action should I take?"*).
- **Mobile-First Experience**:
  - Native bottom navigation bar (`MobileBottomNav`) with safe-area insets.
  - Big touch targets (44px+) and elderly font size switcher (`A`, `A+`, `A++`).
- **History, Starred Favorites & Social Share**:
  - Offline-first local storage for saved translations.
  - One-click WhatsApp sharing and instant 1080×1080 branded social card generation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/gokul1599/teluguva.git
cd teluguva

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT License.
