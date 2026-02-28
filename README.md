# Linkmark

Linkmark is a full-stack, comprehensive bookmark manager built with [Next.js](https://nextjs.org), designed to help you organize and maintain your saved links efficiently.

## Features

- **Bookmark Management:** Save, organize, and manage bookmarks with metadata such as titles, descriptions, favicons, and preview images.
- **Collections & Tags:** Group links into collections and apply tags for flexible organization. Supports drag-and-drop (`@dnd-kit`) for intuitive ordering.
- **Chrome Extension:** A companion Chrome extension (`/extension`) that allows you to easily save bookmarks to your Linkmark account with a single click via an API Key.
- **Broken Link Checker:** An AWS Lambda function (`/lambda`) that periodically checks all your saved bookmarks via HEAD requests to detect and report broken links.
- **Authentication:** Integrated with [NextAuth.js](https://next-auth.js.org/) for robust user authentication and session management.
- **PostgreSQL Database:** Powered by [Prisma](https://www.prisma.io/) ORM and a PostgreSQL database to store users, bookmarks, tags, and collections.
- **AWS S3 Integration:** Uses AWS S3 for storing assets like favicons or preview images.

## Project Structure

- `src/`: Core Next.js application, including the app router (`app/`), React components (`components/`), hooks, and utility functions (`lib/`).
- `prisma/`: Database schema (`schema.prisma`) and migrations.
- `extension/`: Chrome extension source code with manifest v3.
- `lambda/`: AWS Lambda Node.js script (`index.mjs`) to check for broken URLs in the database.

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- A PostgreSQL database
- AWS Account (for S3 and Lambda features)
- Chrome Browser (for the extension)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file based on `.env.example` and fill in the necessary values, including `DATABASE_URL`, NextAuth secrets, and AWS credentials.

3. **Database Setup:**
   Run Prisma migrations to set up your database schema:
   ```bash
   npm run build # The build script includes prisma migrate deploy
   # OR manually:
   npx prisma migrate dev
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the `extension/` directory in this project.
4. Generate an API Key in your Linkmark dashboard and configure the extension to start saving bookmarks!

## Lambda Broken Link Checker Setup

The broken link checker is designed to run on AWS Lambda.
1. Navigate to the `lambda/` directory.
2. Run `npm install` within that directory.
3. Zip the contents (including `node_modules`).
4. Upload to AWS Lambda (Node.js 20.x runtime).
5. Set the `DATABASE_URL` environment variable in the Lambda configuration.
6. Trigger via EventBridge on a schedule (e.g., daily).

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL & Prisma ORM
- **Auth:** NextAuth (Auth.js)
- **Styling:** Tailwind CSS v4
- **Cloud:** AWS (S3, Lambda)
- **UI:** React, dnd-kit (Drag and drop)
