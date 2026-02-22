/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `providerProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `providerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `providerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "providerProfile" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "providerProfile_email_key" ON "providerProfile"("email");
