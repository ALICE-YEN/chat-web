/*
  Warnings:

  - You are about to drop the column `members` on the `chat_rooms` table. All the data in the column will be lost.
  - You are about to drop the `_chatRecipients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_chatRecipients" DROP CONSTRAINT "_chatRecipients_A_fkey";

-- DropForeignKey
ALTER TABLE "_chatRecipients" DROP CONSTRAINT "_chatRecipients_B_fkey";

-- AlterTable
ALTER TABLE "chat_rooms" DROP COLUMN "members";

-- DropTable
DROP TABLE "_chatRecipients";

-- CreateTable
CREATE TABLE "_ChatRoomMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatRecipients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRoomMembers_AB_unique" ON "_ChatRoomMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRoomMembers_B_index" ON "_ChatRoomMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatRecipients_AB_unique" ON "_ChatRecipients"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatRecipients_B_index" ON "_ChatRecipients"("B");

-- AddForeignKey
ALTER TABLE "_ChatRoomMembers" ADD CONSTRAINT "_ChatRoomMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRoomMembers" ADD CONSTRAINT "_ChatRoomMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRecipients" ADD CONSTRAINT "_ChatRecipients_A_fkey" FOREIGN KEY ("A") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatRecipients" ADD CONSTRAINT "_ChatRecipients_B_fkey" FOREIGN KEY ("B") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
