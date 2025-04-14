import dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  databaseUrl: process.env.DATABASE_URL,
  pageSize: parseInt(process.env.PAGE_SIZE || '10', 10)
};

export default config;
