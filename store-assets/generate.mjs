import sharp from "sharp";

// 1. Store Icon (128x128) — already exists but let's make a crisp version
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="#18181b"/>
  <path d="M36 24h56a4 4 0 0 1 4 4v80.8a3.2 3.2 0 0 1-4.8 2.8L64 96l-27.2 15.6A3.2 3.2 0 0 1 32 108.8V28a4 4 0 0 1 4-4z" fill="#fafafa"/>
</svg>`;

await sharp(Buffer.from(iconSvg)).png().toFile("store-assets/icon128.png");
console.log("✓ icon128.png");

// 2. Screenshot (1280x800) — mockup of the app dashboard
const screenshotSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1280" height="800" fill="#09090b"/>

  <!-- Top navbar -->
  <rect width="1280" height="56" fill="#09090b"/>
  <text x="24" y="36" fill="#fafafa" font-size="18" font-weight="700">Linkmark</text>
  <line x1="0" y1="56" x2="1280" y2="56" stroke="#27272a" stroke-width="1"/>

  <!-- Sidebar -->
  <rect x="0" y="56" width="224" height="744" fill="#0a0a0a"/>
  <line x1="224" y1="56" x2="224" y2="800" stroke="#27272a" stroke-width="1"/>

  <!-- Sidebar nav items -->
  <rect x="12" y="72" width="200" height="36" rx="6" fill="#27272a"/>
  <text x="24" y="96" fill="#fafafa" font-size="14" font-weight="500">All Bookmarks</text>

  <text x="24" y="136" fill="#a1a1aa" font-size="14" font-weight="500">Collections</text>
  <text x="24" y="168" fill="#a1a1aa" font-size="14" font-weight="500">Analytics</text>
  <text x="24" y="200" fill="#a1a1aa" font-size="14" font-weight="500">Import / Export</text>
  <text x="24" y="232" fill="#a1a1aa" font-size="14" font-weight="500">Settings</text>

  <!-- Tags section -->
  <text x="24" y="288" fill="#71717a" font-size="11" font-weight="600" letter-spacing="1">TAGS</text>
  <text x="24" y="316" fill="#a1a1aa" font-size="13">react</text>
  <text x="196" y="316" fill="#71717a" font-size="12" text-anchor="end">5</text>
  <text x="24" y="342" fill="#a1a1aa" font-size="13">javascript</text>
  <text x="196" y="342" fill="#71717a" font-size="12" text-anchor="end">3</text>
  <text x="24" y="368" fill="#a1a1aa" font-size="13">design</text>
  <text x="196" y="368" fill="#71717a" font-size="12" text-anchor="end">2</text>

  <!-- Main content area -->
  <text x="256" y="100" fill="#fafafa" font-size="24" font-weight="600">All Bookmarks</text>

  <!-- Add Bookmark button -->
  <rect x="1120" y="76" width="130" height="36" rx="6" fill="#fafafa"/>
  <text x="1148" y="100" fill="#09090b" font-size="13" font-weight="500">+ Add Bookmark</text>

  <!-- Search bar -->
  <rect x="256" y="120" width="880" height="36" rx="6" fill="#18181b" stroke="#27272a"/>
  <text x="272" y="143" fill="#71717a" font-size="13">Search bookmarks...</text>
  <rect x="1148" y="120" width="72" height="36" rx="6" fill="#fafafa"/>
  <text x="1164" y="143" fill="#09090b" font-size="13" font-weight="500">Search</text>

  <!-- Sort controls -->
  <text x="256" y="188" fill="#71717a" font-size="12">Sort by:</text>
  <rect x="304" y="174" width="60" height="24" rx="4" fill="#fafafa"/>
  <text x="316" y="191" fill="#09090b" font-size="11" font-weight="500">Newest</text>
  <text x="380" y="191" fill="#71717a" font-size="11" font-weight="500">Oldest</text>
  <text x="424" y="191" fill="#71717a" font-size="11" font-weight="500">Title</text>

  <!-- Bookmark Card 1 -->
  <rect x="256" y="210" width="990" height="140" rx="8" fill="#18181b" stroke="#27272a"/>
  <!-- Preview image placeholder -->
  <rect x="256" y="210" width="990" height="60" rx="8" fill="#27272a"/>
  <rect x="256" y="260" width="990" height="2" fill="#18181b"/>
  <circle cx="276" cy="292" r="10" fill="#3f3f46"/>
  <text x="296" y="297" fill="#fafafa" font-size="14" font-weight="500">GitHub: Let's build from here</text>
  <text x="296" y="316" fill="#71717a" font-size="12">github.com</text>
  <text x="296" y="338" fill="#a1a1aa" font-size="12">GitHub is where over 100 million developers shape the future of software...</text>

  <!-- Tag pills -->
  <rect x="296" y="346" width="36" height="18" rx="3" fill="#27272a"/>
  <text x="304" y="359" fill="#a1a1aa" font-size="10">dev</text>
  <rect x="338" y="346" width="52" height="18" rx="3" fill="#27272a"/>
  <text x="346" y="359" fill="#a1a1aa" font-size="10">coding</text>

  <!-- Bookmark Card 2 -->
  <rect x="256" y="362" width="990" height="120" rx="8" fill="#18181b" stroke="#27272a"/>
  <circle cx="276" cy="394" r="10" fill="#3f3f46"/>
  <text x="296" y="399" fill="#fafafa" font-size="14" font-weight="500">Vercel: Build and deploy the best web experiences</text>
  <text x="296" y="418" fill="#71717a" font-size="12">vercel.com</text>
  <text x="296" y="440" fill="#a1a1aa" font-size="12">Vercel's frontend cloud gives developers the frameworks, workflows, and...</text>
  <rect x="296" y="452" width="56" height="18" rx="3" fill="#27272a"/>
  <text x="304" y="465" fill="#a1a1aa" font-size="10">hosting</text>
  <rect x="358" y="452" width="36" height="18" rx="3" fill="#27272a"/>
  <text x="366" y="465" fill="#a1a1aa" font-size="10">dev</text>

  <!-- Bookmark Card 3 -->
  <rect x="256" y="494" width="990" height="120" rx="8" fill="#18181b" stroke="#27272a"/>
  <circle cx="276" cy="526" r="10" fill="#3f3f46"/>
  <text x="296" y="531" fill="#fafafa" font-size="14" font-weight="500">MDN Web Docs</text>
  <text x="296" y="550" fill="#71717a" font-size="12">developer.mozilla.org</text>
  <text x="296" y="572" fill="#a1a1aa" font-size="12">The MDN Web Docs site provides information about Open Web technologies...</text>
  <rect x="296" y="584" width="68" height="18" rx="3" fill="#27272a"/>
  <text x="304" y="597" fill="#a1a1aa" font-size="10">javascript</text>
  <rect x="370" y="584" width="64" height="18" rx="3" fill="#27272a"/>
  <text x="378" y="597" fill="#a1a1aa" font-size="10">reference</text>

  <!-- Bookmark Card 4 -->
  <rect x="256" y="626" width="990" height="120" rx="8" fill="#18181b" stroke="#27272a"/>
  <circle cx="276" cy="658" r="10" fill="#3f3f46"/>
  <text x="296" y="663" fill="#fafafa" font-size="14" font-weight="500">Tailwind CSS - Rapidly build modern websites</text>
  <text x="296" y="682" fill="#71717a" font-size="12">tailwindcss.com</text>
  <text x="296" y="704" fill="#a1a1aa" font-size="12">A utility-first CSS framework packed with classes that can be composed...</text>
  <rect x="296" y="716" width="28" height="18" rx="3" fill="#27272a"/>
  <text x="302" y="729" fill="#a1a1aa" font-size="10">css</text>
  <rect x="330" y="716" width="50" height="18" rx="3" fill="#27272a"/>
  <text x="338" y="729" fill="#a1a1aa" font-size="10">design</text>
</svg>`;

