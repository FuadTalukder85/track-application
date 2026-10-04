# 🚀 CareerTrack — Job Application Tracking Portal (Frontend)

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-14.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Lucide_Icons-latest-F56565?style=for-the-badge" alt="Lucide Icons" />
  <img src="https://img.shields.io/badge/pnpm-10.x-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</p>

A clean, modern, and responsive web application for managing and organizing daily job applications, interview stages, compensation offers, notes, and application pipeline statistics.

---

## ✨ Features

- 📊 **Real-time Pipeline Metrics**: Interactive cards tracking Total Applications, Pipeline count, Interviews/Assessments, Offers Received, and Rejections.
- ⚡ **Fast Application Logging**: Multi-section modal designed for rapid data entry (Company, Role, Location, Work Mode, Dates, URLs, Compensation, Description, Requirements, Notes).
- 🗂️ **Table & Card Views**: Switch seamlessly between a dense, actionable data table and visual glassmorphic cards.
- 🔄 **One-Click Quick Status Updates**: Update application stages directly from the table or card dropdowns without opening full editing forms.
- 🔍 **Real-Time Search & Filtering**: Instant search across companies, job titles, locations, requirements, and personal notes, with filters by Status, Job Type, and Work Mode.
- 📑 **Comprehensive Detail Inspector**: View full job descriptions, requirements, salary comparisons, and jump directly to the live job posting.
- 🛡️ **Safe Deletions**: Confirmation modal preventing accidental removal of data.
- 💫 **Modern Aesthetic**: Dark glassmorphic interface with micro-interactions, responsive mobile layout, and backdrop-blur overlays.

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI & State**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind custom utilities & glassmorphic styles
│   │   ├── layout.tsx            # Next.js Root Layout with metadata
│   │   └── page.tsx              # Main Dashboard combining all features
│   ├── components/
│   │   ├── Navbar.tsx            # Header with branding and quick Add button
│   │   ├── StatsCards.tsx        # Overview metric widgets with status filter triggers
│   │   ├── FilterBar.tsx         # Search bar, multi-select dropdowns & view toggle
│   │   ├── JobApplicationTable.tsx # Dense table layout with fast status switcher
│   │   ├── JobApplicationCards.tsx # Responsive card grid layout
│   │   ├── JobApplicationModal.tsx # Add / Edit application form modal
│   │   ├── JobDetailsModal.tsx   # Detailed drawer/inspector modal
│   │   └── DeleteConfirmModal.tsx# Confirmation dialog
│   ├── lib/
│   │   ├── api.ts                # REST API client
│   │   └── utils.ts              # Currency & date formatters, badge color tokens
│   └── types/
│       └── job.ts                # TypeScript types and interfaces
├── public/                       # Static assets
├── .env.local                    # Local environment variables
├── .env.example                  # Environment variable template
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **pnpm** installed globally (`npm install -g pnpm`)
- **Backend API Server** running (see [Backend Repository](https://github.com/FuadTalukder85/track-application-backend.git))

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FuadTalukder85/track-application.git
   cd track-application
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   Add your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the Development Server:**
   ```bash
   pnpm dev
   ```
   > Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `pnpm dev` | Runs the Next.js app in development mode on port 3000 |
| `build` | `pnpm build` | Creates an optimized production build |
| `start` | `pnpm start` | Starts Next.js production server |
| `lint` | `pnpm lint` | Runs ESLint to check for code quality |

---

## 🔗 Related Repositories

- **Backend API**: [FuadTalukder85/track-application-backend](https://github.com/FuadTalukder85/track-application-backend)

---

## 🛡️ License

This project is licensed under the **MIT License**.
