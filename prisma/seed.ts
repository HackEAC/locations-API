import { disconnectPrisma, prisma } from '../src/db/prisma.js';

async function seed() {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      'TRUNCATE TABLE "places", "wards", "districts", "regions", "general", "countries" RESTART IDENTITY CASCADE',
    );

    const tanzania = await tx.countries.create({
      data: {
        iso: 'TZ',
        iso3: 'TZA',
        name: 'Tanzania',
        nicename: 'United Republic of Tanzania',
        numcode: 834,
        phonecode: 255,
      },
    });

    const kenya = await tx.countries.create({
      data: {
        iso: 'KE',
        iso3: 'KEN',
        name: 'Kenya',
        nicename: 'Republic of Kenya',
        numcode: 404,
        phonecode: 254,
      },
    });

    const dodomaGeneral = await tx.general.create({
      data: {
        countryId: tanzania.id,
        region: 'Dodoma',
        regioncode: 12,
        district: 'Dodoma Urban',
        districtcode: 1201,
        ward: 'Nzuguni',
        wardcode: 120101,
        street: 'Nzuguni Road',
        places: 'Nzuguni Center',
      },
    });

    const arushaGeneral = await tx.general.create({
      data: {
        countryId: tanzania.id,
        region: 'Arusha',
        regioncode: 11,
        district: 'Arusha Urban',
        districtcode: 1101,
        ward: 'Kaloleni',
        wardcode: 110101,
        street: 'Clock Tower Avenue',
        places: 'Arusha Clock Tower',
      },
    });

    const nairobiGeneral = await tx.general.create({
      data: {
        countryId: kenya.id,
        region: 'Nairobi',
        regioncode: 21,
        district: 'Westlands',
        districtcode: 2101,
        ward: 'Parklands',
        wardcode: 210101,
        street: 'Westlands Road',
        places: 'Sarit Centre',
      },
    });

    await tx.regions.createMany({
      data: [
        { countryId: tanzania.id, general_locations_id: arushaGeneral.id, regionCode: 11, regionName: 'Arusha' },
        { countryId: tanzania.id, general_locations_id: dodomaGeneral.id, regionCode: 12, regionName: 'Dodoma' },
        { countryId: kenya.id, general_locations_id: nairobiGeneral.id, regionCode: 21, regionName: 'Nairobi' },
      ],
    });

    await tx.districts.createMany({
      data: [
        {
          country_id: tanzania.id,
          districtCode: 1101,
          districtName: 'Arusha Urban',
          general_locations_id: arushaGeneral.id,
          regionId: 11,
        },
        {
          country_id: tanzania.id,
          districtCode: 1201,
          districtName: 'Dodoma Urban',
          general_locations_id: dodomaGeneral.id,
          regionId: 12,
        },
        {
          country_id: kenya.id,
          districtCode: 2101,
          districtName: 'Westlands',
          general_locations_id: nairobiGeneral.id,
          regionId: 21,
        },
      ],
    });

    await tx.wards.createMany({
      data: [
        {
          country_id: tanzania.id,
          districtId: 1101,
          general_locations_id: arushaGeneral.id,
          region_id: 11,
          wardCode: 110101,
          wardName: 'Kaloleni',
        },
        {
          country_id: tanzania.id,
          districtId: 1201,
          general_locations_id: dodomaGeneral.id,
          region_id: 12,
          wardCode: 120101,
          wardName: 'Nzuguni',
        },
        {
          country_id: kenya.id,
          districtId: 2101,
          general_locations_id: nairobiGeneral.id,
          region_id: 21,
          wardCode: 210101,
          wardName: 'Parklands',
        },
      ],
    });

    await tx.places.create({
      data: {
        country_id: tanzania.id,
        district_id: 1101,
        general_locations_id: arushaGeneral.id,
        placeName: 'Arusha Clock Tower',
        region_id: 11,
        wardId: 110101,
      },
    });

    await tx.places.create({
      data: {
        country_id: tanzania.id,
        district_id: 1201,
        general_locations_id: dodomaGeneral.id,
        placeName: 'Nzuguni Center',
        region_id: 12,
        wardId: 120101,
      },
    });

    await tx.places.create({
      data: {
        country_id: kenya.id,
        district_id: 2101,
        general_locations_id: nairobiGeneral.id,
        placeName: 'Sarit Centre',
        region_id: 21,
        wardId: 210101,
      },
    });
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
