-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "metadataStatus" TEXT NOT NULL DEFAULT 'pending';

-- Set existing bookmarks to complete (they already have metadata)
UPDATE "Bookmark" SET "metadataStatus" = 'complete';
