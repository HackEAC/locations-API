ALTER TABLE "general"
ADD COLUMN "search_vector" tsvector;

UPDATE "general"
SET "search_vector" = to_tsvector(
  'simple'::regconfig,
  concat_ws(' '::text, "region", "district", "ward", "street", "places")
);

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

CREATE INDEX "idx_general_search_vector" ON "general" USING GIN ("search_vector");
