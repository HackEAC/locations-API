-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "iso" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "nicename" TEXT NOT NULL,
    "iso3" CHAR(3),
    "numcode" INTEGER,
    "phonecode" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "district_name" TEXT,
    "district_code" INTEGER NOT NULL,
    "watcher_count" INTEGER,
    "view_count" INTEGER,
    "properties_count" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,

    PRIMARY KEY ("district_code")
);

-- CreateTable
CREATE TABLE "general" (
    "id" SERIAL NOT NULL,
    "region" VARCHAR NOT NULL,
    "regioncode" INTEGER NOT NULL,
    "district" VARCHAR NOT NULL,
    "districtcode" INTEGER NOT NULL,
    "ward" VARCHAR NOT NULL,
    "wardcode" INTEGER,
    "street" VARCHAR,
    "places" VARCHAR,
    "country_id" INTEGER
);

-- CreateTable
CREATE TABLE "places" (
    "id" SERIAL NOT NULL,
    "place_name" TEXT,
    "view_count" INTEGER,
    "properties_count" INTEGER,
    "ward_id" INTEGER,
    "district_id" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "region_name" TEXT,
    "region_code" INTEGER NOT NULL,
    "watcher_count" INTEGER,
    "view_count" INTEGER,
    "properties_count" INTEGER,
    "country_id" INTEGER,

    PRIMARY KEY ("region_code")
);

-- CreateTable
CREATE TABLE "wards" (
    "ward_name" TEXT,
    "ward_code" INTEGER NOT NULL,
    "district_id" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,
    "view_count" INTEGER,
    "properties_count" INTEGER,

    PRIMARY KEY ("ward_code")
);

-- AddForeignKey
ALTER TABLE "regions" ADD FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD FOREIGN KEY ("region_id") REFERENCES "regions"("region_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD FOREIGN KEY ("district_id") REFERENCES "districts"("district_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD FOREIGN KEY ("region_id") REFERENCES "regions"("region_code") ON DELETE SET NULL ON UPDATE CASCADE;
