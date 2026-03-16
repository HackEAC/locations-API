import { disconnectPrisma, prisma } from '../src/db/prisma.js';

async function seed() {
  await prisma.$transaction([
    prisma.places.deleteMany(),
    prisma.wards.deleteMany(),
    prisma.districts.deleteMany(),
    prisma.regions.deleteMany(),
    prisma.general.deleteMany(),
    prisma.countries.deleteMany(),
  ]);

  await prisma.countries.createMany({
    data: [
      {
        id: 1,
        iso: 'TZ',
        iso3: 'TZA',
        name: 'Tanzania',
        nicename: 'United Republic of Tanzania',
        numcode: 834,
        phonecode: 255,
      },
      {
        id: 2,
        iso: 'KE',
        iso3: 'KEN',
        name: 'Kenya',
        nicename: 'Republic of Kenya',
        numcode: 404,
        phonecode: 254,
      },
    ],
  });

  await prisma.general.createMany({
    data: [
      {
        id: 1,
        countryId: 1,
        region: 'Dodoma',
        regioncode: 12,
        district: 'Dodoma Urban',
        districtcode: 1201,
        ward: 'Nzuguni',
        wardcode: 120101,
        street: 'Nzuguni Road',
        places: 'Nzuguni Center',
      },
      {
        id: 2,
        countryId: 1,
        region: 'Arusha',
        regioncode: 11,
        district: 'Arusha Urban',
        districtcode: 1101,
        ward: 'Kaloleni',
        wardcode: 110101,
        street: 'Clock Tower Avenue',
        places: 'Arusha Clock Tower',
      },
      {
        id: 3,
        countryId: 2,
        region: 'Nairobi',
        regioncode: 21,
        district: 'Westlands',
        districtcode: 2101,
        ward: 'Parklands',
        wardcode: 210101,
        street: 'Westlands Road',
        places: 'Sarit Centre',
      },
    ],
  });

  await prisma.regions.createMany({
    data: [
      { countryId: 1, general_locations_id: 2, regionCode: 11, regionName: 'Arusha' },
      { countryId: 1, general_locations_id: 1, regionCode: 12, regionName: 'Dodoma' },
      { countryId: 2, general_locations_id: 3, regionCode: 21, regionName: 'Nairobi' },
    ],
  });

  await prisma.districts.createMany({
    data: [
      {
        country_id: 1,
        districtCode: 1101,
        districtName: 'Arusha Urban',
        general_locations_id: 2,
        regionId: 11,
      },
      {
        country_id: 1,
        districtCode: 1201,
        districtName: 'Dodoma Urban',
        general_locations_id: 1,
        regionId: 12,
      },
      {
        country_id: 2,
        districtCode: 2101,
        districtName: 'Westlands',
        general_locations_id: 3,
        regionId: 21,
      },
    ],
  });

  await prisma.wards.createMany({
    data: [
      {
        country_id: 1,
        districtId: 1101,
        general_locations_id: 2,
        region_id: 11,
        wardCode: 110101,
        wardName: 'Kaloleni',
      },
      {
        country_id: 1,
        districtId: 1201,
        general_locations_id: 1,
        region_id: 12,
        wardCode: 120101,
        wardName: 'Nzuguni',
      },
      {
        country_id: 2,
        districtId: 2101,
        general_locations_id: 3,
        region_id: 21,
        wardCode: 210101,
        wardName: 'Parklands',
      },
    ],
  });

  await prisma.places.createMany({
    data: [
      {
        country_id: 1,
        district_id: 1101,
        general_locations_id: 2,
        id: 1,
        placeName: 'Arusha Clock Tower',
        region_id: 11,
        wardId: 110101,
      },
      {
        country_id: 1,
        district_id: 1201,
        general_locations_id: 1,
        id: 2,
        placeName: 'Nzuguni Center',
        region_id: 12,
        wardId: 120101,
      },
      {
        country_id: 2,
        district_id: 2101,
        general_locations_id: 3,
        id: 3,
        placeName: 'Sarit Centre',
        region_id: 21,
        wardId: 210101,
      },
    ],
  });
}

seed()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });
