## Description

Locations API from [Tanzania locations](https://github.com/HackEAC/tanzania-locations-db) repository.

Inspired by [Mtaa API](https://github.com/HackEAC/mtaaAPI/) which was
built using python & locations from a JSON file.

This is built using Prisma, NestJs & Postgresql database.

## Setup
Create file ```.env``` then copy variables in ```sample.env```

You need to provide Postgresql environment in enviroment file ```.env```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Access API


You can access this API using any Http Request tool (ie. Postman, Httpie,
curl etc)

Available locations

1. Countries

- Get all countries

    https://locations.webongo.services/countries

    http://localhost:3000/countries


2. Regions

- Get all regions

    https://locations.webongo.services/regions

    http://localhost:3000/regions


- Get specific region (By postcode)

    https://locations.webongo.services/regions/CODE

    http://locations.webongo.services/regions/CODE

- Get specific region (By Name)

    https://locations.webongo.services/regions/name/REGION_NAME

    http://locations.webongo.services/regions/name/REGION_NAME

3. The same applies to Districts, Wards & Places

4. Search

    https://locations.webongo.services/search searchText=n

    (n.length >= 3)

5. Whatever you query by id (Regions, Districts, Wards, Places)
    
you get it's discending location roots using Prisma relations.


The syntax is the same for other objects

Replace `regions` with `districts`, `wards` & `places` to get the specific
location you want.


## Examples 

Get all regions

    curl https://locations.webongo.services/regions

Get all districts

    curl https://locations.webongo.services/districts

Get all wards

    curl https://locations.webongo.services/wards

Get all places -> May be a bit slow & big bodied ;-)

    curl https://locations.webongo.services/places


## Credits

- [MTAA-API](https://github.com/HackEAC/mtaaAPI/)
- [MTAA Python Package](https://github.com/Kalebu/mtaa)
- [Tanzania Locations DB](https://github.com/HackEAC/tanzania-locations-db/)
