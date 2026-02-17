-- AlterTable
ALTER TABLE "CollectionBookmark" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "CollectionBookmark_collectionId_position_idx" ON "CollectionBookmark"("collectionId", "position");
