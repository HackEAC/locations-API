-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "iso" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "nicename" TEXT NOT NULL,
    "iso3" CHAR(3),
    "numcode" INTEGER,
    "phonecode" INTEGER NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "district_name" TEXT,
    "district_code" INTEGER NOT NULL,
    "watcher_count" INTEGER,
    "view_count" INTEGER,
    "general_locations_id" INTEGER,
    "properties_count" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("district_code")
);

-- CreateTable
CREATE TABLE "places" (
    "id" SERIAL NOT NULL,
    "place_name" TEXT,
    "view_count" INTEGER,
    "properties_count" INTEGER,
    "ward_id" INTEGER,
    "district_id" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,
    "general_locations_id" INTEGER,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "region_name" TEXT,
    "region_code" INTEGER NOT NULL,
    "watcher_count" INTEGER,
    "view_count" INTEGER,
    "general_locations_id" INTEGER,
    "properties_count" INTEGER,
    "country_id" INTEGER,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("region_code")
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
    "general_locations_id" INTEGER,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("ward_code")
);

-- CreateTable
CREATE TABLE "general" (
    "id" SERIAL NOT NULL,
    "country_id" INTEGER,
    "region" VARCHAR NOT NULL,
    "regioncode" INTEGER NOT NULL,
    "district" VARCHAR NOT NULL,
    "districtcode" INTEGER NOT NULL,
    "ward" VARCHAR NOT NULL,
    "wardcode" INTEGER NOT NULL,
    "street" VARCHAR,
    "places" VARCHAR,

    CONSTRAINT "general_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_general_locations_id_fkey" FOREIGN KEY ("general_locations_id") REFERENCES "general"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_general_locations_id_fkey" FOREIGN KEY ("general_locations_id") REFERENCES "general"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_general_locations_id_fkey" FOREIGN KEY ("general_locations_id") REFERENCES "general"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("district_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_general_locations_id_fkey" FOREIGN KEY ("general_locations_id") REFERENCES "general"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_code") ON DELETE NO ACTION ON UPDATE NO ACTION;

