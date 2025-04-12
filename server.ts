import { PrismaClient } from '@prisma/client';
import app from './src/app';

const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

// Handle app shutdown gracefully
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
