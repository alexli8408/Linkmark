const $ = (id) => document.getElementById(id);

const views = {
  show(name) {
    ["setup", "form", "success"].forEach((v) => {
      $(v).classList.toggle("hidden", v !== name);
    });
  },
};

async function init() {
  let serverUrl, apiKey;
  try {
    ({ serverUrl, apiKey } = await chrome.storage.sync.get([
      "serverUrl",
      "apiKey",
    ]));
  } catch {
    views.show("setup");
    return;
  }

  if (!serverUrl || !apiKey) {
    views.show("setup");
    return;
  }

  views.show("form");

  // Get current tab info
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    $("url").value = tab?.url || "";
    $("title").value = tab?.title || "";

    // Check if already saved
    if (tab?.url) {
      const res = await fetch(
        `${serverUrl}/api/extension/bookmarks?url=${encodeURIComponent(tab.url)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          $("alreadySaved").classList.remove("hidden");
          $("saveBookmark").textContent = "Already Saved";
          $("saveBookmark").disabled = true;
        }
      }
    }
  } catch {
    // Ignore — will fail on save if server is unreachable
  }
}

// Save settings
$("saveSettings").addEventListener("click", async () => {
  const serverUrl = $("serverUrl").value.replace(/\/+$/, "");
  const apiKey = $("apiKey").value.trim();

  if (!serverUrl || !apiKey) {
    $("setupError").textContent = "Both fields are required";
    return;
  }

  // Verify the API key works
  try {
    const res = await fetch(
      `${serverUrl}/api/extension/bookmarks?url=https://test.com`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (res.status === 401) {
      $("setupError").textContent = "Invalid API key";
      return;
    }
  } catch {
    $("setupError").textContent = "Cannot reach server";
    return;
  }

  await chrome.storage.sync.set({ serverUrl, apiKey });
  init();
});

// Save bookmark
$("saveBookmark").addEventListener("click", async () => {
  const { serverUrl, apiKey } = await chrome.storage.sync.get([
    "serverUrl",
    "apiKey",
  ]);

  const url = $("url").value;
  const title = $("title").value;
  const tagsRaw = $("tags").value;
  const note = $("note").value;

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  $("saveBookmark").disabled = true;
  $("saveBookmark").textContent = "Saving...";
  $("formError").textContent = "";

  try {
    const res = await fetch(`${serverUrl}/api/extension/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url, title, note: note || undefined, tags }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 409) {
        $("alreadySaved").classList.remove("hidden");
        $("saveBookmark").textContent = "Already Saved";
        return;
      }
      throw new Error(data.error || "Failed to save");
    }

    views.show("success");
  } catch (err) {
    $("formError").textContent = err.message;
    $("saveBookmark").disabled = false;
    $("saveBookmark").textContent = "Save Bookmark";
  }
});

// Open settings
$("openSettings").addEventListener("click", () => {
  chrome.storage.sync.get(["serverUrl", "apiKey"], (data) => {
    $("serverUrl").value = data.serverUrl || "";
    $("apiKey").value = data.apiKey || "";
    views.show("setup");
  });
});

// Close success
$("closeSuccess").addEventListener("click", () => window.close());

// Init
init();
