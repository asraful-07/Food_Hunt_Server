/*
  Warnings:

  - You are about to drop the `providerProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "meal" DROP CONSTRAINT "meal_providerId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_providerId_fkey";

-- DropForeignKey
ALTER TABLE "providerProfile" DROP CONSTRAINT "providerProfile_userId_fkey";

-- AlterTable
ALTER TABLE "cart" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "meal" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "wish" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "providerProfile";

-- CreateTable
CREATE TABLE "provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_Profile" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "restaurantAddress" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_userId_key" ON "provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "provider_email_key" ON "provider"("email");

-- CreateIndex
CREATE UNIQUE INDEX "provider_restaurantName_key" ON "provider"("restaurantName");

-- CreateIndex
CREATE INDEX "provider_userId_idx" ON "provider"("userId");

-- CreateIndex
CREATE INDEX "idx_provider_isDeleted" ON "provider"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "provider_Profile_providerId_key" ON "provider_Profile"("providerId");

-- CreateIndex
CREATE INDEX "provider_Profile_providerId_idx" ON "provider_Profile"("providerId");

-- CreateIndex
CREATE INDEX "idx_providerProfile_isDeleted" ON "provider_Profile"("isDeleted");

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider_Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider" ADD CONSTRAINT "provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_Profile" ADD CONSTRAINT "provider_Profile_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
