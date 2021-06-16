-- AlterTable
ALTER TABLE "districts" ADD COLUMN     "general_id" INTEGER,
ADD COLUMN     "country_id" INTEGER;

-- AlterTable
ALTER TABLE "places" ADD COLUMN     "general_id" INTEGER,
ADD COLUMN     "country_id" INTEGER;

-- AlterTable
ALTER TABLE "regions" ADD COLUMN     "general_id" INTEGER;

-- AlterTable
ALTER TABLE "wards" ADD COLUMN     "general_id" INTEGER,
ADD COLUMN     "country_id" INTEGER;

-- CreateTable
CREATE TABLE "general" (
    "id" INTEGER NOT NULL,
    "country_id" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "districtCode" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "regionCode" INTEGER NOT NULL,
    "ward" TEXT NOT NULL,
    "wardCode" INTEGER NOT NULL,
    "places" TEXT,
    "street" TEXT,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "districts" ADD FOREIGN KEY ("general_id") REFERENCES "general"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD FOREIGN KEY ("general_id") REFERENCES "general"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regions" ADD FOREIGN KEY ("general_id") REFERENCES "general"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD FOREIGN KEY ("general_id") REFERENCES "general"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
