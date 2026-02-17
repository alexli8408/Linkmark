export const metadata = {
  title: "Privacy Policy - Linkmark",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Last updated: February 17, 2025
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Overview
          </h2>
          <p className="mt-2">
            Linkmark is a bookmark manager that lets you save, organize, and
            search your bookmarks. This policy explains what data we collect and
            how we use it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Data We Collect
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Account information:</strong> When you sign in with GitHub,
              we receive your name, email address, and profile image from GitHub
              OAuth.
            </li>
            <li>
              <strong>Bookmark data:</strong> URLs, page titles, descriptions,
              tags, and notes you save to your account.
            </li>
            <li>
              <strong>Page metadata:</strong> When you save a bookmark, we
              automatically fetch the page title, description, favicon, and
              preview image from the URL.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Chrome Extension
          </h2>
          <p className="mt-2">
            The Linkmark Chrome extension reads the current tab&apos;s URL and title
            only when you click the Save button. It stores your server URL and
            API key locally in your browser using Chrome&apos;s storage API. The
            extension does not track your browsing history or collect data in the
            background.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            How We Use Your Data
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To provide and maintain the bookmark manager service</li>
            <li>To authenticate your account</li>
            <li>To fetch and display metadata for your saved bookmarks</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Data Storage
          </h2>
          <p className="mt-2">
            Your data is stored securely in a PostgreSQL database hosted on Neon.
            Preview images and favicons are stored on AWS S3 and served via
            CloudFront CDN.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Third-Party Services
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>GitHub OAuth:</strong> Used for authentication
            </li>
            <li>
              <strong>Vercel:</strong> Application hosting
            </li>
            <li>
              <strong>Neon:</strong> Database hosting
            </li>
            <li>
              <strong>AWS (S3, CloudFront, Lambda):</strong> Image storage and
              metadata processing
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Data Sharing
          </h2>
          <p className="mt-2">
            We do not sell, trade, or transfer your personal data to third
            parties. Your bookmark data is private and only accessible to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Data Deletion
          </h2>
          <p className="mt-2">
            You can delete individual bookmarks, collections, and tags at any
            time from the dashboard. To delete your entire account and all
            associated data, contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Contact
          </h2>
          <p className="mt-2">
            If you have questions about this privacy policy, please open an
            issue on the{" "}
            <a
              href="https://github.com/alexli/bookmark-manager"
              className="underline hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
