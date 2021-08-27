import { Module } from "@nestjs/common"
import { DistrictsController } from "./districts.controller"
import { DistrictsService, DistrictSearchService } from "./districts.service"
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [DistrictsController],
  providers: [PrismaService, DistrictsService, DistrictSearchService]
})
export class DistrictsModule {}
