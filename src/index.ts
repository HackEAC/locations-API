import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.get('/', async (_, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.get('/regions/:regionCode/', async (req, res) => {
  const regionCode = req.params.regionCode;
  const region = await prisma.regions.findUnique({
    where: {
      regionCode: +regionCode,
    },
    select: {
      regionCode: true,
      regionName: true,
      countryId: true,
    },
  });

  res.json({data: region});
});

app.get('/regions', async (_, res) => {
  const regions = await prisma.regions.findMany({
    select: {
      regionCode: true,
      regionName: true,
      countryId: true,
    },
  });
  res.json({
    data: regions,
  });
});

app.get('/countries', async (_, res) => {
  const countries = await prisma.countries.findMany({
    select: {
      name: true,
      iso: true,
      nicename: true,
      phonecode: true,
      numcode: true,
    },
  });
  res.json({
    data: countries,
  });
});

app.get('/countries/:id', async (req, res) => {
  const countryId = req.params.id;
  const country = await prisma.countries.findUnique({
    where: {
      id: +countryId,
    },
    select: {
      name: true,
      iso: true,
      nicename: true,
      phonecode: true,
      numcode: true,
    },
  });
  res.json({
    data: country,
  });
});

app.get('/wards', async (_, res) => {
  const wards = await prisma.wards.findMany({
    select: {
      wardCode: true,
      wardName: true,
      region_id: true,
      country_id: true,
      districtId: true,
    },
  });
  res.json({
    data: wards,
  });
});

app.get('/wards/:wardCode', async (req, res) => {
  const wardCode = req.params.wardCode;
  const ward = await prisma.wards.findUnique({
    where: {
      wardCode: +wardCode,
    },
    select: {
      wardCode: true,
      wardName: true,
      region_id: true,
      districtId: true,
      country_id: true,
    },
  });
  res.json({
    data: ward,
  });
});

app.get('/places/:placeId', async (req, res) => {
  const placeId = req.params.placeId;
  const place = await prisma.places.findUnique({
    where: {
      id: +placeId,
    },
    select: {
      id: true,
      placeName: true,
      region_id: true,
      district_id: true,
      wardId: true,
    },
  });
  res.json({
    data: place,
  });
});

const PORT = process.env.port || 8080;

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});
