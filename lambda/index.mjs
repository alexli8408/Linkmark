/**
 * Linkmark — Broken Link Checker
 *
 * Checks all bookmarks in the database by sending HEAD requests.
 * Reports any URLs that return non-2xx status codes or fail to connect.
 *
 * ── Local usage ──
 *   cd lambda
 *   npm install
 *   DATABASE_URL="postgresql://alexli@localhost:5432/bookmark_manager" node index.mjs
 *
 * ── AWS Lambda deployment ──
 *   1. cd lambda && npm install
 *   2. zip -r broken-link-checker.zip index.mjs node_modules/
 *   3. Upload zip to AWS Lambda (Node.js 20.x runtime)
 *   4. Set environment variable: DATABASE_URL = your RDS connection string
 *   5. Set timeout to 60 seconds (or more for large bookmark counts)
 *   6. Create an EventBridge rule to trigger on a schedule (e.g. every 24 hours):
 *      - Schedule expression: rate(1 day)
 *      - Target: this Lambda function
 */

import pg from "pg";

const BATCH_SIZE = 10;
const REQUEST_TIMEOUT_MS = 10000;

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Linkmark-BrokenLinkChecker/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: 0, ok: false, error: err.message };
  }
}

async function checkBatch(bookmarks) {
  return Promise.all(
    bookmarks.map(({ url }) => checkUrl(url))
  );
}

export async function handler() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const { rows: bookmarks } = await client.query(
      'SELECT id, url, title FROM "Bookmark" ORDER BY "createdAt" DESC'
    );

    console.log(`Found ${bookmarks.length} bookmarks to check\n`);

    const broken = [];

    // Process in batches
    for (let i = 0; i < bookmarks.length; i += BATCH_SIZE) {
      const batch = bookmarks.slice(i, i + BATCH_SIZE);
      const results = await checkBatch(batch);

      for (const result of results) {
        if (!result.ok) {
          broken.push(result);
          console.log(
            `  BROKEN: ${result.url} — ${result.error ?? `HTTP ${result.status}`}`
          );
        }
      }

      console.log(
        `Checked ${Math.min(i + BATCH_SIZE, bookmarks.length)}/${bookmarks.length}`
      );
    }

    console.log(`\n── Summary ──`);
    console.log(`Total checked: ${bookmarks.length}`);
    console.log(`Broken links:  ${broken.length}`);

    if (broken.length > 0) {
      console.log(`\nBroken URLs:`);
      for (const b of broken) {
        console.log(`  - ${b.url} (${b.error ?? `HTTP ${b.status}`})`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: bookmarks.length,
        broken: broken.length,
        brokenUrls: broken.map((b) => ({
          url: b.url,
          reason: b.error ?? `HTTP ${b.status}`,
        })),
      }),
    };
  } finally {
    await client.end();
  }
}

// Run directly when invoked with `node index.mjs`
const isDirectRun =
  !process.env.AWS_LAMBDA_FUNCTION_NAME &&
  !process.env.LAMBDA_TASK_ROOT;

if (isDirectRun) {
  handler().then((result) => {
    console.log("\nResult:", JSON.stringify(JSON.parse(result.body), null, 2));
  });
}
