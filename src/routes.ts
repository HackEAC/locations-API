import { Router } from 'express';
import { validate } from './middleware/validation';
import { prisma } from './app';
import { ApiError } from './middleware/errorHandler';
import { 
  codeParamSchema,
  idParamSchema,
  paginationSchema,
} from './types';

const router = Router();

// ==================== COUNTRIES ROUTES ====================

/**
 * @route GET /api/countries
 * @description Get all countries with optional pagination and search
 */
router.get('/countries', validate({ query: paginationSchema }), async (req, res, next) => {
  try {
    const { page, limit, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    const whereClause = search ? { name: { contains: search } } : {};
    
    const total = await prisma.countries.count({ where: whereClause });
    
    const countries = await prisma.countries.findMany({
      skip,
      take: limit,
      where: whereClause,
      select: {
        id: true,
        name: true,
        iso: true,
        nicename: true,
        phonecode: true,
        numcode: true,
      },
      orderBy: { name: 'asc' }
    });
    
    res.json({
      data: countries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/countries/:id
 * @description Get country by ID
 */
router.get('/countries/:id', validate({ params: idParamSchema }), async (req, res, next) => {
  try {
    const countryId = req.params.id;
    
    const country = await prisma.countries.findUnique({
      where: { id: +countryId },
      select: {
        id: true,
        name: true,
        iso: true,
        nicename: true,
        phonecode: true,
        numcode: true
      }
    });
    
    if (!country) {
      throw new ApiError(404, 'Country not found');
    }
    
    res.json({ data: country });
  } catch (error) {
    next(error);
  }
});

// ==================== REGIONS ROUTES ====================

/**
 * @route GET /api/regions
 * @description Get all regions with pagination and optional filtering
 */
router.get('/regions', validate({ query: paginationSchema }), async (req, res, next) => {
  try {
    const { page, limit, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    
    // Handle search query if present
    const whereClause = search ? { regionName: { contains: search } } : {};
    
    const total = await prisma.regions.count({ where: whereClause });
    
    const regions = await prisma.regions.findMany({
      skip,
      take: limit,
      where: whereClause,
      select: {
        regionCode: true,
        regionName: true,
        countryId: true,
        countries: {
          select: {
            name: true
          }
        }
      },
      orderBy: { regionName: 'asc' }
    });
    
    res.json({
      data: regions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/regions/:regionCode
 * @description Get a specific region by code
 */
router.get('/regions/:regionCode', validate({ params: codeParamSchema.pick({ regionCode: true }) }), async (req, res, next) => {
  try {
    const regionCode = +req.params.regionCode;
    
    const region = await prisma.regions.findUnique({
      where: { regionCode },
      select: {
        regionCode: true,
        regionName: true,
        countryId: true,
        countries: {
          select: {
            name: true,
            nicename: true
          }
        }
      }
    });
    
    if (!region || Object.keys(region).length === 0) {
      throw new ApiError(404, 'Region not found');
    }
    
    res.json({ data: region });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/regions/:regionCode/districts
 * @description Get all districts in a region
 */
router.get('/regions/:regionCode/districts', 
  validate({ params: codeParamSchema.pick({ regionCode: true }) }),
  validate({ query: paginationSchema }),
  async (req, res, next) => {
    try {
      const regionCode = +req.params.regionCode;
      const { page, limit } = req.validatedQuery;
      const skip = (page - 1) * limit;
      
      // Verify region exists
      const regionExists = await prisma.regions.findUnique({
        where: { regionCode },
        select: { regionCode: true }
      });
      
      if (!regionExists) {
        throw new ApiError(404, 'Region not found');
      }
      
      // Get districts count
      const total = await prisma.districts.count({
        where: { regionId: regionCode }
      });
      
      // Get districts
      const districts = await prisma.districts.findMany({
        where: { regionId: regionCode },
        skip,
        take: limit,
        select: {
          districtCode: true,
          districtName: true,
          regionId: true
        },
        orderBy: { districtName: 'asc' }
      });
      
      res.json({
        data: districts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==================== DISTRICTS ROUTES ====================

/**
 * @route GET /api/districts
 * @description Get all districts with pagination and optional search
 */
router.get('/districts', validate({ query: paginationSchema }), async (req, res, next) => {
  try {
    const { page, limit, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    
    // Handle search if present
    const whereClause = search ? { districtName: { contains: search } } : {};
    
    const total = await prisma.districts.count({ where: whereClause });
    
    const districts = await prisma.districts.findMany({
      skip,
      take: limit,
      where: whereClause,
      select: {
        districtCode: true,
        districtName: true,
        regionId: true,
        country_id: true,
        regions: {
          select: {
            regionName: true
          }
        }
      },
      orderBy: { districtName: 'asc' }
    });
    
    res.json({
      data: districts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/districts/:districtCode
 * @description Get district by code
 */
router.get('/districts/:districtCode', validate({ params: codeParamSchema.pick({ districtCode: true }) }), async (req, res, next) => {
  try {
    const districtCode = +req.params.districtCode;
    
    const district = await prisma.districts.findUnique({
      where: { districtCode },
      select: {
        districtCode: true,
        districtName: true,
        regionId: true,
        country_id: true,
        regions: {
          select: {
            regionName: true
          }
        },
        countries: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!district) {
      throw new ApiError(404, 'District not found');
    }
    
    res.json({ data: district });
  } catch (error) {
    next(error);
  }
});

// ==================== WARDS ROUTES ====================

/**
 * @route GET /api/wards
 * @description Get all wards with pagination and search
 */
router.get('/wards', validate({ query: paginationSchema }), async (req, res, next) => {
  try {
    const { page, limit, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    
    // Handle search if present
    const whereClause = search ? { wardName: { contains: search } } : {};
    
    const total = await prisma.wards.count({ where: whereClause });
    
    const wards = await prisma.wards.findMany({
      skip,
      take: limit,
      where: whereClause,
      select: {
        wardCode: true,
        wardName: true,
        districtId: true,
        region_id: true,
        country_id: true,
        districts: {
          select: {
            districtName: true
          }
        }
      },
      orderBy: { wardName: 'asc' }
    });
    
    res.json({
      data: wards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/wards/:wardCode
 * @description Get ward by code
 */
router.get('/wards/:wardCode', validate({ params: codeParamSchema.pick({ wardCode: true }) }), async (req, res, next) => {
  try {
    const wardCode = +req.params.wardCode;
    
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
            districtName: true
          }
        },
        regions: {
          select: {
            regionName: true
          }
        },
        countries: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!ward) {
      throw new ApiError(404, 'Ward not found');
    }
    
    res.json({ data: ward });
  } catch (error) {
    next(error);
  }
});

// ==================== PLACES ROUTES ====================

/**
 * @route GET /api/places
 * @description Get all places with pagination and search
 */
router.get('/places', validate({ query: paginationSchema }), async (req, res, next) => {
  try {
    const { page, limit, search } = req.validatedQuery;
    const skip = (page - 1) * limit;
    
    // Handle search if present
    const whereClause = search ? { placeName: { contains: search } } : {};
    
    const total = await prisma.places.count({ where: whereClause });
    
    const places = await prisma.places.findMany({
      skip,
      take: limit,
      where: whereClause,
      select: {
        id: true,
        placeName: true,
        wardId: true,
        district_id: true,
        region_id: true,
        country_id: true
      },
      orderBy: { placeName: 'asc' }
    });
    
    res.json({
      data: places,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/places/:id
 * @description Get place by ID
 */
router.get('/places/:id', validate({ params: idParamSchema }), async (req, res, next) => {
  try {
    const placeId = +req.params.id;
    
    const place = await prisma.places.findUnique({
      where: { id: placeId },
      select: {
        id: true,
        placeName: true,
        wardId: true,
        district_id: true,
        region_id: true,
        country_id: true
      }
    });
    
    if (!place) {
      throw new ApiError(404, 'Place not found');
    }
    
    res.json({ data: place });
  } catch (error) {
    next(error);
  }
});

// ==================== NESTED ROUTES ====================

/**
 * @route GET /api/countries/:countryCode/regions
 * @description Get all regions in a given country
 */
router.get('/countries/:countryCode/regions', async (req, res, next) => {
  try {
    const countryCode = Number(req.params.countryCode);
    const regions = await prisma.regions.findMany({
      where: { countryId: countryCode },
      orderBy: { regionName: 'asc' }
    });

    if(!regions || regions.length === 0) {
      throw new ApiError(404, 'No regions found for this country');
    }
    res.json({ data: regions });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/regions/:regionCode/districts
 * @description Get all districts in a given region
 */
router.get('/regions/:regionCode/districts', async (req, res, next) => {
  try {
    const regionCode = Number(req.params.regionCode);
    const districts = await prisma.districts.findMany({
      where: { regionId: regionCode },
      orderBy: { districtName: 'asc' }
    });

    if(!districts || districts.length === 0) {
      throw new ApiError(404, 'No districts found for this region');
    }
    res.json({ data: districts });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/districts/:districtCode/wards
 * @description Get all wards in a given district
 */
router.get('/districts/:districtCode/wards', async (req, res, next) => {
  try {
    const districtCode = Number(req.params.districtCode);
    const wards = await prisma.wards.findMany({
      where: { districtId: districtCode },
      orderBy: { wardName: 'asc' }
    });

    if(!wards || wards.length === 0) {
      throw new ApiError(404, 'No wards found for this district');
    }
    res.json({ data: wards });
  } catch (error) {
    next(error);
  }
});


/**
 * @route GET /api/wards/:wardCode/places
 * @description Get all places in a given ward
 */
router.get('/wards/:wardCode/places', async (req, res, next) => {
  try {
    const wardCode = Number(req.params.wardCode);
    const places = await prisma.places.findMany({
      where: { wardId: wardCode },
      orderBy: { placeName: 'asc' }
    });

    if(!places || places.length === 0) {
      throw new ApiError(404, 'No places found for this ward');
    }
    res.json({ data: places });
  } catch (error) {
    next(error);
  }
});


export default router;
