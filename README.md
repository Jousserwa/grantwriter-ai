# GrantWriter AI

Full-stack SaaS web app for non-profits, universities, startups, and green energy companies to find and apply for grants.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma 7
- **Authentication**: Auth.js (NextAuth.js)
- **Styling**: Tailwind CSS
- **Payments**: NOWPayments

## Getting Started

1.  **Clone the repository** (if not already done).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    Copy `.env.example` to `.env` and fill in the values.
4.  **Database Migration**:
    ```bash
    npx prisma migrate dev
    ```
5.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Project Structure
- `src/app`: Next.js App Router
- `src/components`: Reusable UI components
- `src/lib`: Shared utilities and client instances (e.g., Prisma)
- `src/auth.ts`: Auth.js configuration
- `prisma/`: Database schema and migrations
- `/home/team/shared/docs`: Documentation and shared designs

## Shared Documentation
- [Database Schema](/home/team/shared/docs/database-schema.md)
