import { Router } from 'express';
import { Prisma } from './generated/prisma/client.js';
import { prisma } from './db/prisma.js';
import { ApiError } from './middleware/errorHandler.js';
import { cacheControl } from './middleware/requestContext.js';
import { validate } from './middleware/validation.js';
import {
  codeParamSchema,
  countryCodeParamSchema,
  districtsQuerySchema,
  idParamSchema,
  paginationSchema,
  placesQuerySchema,
  regionsQuerySchema,
  searchQuerySchema,
  wardsQuerySchema,
} from './types.js';

const router = Router();

const RESOURCE_CACHE = 'public, max-age=300, stale-while-revalidate=60';
const SEARCH_CACHE = 'public, max-age=60, stale-while-revalidate=30';

interface SearchResult {
  id: number;
  region: string;
  district: string;
  ward: string;
  street: string | null;
  places: string | null;
  regioncode: number;
  districtcode: number;
  wardcode: number;
}

function toPagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
}

function contains(search?: string) {
  if (!search) {
    return undefined;
  }

  return {
    contains: search,
    mode: 'insensitive',
  };
}

router.get('/countries', cacheControl(RESOURCE_CACHE), validate({ query: paginationSchema }), async (req, res, next) => {
  try {
    const { limit, page, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [{ name: contains(search) }, { nicename: contains(search) }, { iso: contains(search) }],
        }
      : {};

    const [total, countries] = await Promise.all([
      prisma.countries.count({ where }),
      prisma.countries.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          iso: true,
          name: true,
          nicename: true,
          phonecode: true,
          numcode: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    res.json({
      data: countries,
      pagination: toPagination(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/countries/:id', cacheControl(RESOURCE_CACHE), validate({ params: idParamSchema }), async (req, res, next) => {
  try {
    const { id } = req.validatedParams;

    const country = await prisma.countries.findUnique({
      where: { id },
      select: {
        id: true,
        iso: true,
        name: true,
        nicename: true,
        phonecode: true,
        numcode: true,
      },
    });

    if (!country) {
      throw new ApiError(404, 'Country not found');
    }

    res.json({ data: country });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/countries/:countryCode/regions',
  cacheControl(RESOURCE_CACHE),
  validate({ params: countryCodeParamSchema }),
  async (req, res, next) => {
    try {
      const { countryCode } = req.validatedParams;

      const country = await prisma.countries.findUnique({
        where: { id: countryCode },
        select: { id: true },
      });

      if (!country) {
        throw new ApiError(404, 'Country not found');
      }

      const regions = await prisma.regions.findMany({
        where: { countryId: countryCode },
        select: {
          regionCode: true,
          regionName: true,
          countryId: true,
        },
        orderBy: { regionName: 'asc' },
      });

      res.json({ data: regions });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/regions', cacheControl(RESOURCE_CACHE), validate({ query: regionsQuerySchema }), async (req, res, next) => {
  try {
    const { countryId, limit, page, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    const where = {
      ...(countryId ? { countryId } : {}),
      ...(search ? { regionName: contains(search) } : {}),
    };

    const [total, regions] = await Promise.all([
      prisma.regions.count({ where }),
      prisma.regions.findMany({
        skip,
        take: limit,
        where,
        select: {
          regionCode: true,
          regionName: true,
          countryId: true,
          countries: {
            select: {
              iso: true,
              name: true,
            },
          },
        },
        orderBy: { regionName: 'asc' },
      }),
    ]);

    res.json({
      data: regions,
      pagination: toPagination(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/regions/:regionCode', cacheControl(RESOURCE_CACHE), validate({ params: codeParamSchema.pick({ regionCode: true }) }), async (req, res, next) => {
  try {
    const { regionCode } = req.validatedParams;

    const region = await prisma.regions.findUnique({
      where: { regionCode },
      select: {
        regionCode: true,
        regionName: true,
        countryId: true,
        countries: {
          select: {
            iso: true,
            name: true,
            nicename: true,
          },
        },
      },
    });

    if (!region) {
      throw new ApiError(404, 'Region not found');
    }

    res.json({ data: region });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/regions/:regionCode/districts',
  cacheControl(RESOURCE_CACHE),
  validate({
    params: codeParamSchema.pick({ regionCode: true }),
    query: paginationSchema,
  }),
  async (req, res, next) => {
    try {
      const { regionCode } = req.validatedParams;
      const { limit, page } = req.validatedQuery;
      const skip = (page - 1) * limit;

      const region = await prisma.regions.findUnique({
        where: { regionCode },
        select: { regionCode: true },
      });

      if (!region) {
        throw new ApiError(404, 'Region not found');
      }

      const [total, districts] = await Promise.all([
        prisma.districts.count({ where: { regionId: regionCode } }),
        prisma.districts.findMany({
          where: { regionId: regionCode },
          skip,
          take: limit,
          select: {
            districtCode: true,
            districtName: true,
            regionId: true,
            country_id: true,
          },
          orderBy: { districtName: 'asc' },
        }),
      ]);

      res.json({
        data: districts,
        pagination: toPagination(page, limit, total),
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/districts', cacheControl(RESOURCE_CACHE), validate({ query: districtsQuerySchema }), async (req, res, next) => {
  try {
    const { countryId, limit, page, regionCode, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    const where = {
      ...(countryId ? { country_id: countryId } : {}),
      ...(regionCode ? { regionId: regionCode } : {}),
      ...(search ? { districtName: contains(search) } : {}),
    };

    const [total, districts] = await Promise.all([
      prisma.districts.count({ where }),
      prisma.districts.findMany({
        skip,
        take: limit,
        where,
        select: {
          districtCode: true,
          districtName: true,
          regionId: true,
          country_id: true,
          regions: {
            select: {
              regionCode: true,
              regionName: true,
            },
          },
        },
        orderBy: { districtName: 'asc' },
      }),
    ]);

    res.json({
      data: districts,
      pagination: toPagination(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/districts/:districtCode', cacheControl(RESOURCE_CACHE), validate({ params: codeParamSchema.pick({ districtCode: true }) }), async (req, res, next) => {
  try {
    const { districtCode } = req.validatedParams;

    const district = await prisma.districts.findUnique({
      where: { districtCode },
      select: {
        districtCode: true,
        districtName: true,
        regionId: true,
        country_id: true,
        regions: {
          select: {
            regionCode: true,
            regionName: true,
          },
        },
        countries: {
          select: {
            iso: true,
            name: true,
          },
        },
      },
    });

    if (!district) {
      throw new ApiError(404, 'District not found');
    }

    res.json({ data: district });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/districts/:districtCode/wards',
  cacheControl(RESOURCE_CACHE),
  validate({ params: codeParamSchema.pick({ districtCode: true }) }),
  async (req, res, next) => {
    try {
      const { districtCode } = req.validatedParams;

      const district = await prisma.districts.findUnique({
        where: { districtCode },
        select: { districtCode: true },
      });

      if (!district) {
        throw new ApiError(404, 'District not found');
      }

      const wards = await prisma.wards.findMany({
        where: { districtId: districtCode },
        select: {
          wardCode: true,
          wardName: true,
          districtId: true,
          region_id: true,
          country_id: true,
        },
        orderBy: { wardName: 'asc' },
      });

      res.json({ data: wards });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/wards', cacheControl(RESOURCE_CACHE), validate({ query: wardsQuerySchema }), async (req, res, next) => {
  try {
    const { countryId, districtCode, limit, page, regionCode, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    const where = {
      ...(countryId ? { country_id: countryId } : {}),
      ...(districtCode ? { districtId: districtCode } : {}),
      ...(regionCode ? { region_id: regionCode } : {}),
      ...(search ? { wardName: contains(search) } : {}),
    };

    const [total, wards] = await Promise.all([
      prisma.wards.count({ where }),
      prisma.wards.findMany({
        skip,
        take: limit,
        where,
        select: {
          wardCode: true,
          wardName: true,
          districtId: true,
          region_id: true,
          country_id: true,
          districts: {
            select: {
              districtCode: true,
              districtName: true,
            },
          },
        },
        orderBy: { wardName: 'asc' },
      }),
    ]);

    res.json({
      data: wards,
      pagination: toPagination(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/wards/:wardCode', cacheControl(RESOURCE_CACHE), validate({ params: codeParamSchema.pick({ wardCode: true }) }), async (req, res, next) => {
  try {
    const { wardCode } = req.validatedParams;

    const ward = await prisma.wards.findUnique({
      where: { wardCode },
      select: {
        wardCode: true,
        wardName: true,
        districtId: true,
        region_id: true,
        country_id: true,
        districts: {
          select: {
            districtCode: true,
            districtName: true,
          },
        },
        regions: {
          select: {
            regionCode: true,
            regionName: true,
          },
        },
        countries: {
          select: {
            iso: true,
            name: true,
          },
        },
      },
    });

    if (!ward) {
      throw new ApiError(404, 'Ward not found');
    }

    res.json({ data: ward });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/wards/:wardCode/places',
  cacheControl(RESOURCE_CACHE),
  validate({ params: codeParamSchema.pick({ wardCode: true }) }),
  async (req, res, next) => {
    try {
      const { wardCode } = req.validatedParams;

      const ward = await prisma.wards.findUnique({
        where: { wardCode },
        select: { wardCode: true },
      });

      if (!ward) {
        throw new ApiError(404, 'Ward not found');
      }

      const places = await prisma.places.findMany({
        where: { wardId: wardCode },
        select: {
          id: true,
          placeName: true,
          wardId: true,
          district_id: true,
          region_id: true,
          country_id: true,
        },
        orderBy: { placeName: 'asc' },
      });

      res.json({ data: places });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/places', cacheControl(RESOURCE_CACHE), validate({ query: placesQuerySchema }), async (req, res, next) => {
  try {
    const { countryId, districtCode, limit, page, regionCode, search, wardCode } = req.validatedQuery;
    const skip = (page - 1) * limit;
    const where = {
      ...(countryId ? { country_id: countryId } : {}),
      ...(districtCode ? { district_id: districtCode } : {}),
      ...(regionCode ? { region_id: regionCode } : {}),
      ...(wardCode ? { wardId: wardCode } : {}),
      ...(search ? { placeName: contains(search) } : {}),
    };

    const [total, places] = await Promise.all([
      prisma.places.count({ where }),
      prisma.places.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          placeName: true,
          wardId: true,
          district_id: true,
          region_id: true,
          country_id: true,
        },
        orderBy: { placeName: 'asc' },
      }),
    ]);

    res.json({
      data: places,
      pagination: toPagination(page, limit, total),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/places/:id', cacheControl(RESOURCE_CACHE), validate({ params: idParamSchema }), async (req, res, next) => {
  try {
    const { id } = req.validatedParams;

    const place = await prisma.places.findUnique({
      where: { id },
      select: {
        id: true,
        placeName: true,
        wardId: true,
        district_id: true,
        region_id: true,
        country_id: true,
      },
    });

    if (!place) {
      throw new ApiError(404, 'Place not found');
    }

    res.json({ data: place });
  } catch (error) {
    next(error);
  }
});

router.get('/search', cacheControl(SEARCH_CACHE), validate({ query: searchQuerySchema }), async (req, res, next) => {
  try {
    const { q } = req.validatedQuery;

    // Strip null bytes that could bypass text processing
    const sanitised = q.replace(/\0/g, '');

    const results = await prisma.$queryRaw<SearchResult[]>(Prisma.sql`
      WITH query AS (
        SELECT plainto_tsquery('simple', ${sanitised}::text) AS tsq
      )
      SELECT g.id, g.region, g.district, g.ward, g.street, g.places,
             g.regioncode, g.districtcode, g.wardcode
      FROM "general" g, query
      WHERE g."search_vector" @@ query.tsq
      ORDER BY ts_rank(g."search_vector", query.tsq) DESC
      LIMIT 15
    `);

    res.json({ data: results });
  } catch (error) {
    next(error);
  }
});

export default router;
