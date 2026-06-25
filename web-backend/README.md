# SRM EEE VLAB (Virtual Laboratory)

An interactive Electrical and Electronics Engineering (EEE) virtual learning platform featuring immersive 3D experiments, dynamic quizzes, and comprehensive educational resources.

## Technical Stack

This project is built using modern web development technologies to ensure high performance, maintainability, and a premium user experience:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics:** [Three.js](https://threejs.org/)
- **Authentication:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Validation:** [Zod](https://zod.dev/) & React Hook Form
- **Language:** TypeScript

## Technical Approach & Architecture

- **Server-First Architecture:** Leverages Next.js React Server Components (RSC) to reduce the client-side JavaScript bundle, resulting in faster initial page loads and better SEO.
- **Client Components for Interactivity:** Interactive elements like 3D experiment viewers (Three.js), dynamic quizzes, and complex animations (Framer Motion) are cleanly separated into Client Components.
- **Static Site Generation (SSG):** Pages are pre-rendered as much as possible at build time to provide instant loading states.
- **Authentication Flow:** Secure, session-based authentication implemented via NextAuth.js beta, supporting credential logins and seamless route protection via Next.js Middleware.
- **Design System:** A robust, utility-first design system driven by Tailwind CSS and enriched with `shadcn/ui` for accessible, unstyled, and highly customizable UI primitives.

## Core Features

- **Interactive 3D Experiments (`/experiments`):** Utilizing Three.js to provide immersive, virtual electrical circuit simulations and lab equipment interactions right in the browser.
- **Dynamic Study Room (`/study-room`):** A centralized hub offering categorized study materials, Previous Year Questions (PYQs), formula sheets, lab manuals, and curated video lectures.
- **Quizzes & Assessments (`/quizzes`):** Real-time evaluation modules featuring multiple-choice questions, interactive circuits, and instant feedback to reinforce learning.
- **AI Assistant Integration:** Context-aware AI support within the study room to answer student queries, explain abstract electrical concepts, and assist with complex calculations.
- **Secure Authentication & Progress Tracking:** Full user management powered by NextAuth.js, allowing students to save their progress, track completed experiments, and view their quiz scores across multiple sessions.
- **Responsive & Accessible UI:** A fully responsive layout with native dark mode support, crafted meticulously with Tailwind CSS and Radix UI to ensure seamless usage across desktop, tablet, and mobile devices.

## Project Structure

```
.
├── app/                  # Next.js App Router (Pages, API routes, Layouts)
│   ├── api/              # Backend API handlers (Auth, users, progress)
│   ├── experiments/      # 3D interactive experiment pages
│   ├── quizzes/          # Dynamic quiz modules
│   └── study-room/       # Educational resources and tools
├── components/           # Reusable Client and Server UI components
├── public/               # Static assets (images, 3D models)
├── .npmrc                # NPM config to enforce legacy-peer-deps
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
└── tailwind.config.ts    # Tailwind CSS design system tokens
```

## Local Development Setup

### Prerequisites
- **Node.js** 20.x (Recommended)
- **npm** v9 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krishnakeshab-banik/srm_eee_vlab.git
   cd srm_eee_vlab
   ```

2. **Install dependencies:**
   *(Note: The project uses React 19, so legacy peer dependencies are enabled via `.npmrc`)*
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

### Deployment Specifics
- **Node.js Engine:** explicitly pinned to `20.x` in `package.json` to prevent unwanted auto-upgrades.
- **Peer Dependencies:** Vercel automatically respects the included `.npmrc` file (which contains `legacy-peer-deps=true`) to seamlessly resolve React 19 vs. Framer Motion dependency conflicts during the build step.
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
