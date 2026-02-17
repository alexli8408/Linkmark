-- Create a GIN index for full-text search on bookmarks
CREATE INDEX "Bookmark_fulltext_idx" ON "Bookmark"
USING GIN (
  to_tsvector('english',
    coalesce("title", '') || ' ' ||
    coalesce("description", '') || ' ' ||
    coalesce("url", '') || ' ' ||
    coalesce("note", '')
  )
);
