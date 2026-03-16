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

CREATE UNIQUE INDEX "idx_countries_iso" ON "countries"("iso");

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
    "search_vector" tsvector,
    CONSTRAINT "general_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_general_search_vector" ON "general" USING GIN ("search_vector");

CREATE FUNCTION update_general_search_vector() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector := to_tsvector('simple'::regconfig, concat_ws(' '::text, NEW.region, NEW.district, NEW.ward, NEW.street, NEW.places));
    RETURN NEW;
END
$$;

CREATE TRIGGER set_general_search_vector
BEFORE INSERT OR UPDATE ON "general"
FOR EACH ROW
EXECUTE FUNCTION update_general_search_vector();

CREATE TABLE "regions" (
    "region_name" TEXT,
    "region_code" INTEGER NOT NULL,
    "general_locations_id" INTEGER,
    "country_id" INTEGER,
    CONSTRAINT "regions_pkey" PRIMARY KEY ("region_code")
);

CREATE INDEX "idx_regions_country_id" ON "regions"("country_id");
CREATE INDEX "idx_regions_general_id" ON "regions"("general_locations_id");

CREATE TABLE "districts" (
    "district_name" TEXT,
    "district_code" INTEGER NOT NULL,
    "general_locations_id" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,
    CONSTRAINT "districts_pkey" PRIMARY KEY ("district_code")
);

CREATE INDEX "idx_districts_country_id" ON "districts"("country_id");
CREATE INDEX "idx_districts_general_id" ON "districts"("general_locations_id");
CREATE INDEX "idx_districts_region_id" ON "districts"("region_id");

CREATE TABLE "wards" (
    "ward_name" TEXT,
    "ward_code" INTEGER NOT NULL,
    "district_id" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,
    "general_locations_id" INTEGER,
    CONSTRAINT "wards_pkey" PRIMARY KEY ("ward_code")
);

CREATE INDEX "idx_wards_country_id" ON "wards"("country_id");
CREATE INDEX "idx_wards_district_id" ON "wards"("district_id");
CREATE INDEX "idx_wards_general_id" ON "wards"("general_locations_id");
CREATE INDEX "idx_wards_region_id" ON "wards"("region_id");

CREATE TABLE "places" (
    "id" SERIAL NOT NULL,
    "place_name" TEXT,
    "ward_id" INTEGER,
    "district_id" INTEGER,
    "region_id" INTEGER,
    "country_id" INTEGER,
    "general_locations_id" INTEGER,
    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_places_country_id" ON "places"("country_id");
CREATE INDEX "idx_places_district_id" ON "places"("district_id");
CREATE INDEX "idx_places_general_id" ON "places"("general_locations_id");
CREATE INDEX "idx_places_region_id" ON "places"("region_id");
CREATE INDEX "idx_places_ward_id" ON "places"("ward_id");

ALTER TABLE "regions"
    ADD CONSTRAINT "regions_country_id_fkey"
    FOREIGN KEY ("country_id")
    REFERENCES "countries"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "regions"
    ADD CONSTRAINT "regions_general_locations_id_fkey"
    FOREIGN KEY ("general_locations_id")
    REFERENCES "general"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "districts"
    ADD CONSTRAINT "districts_country_id_fkey"
    FOREIGN KEY ("country_id")
    REFERENCES "countries"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "districts"
    ADD CONSTRAINT "districts_general_locations_id_fkey"
    FOREIGN KEY ("general_locations_id")
    REFERENCES "general"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "districts"
    ADD CONSTRAINT "districts_region_id_fkey"
    FOREIGN KEY ("region_id")
    REFERENCES "regions"("region_code")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "wards"
    ADD CONSTRAINT "wards_country_id_fkey"
    FOREIGN KEY ("country_id")
    REFERENCES "countries"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "wards"
    ADD CONSTRAINT "wards_district_id_fkey"
    FOREIGN KEY ("district_id")
    REFERENCES "districts"("district_code")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "wards"
    ADD CONSTRAINT "wards_general_locations_id_fkey"
    FOREIGN KEY ("general_locations_id")
    REFERENCES "general"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "wards"
    ADD CONSTRAINT "wards_region_id_fkey"
    FOREIGN KEY ("region_id")
    REFERENCES "regions"("region_code")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;

ALTER TABLE "places"
    ADD CONSTRAINT "places_general_locations_id_fkey"
    FOREIGN KEY ("general_locations_id")
    REFERENCES "general"("id")
    ON DELETE NO ACTION
    ON UPDATE NO ACTION;
