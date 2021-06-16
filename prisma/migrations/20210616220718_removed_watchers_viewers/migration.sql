/*
  Warnings:

  - You are about to drop the column `watcher_count` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `district_id` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `watcher_count` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `wards` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `wards` table. All the data in the column will be lost.
  - You are about to drop the column `view_count` on the `wards` table. All the data in the column will be lost.
  - You are about to drop the `general` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `ward_id` on table `places` required. The migration will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "districts" DROP CONSTRAINT "districts_country_id_fkey";

-- DropForeignKey
ALTER TABLE "wards" DROP CONSTRAINT "wards_country_id_fkey";

-- DropForeignKey
ALTER TABLE "wards" DROP CONSTRAINT "wards_region_id_fkey";

-- AlterTable
ALTER TABLE "districts" DROP COLUMN "watcher_count",
DROP COLUMN "view_count",
DROP COLUMN "country_id";

-- AlterTable
ALTER TABLE "places" DROP COLUMN "view_count",
DROP COLUMN "district_id",
ALTER COLUMN "ward_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "regions" DROP COLUMN "watcher_count",
DROP COLUMN "view_count";

-- AlterTable
ALTER TABLE "wards" DROP COLUMN "region_id",
DROP COLUMN "country_id",
DROP COLUMN "view_count";

-- DropTable
DROP TABLE "general";

-- AddForeignKey
ALTER TABLE "places" ADD FOREIGN KEY ("ward_id") REFERENCES "wards"("ward_code") ON DELETE CASCADE ON UPDATE CASCADE;
