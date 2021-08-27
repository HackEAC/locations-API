import { Module } from "@nestjs/common"
import { WardsController } from "./wards.controller"
import { WardsService, WardsSearchService } from "./wards.service"
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [WardsController],
  providers: [PrismaService, WardsService, WardsSearchService]
})
export class WardsModule {}