await sharp(Buffer.from(screenshotSvg)).png().toFile("store-assets/screenshot-1280x800.png");
console.log("✓ screenshot-1280x800.png");

// 3. Promotional tile (440x280)
const promoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="280" viewBox="0 0 440 280">
  <defs>
    <style>
      text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="440" height="280" rx="0" fill="#09090b"/>

  <!-- Bookmark icon -->
  <g transform="translate(170, 40)">
    <rect width="100" height="100" rx="20" fill="#18181b"/>
    <path d="M28 18h44a3 3 0 0 1 3 3v63.5a2.5 2.5 0 0 1-3.75 2.17L50 75l-21.25 11.67A2.5 2.5 0 0 1 25 84.5V21a3 3 0 0 1 3-3z" fill="#fafafa"/>
  </g>

  <!-- Title -->
  <text x="220" y="172" fill="#fafafa" font-size="28" font-weight="700" text-anchor="middle">Linkmark</text>

  <!-- Subtitle -->
  <text x="220" y="200" fill="#a1a1aa" font-size="14" text-anchor="middle">Save &amp; organize your bookmarks</text>

  <!-- Feature pills -->
  <rect x="60" y="224" width="90" height="28" rx="14" fill="#27272a"/>
  <text x="105" y="243" fill="#a1a1aa" font-size="11" text-anchor="middle" font-weight="500">One-click save</text>

  <rect x="162" y="224" width="116" height="28" rx="14" fill="#27272a"/>
  <text x="220" y="243" fill="#a1a1aa" font-size="11" text-anchor="middle" font-weight="500">Auto metadata</text>

  <rect x="290" y="224" width="90" height="28" rx="14" fill="#27272a"/>
  <text x="335" y="243" fill="#a1a1aa" font-size="11" text-anchor="middle" font-weight="500">Tags &amp; search</text>
</svg>`;

await sharp(Buffer.from(promoSvg)).png().toFile("store-assets/promo-440x280.png");
console.log("✓ promo-440x280.png");

console.log("\nAll store assets generated in store-assets/");
