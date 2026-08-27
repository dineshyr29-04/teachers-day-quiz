# Teachers' Day Live Quiz Web Application

A modern, high-concurrency live quiz web application built for college Teachers' Day celebrations. Designed to support 1,000+ simultaneous participants over campus Wi-Fi using real-time Server-Sent Events (SSE), an automated server game loop, and a tactile Pen & Notebook paper design system.

![Teachers Day Quiz Banner](public/teachers_day_banner.png)

---

## Overview

The Teachers' Day Quiz Application provides an interactive experience for students and faculty alike. Built with performance, simplicity, and visual aesthetics in mind, the platform eliminates complex authentication for participants while offering robust control features for event hosts.

### Core Capabilities

- **Zero-PIN Instant Joining**: Participants scan a high-resolution QR code using any smartphone camera to open the quiz instantly without typing 6-digit game PINs.
- **High Concurrency Support**: Supports 1,000+ active player connections using minimal network overhead via Server-Sent Events.
- **Automated Game Loop**: The host initiates the event once with a single start action. Questions, timers, answer reveals, educational fun facts, and leaderboards progress automatically.
- **Pen & Notebook Design System**: Tactile off-white ruled paper aesthetic featuring solid ink borders, paper drop-shadows, and sticky note color accents without heavy gradients.
- **Projector-Ready Top 10 Leaderboard**: Live display featuring podium rankings for the top three participants, interactive position movement indicators, and full ranks 4 through 10.
- **Local Persistence**: IndexedDB on the client prevents data loss on accidental browser refreshes, while SQLite provides durable event logging on the server.

---

![Classroom Learning Illustration](public/classroom_learning_hero.png)

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variable design tokens
- **Animations**: Framer Motion
- **Realtime Engine**: Server-Sent Events (SSE) with minimal diff payloads
- **Server Database**: SQLite (better-sqlite3) with WAL mode enabled
- **Client Persistence**: IndexedDB (idb keyval wrapper)
- **QR Code Engine**: Server-side SVG & Data URL generation via `qrcode`

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── [adminRoute]/        # Secret route for host management console
│   │   ├── api/                 # API handlers for realtime stream, join, answer, admin
│   │   ├── join/                # Participant join screen
│   │   ├── play/                # Participant live question and answer controller
│   │   ├── leaderboard/         # Projector-ready live leaderboard display
│   │   ├── results/             # Participant end-of-quiz final results
│   │   └── globals.css          # Design system CSS rules (notebook paper, sticky notes)
│   ├── components/              # Reusable UI components (Timer, Avatar, QuestionCard, etc.)
│   └── lib/                     # Core business logic (QuizEngine, EventHub, Auth, DB)
├── public/                      # Static artwork and vector illustrations
└── data/                        # Local SQLite database storage
```

---

## Quick Start Guide

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:radheshpai87/teachers-day-quiz.git
cd teachers-day-quiz
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
ADMIN_ROUTE_SECRET=event-control-x7k92m
ADMIN_USERNAME=host
ADMIN_PASSWORD=teachersday2026
DATABASE_PATH=data/quiz.db
```

### 3. Running Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

- **Participant Join**: `http://localhost:3000/join`
- **Projector Leaderboard**: `http://localhost:3000/leaderboard`
- **Host Admin Panel**: `http://localhost:3000/event-control-x7k92m/login`

### 4. Production Build

To build and run the optimized production bundle:

```bash
npm run build
npm start
```

---

## Environment Variables Reference

| Variable Name | Required | Default Value | Description |
|---|---|---|---|
| `ADMIN_ROUTE_SECRET` | Yes | `event-control-x7k92m` | Secret URL path segment for the host admin area |
| `ADMIN_USERNAME` | Yes | `host` | Username required to access host controls |
| `ADMIN_PASSWORD` | Yes | `teachersday2026` | Password required to access host controls |
| `DATABASE_PATH` | No | `data/quiz.db` | Path to the SQLite database file (`/tmp/quiz.db` on Vercel) |

---

## Deployment on Vercel

1. Import the repository into your Vercel Dashboard.
2. Add the environment variables listed above in the Vercel project settings.
3. Deploy the application. The system automatically detects Next.js and configures the build settings.

---

## License

This project is open-source and available under the MIT License.
