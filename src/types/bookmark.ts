export interface BookmarkTag {
  tag: { id: string; name: string };
}

export interface Bookmark {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
  note: string | null;
  createdAt: string;
  tags: BookmarkTag[];
  metadataStatus?: string;
}
