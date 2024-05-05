/*
  Warnings:

  - You are about to drop the `_ChatRoomMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChatRoomMembers" DROP CONSTRAINT "_ChatRoomMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatRoomMembers" DROP CONSTRAINT "_ChatRoomMembers_B_fkey";

-- DropTable
DROP TABLE "_ChatRoomMembers";

-- CreateTable
CREATE TABLE "_MemberChatRooms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MemberChatRooms_AB_unique" ON "_MemberChatRooms"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberChatRooms_B_index" ON "_MemberChatRooms"("B");

-- AddForeignKey
ALTER TABLE "_MemberChatRooms" ADD CONSTRAINT "_MemberChatRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberChatRooms" ADD CONSTRAINT "_MemberChatRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
