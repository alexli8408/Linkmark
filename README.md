# Linkmark

A full-stack bookmark manager built with Next.js, designed to save, organize, and find your bookmarks.

**Live:** [linkmark.tech](https://linkmark.tech)

## Features

- **Bookmark Management** — Save bookmarks with auto-fetched metadata (titles, descriptions, favicons, preview images). Add notes and tags for flexible organization.
- **Groups** — Organize bookmarks into shareable groups with drag-and-drop ordering via `@dnd-kit`.
- **Tags** — Apply tags to bookmarks for quick filtering. Orphaned tags (0 bookmarks) are automatically cleaned up.
- **Bulk Actions** — Select multiple bookmarks to tag, add to a group, or delete in one action.
- **Search** — Full-text search across bookmark titles, URLs, descriptions, and notes.
- **Statistics** — View your bookmark activity over time, top tags, and recent bookmarks.
- **Import/Export** — Import bookmarks from JSON, CSV, or HTML files. Export as JSON or CSV.
- **Chrome Extension** — Save bookmarks from any page with a single click using an API key.
- **Broken Link Checker** — AWS Lambda function that periodically checks all your bookmarks for broken URLs.
- **Authentication** — GitHub OAuth via NextAuth.js (Auth.js).
- **Keyboard Shortcuts** — `Cmd+N` to add a bookmark, `?` to view all shortcuts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | NextAuth (Auth.js) |
| Styling | Tailwind CSS v4 |
| Cloud | AWS S3, AWS Lambda |
| UI | React 19, dnd-kit |

## Project Structure

```
src/
├── app/            # Next.js App Router pages and API routes
├── components/     # React components (BookmarkCard, Sidebar, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utilities (auth, prisma, S3, metadata fetching)
└── types/          # TypeScript type definitions

extension/          # Chrome extension (Manifest V3)
lambda/
├── index.mjs             # Broken link checker
└── metadata-fetcher/     # Async metadata fetcher
prisma/             # Database schema and migrations
```

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL database
- AWS account (for S3 and Lambda)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env` and fill in `DATABASE_URL`, NextAuth secrets, and AWS credentials.

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Chrome Extension

1. Go to `chrome://extensions/` and enable Developer mode.
2. Click "Load unpacked" and select the `extension/` directory.
3. Generate an API key in Settings and configure the extension.

### Broken Link Checker (Lambda)

1. `cd lambda && npm install`
2. Zip contents and upload to AWS Lambda (Node.js 20.x).
3. Set `DATABASE_URL` environment variable.
4. Schedule via EventBridge (e.g., daily).
