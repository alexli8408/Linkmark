export interface ParsedBookmark {
  url: string;
  title: string | null;
  note: string | null;
  tags: string[];
  createdAt: string | null;
}

export function parseBookmarkHtml(html: string): ParsedBookmark[] {
  const bookmarks: ParsedBookmark[] = [];
  const folderStack: string[] = [];
  const lines = html.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Track folder open: <H3>Folder Name</H3>
    const folderMatch = line.match(/<H3[^>]*>(.*?)<\/H3>/i);
    if (folderMatch) {
      folderStack.push(folderMatch[1].toLowerCase());
      continue;
    }

    // Track folder close
    if (line === "</DL><p>" || line === "</DL>") {
      folderStack.pop();
      continue;
    }

    // Extract bookmark: <A HREF="url" ADD_DATE="timestamp">Title</A>
    const linkMatch = line.match(
      /<A[^>]*HREF="([^"]*)"[^>]*>([\s\S]*?)<\/A>/i
    );
    if (linkMatch) {
      const url = linkMatch[1];
      const title = linkMatch[2].trim();

      const addDateMatch = line.match(/ADD_DATE="(\d+)"/i);
      const createdAt = addDateMatch
        ? new Date(parseInt(addDateMatch[1]) * 1000).toISOString()
        : null;

      // Next line might be a <DD> description
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
      const ddMatch = nextLine.match(/^<DD>(.*)/i);
      const note = ddMatch ? ddMatch[1].trim() || null : null;

      bookmarks.push({
        url,
        title: title || null,
        note,
        tags: [...folderStack],
        createdAt,
      });
    }
  }

  return bookmarks;
}
