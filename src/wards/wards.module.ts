import { Module } from '@nestjs/common';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [WardsController],
  providers: [PrismaService, WardsService]
})
export class WardsModule {}
