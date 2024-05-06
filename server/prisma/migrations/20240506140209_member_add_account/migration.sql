/*
  Warnings:

  - A unique constraint covering the columns `[account]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "account" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "members_account_key" ON "members"("account");
