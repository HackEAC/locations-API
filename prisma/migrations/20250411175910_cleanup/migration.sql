/*
  Warnings:

  - You are about to drop the column `properties_count` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `watcher_count` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `properties_count` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `properties_count` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `watcher_count` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `properties_count` on the `wards` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `wards` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "districts" DROP COLUMN "properties_count",
DROP COLUMN "view_count",
DROP COLUMN "watcher_count";

-- AlterTable
ALTER TABLE "places" DROP COLUMN "properties_count",
DROP COLUMN "view_count";

-- AlterTable
ALTER TABLE "regions" DROP COLUMN "properties_count",
DROP COLUMN "view_count",
DROP COLUMN "watcher_count";

-- AlterTable
ALTER TABLE "wards" DROP COLUMN "properties_count",
DROP COLUMN "view_count";
