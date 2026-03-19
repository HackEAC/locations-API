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
ALTER TABLE "districts" DROP COLUMN IF EXISTS "properties_count",
DROP COLUMN IF EXISTS "view_count",
DROP COLUMN IF EXISTS "watcher_count";

-- AlterTable
ALTER TABLE "places" DROP COLUMN IF EXISTS "properties_count",
DROP COLUMN IF EXISTS "view_count";

-- AlterTable
ALTER TABLE "regions" DROP COLUMN IF EXISTS "properties_count",
DROP COLUMN IF EXISTS "view_count",
DROP COLUMN IF EXISTS "watcher_count";

-- AlterTable
ALTER TABLE "wards" DROP COLUMN IF EXISTS "properties_count",
DROP COLUMN IF EXISTS "view_count";
