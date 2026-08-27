+-----------------------------------------------------------------------+
|                                                                       |
|   TEACHERS' DAY LIVE QUIZ WEB APPLICATION                             |
|   Classroom Notebook Edition & Event System                           |
|                                                                       |
+-----------------------------------------------------------------------+

=========================================================================
SECTION 1: OVERVIEW & ESSENTIALS
=========================================================================

The Teachers' Day Live Quiz is a high-concurrency real-time event web
application designed for college celebrations. Built with Next.js, 
TypeScript, and Server-Sent Events (SSE), it supports 1,000+ simultaneous 
campus participants over local Wi-Fi without server bottlenecks.

-------------------------------------------------------------------------
[ STICKY NOTE: YELLOW ]
  Core Features:
  - Zero-PIN Instant Join: Participants scan the live QR code to open
    the join page directly without typing 6-digit game PINs.
  - Pen & Notebook Aesthetic: Tactile off-white ruled paper design,
    dark ink borders, paper drop-shadows, and yellow/mint/lavender cards.
  - Automatic Game Engine: Host starts the quiz once; questions, timers,
    reveals, fun facts, and leaderboards progress automatically.
  - Projector-Ready Leaderboard: Real-time Top 10 rankings display with
    podium visualization and rank shift movement badges.
-------------------------------------------------------------------------

=========================================================================
SECTION 2: SYSTEM ARCHITECTURE & DATA FLOW
=========================================================================

+-------------------+       +--------------------+       +---------------------+
|  Participant App  | <---> | Next.js SSE Stream | <---> |  Quiz Game Engine   |
| (Mobile Browsers) |       |   (/api/stream)    |       |   (Memory Loop)     |
+-------------------+       +--------------------+       +---------------------+
          |                                                         |
          v                                                         v
+-------------------+                                    +---------------------+
| Local IndexedDB   |                                    | SQLite Database WAL |
| (Session State)   |                                    | (Quizzes & Logs)    |
+-------------------+                                    +---------------------+

-------------------------------------------------------------------------
[ STICKY NOTE: MINT ]
  Technology Stack Details:
  - Framework: Next.js 15 App Router (React 19)
  - Primary Language: TypeScript
  - Styling: Vanilla CSS & Tailwind CSS (Pen & Notebook Tokens)
  - Realtime Engine: Server-Sent Events (SSE)
  - Server Database: SQLite (better-sqlite3) with WAL Mode enabled
  - Client Storage: IndexedDB (Local participant persistence)
-------------------------------------------------------------------------

=========================================================================
SECTION 3: REPOSITORY DIRECTORY INDEX
=========================================================================

/
|-- src/
|   |-- app/
|   |   |-- [adminRoute]/       Secret URL area for host management panel
|   |   |-- api/                SSE stream, join, answer, and admin routes
|   |   |-- join/               Participant name & avatar join screen
|   |   |-- play/               Live question prompt & choice controller
|   |   |-- leaderboard/        Full screen projector rankings display
|   |   |-- results/            Participant end-of-quiz final stats
|   |   `-- globals.css         Notebook paper background & card rules
|   |-- components/             Tactile UI components (Timer, Avatar, etc)
|   `-- lib/                    QuizEngine, EventHub, Auth, & DB logic
|-- public/                     Static vector assets
`-- data/                       Local SQLite database path (data/quiz.db)

=========================================================================
SECTION 4: QUICK START GUIDE
=========================================================================

1. Installation
   git clone git@github.com:radheshpai87/teachers-day-quiz.git
   cd teachers-day-quiz
   npm install

2. Environment Setup
   Create a .env.local file in the project root:
   
   ADMIN_ROUTE_SECRET=event-control-x7k92m
   ADMIN_USERNAME=host
   ADMIN_PASSWORD=teachersday2026
   DATABASE_PATH=data/quiz.db

3. Development Mode
   npm run dev

   Access URIs:
   - Participant Join:  http://localhost:3000/join
   - Leaderboard:       http://localhost:3000/leaderboard
   - Host Console:      http://localhost:3000/event-control-x7k92m/login

4. Production Build & Execution
   npm run build
   npm start

=========================================================================
SECTION 5: ENVIRONMENT VARIABLES REFERENCE TABLE
=========================================================================

Variable Name       Required  Default Value         Description
------------------  --------  --------------------  -----------------------------------
ADMIN_ROUTE_SECRET  Yes       event-control-x7k92m  Secret URL segment for host panel
ADMIN_USERNAME      Yes       host                  Host login username
ADMIN_PASSWORD      Yes       teachersday2026       Host login password
DATABASE_PATH       No        data/quiz.db          Path to local SQLite file

=========================================================================
SECTION 6: VERCEL SERVERLESS DEPLOYMENT
=========================================================================

1. Import the repository into your Vercel Dashboard.
2. Configure Environment Variables (ADMIN_ROUTE_SECRET, ADMIN_USERNAME, etc.).
3. Deploy. The database automatically resolves to /tmp/quiz.db on Vercel.

-------------------------------------------------------------------------
[ STICKY NOTE: LAVENDER ]
  License & Terms:
  This project is open-source under the MIT License.
-------------------------------------------------------------------------
