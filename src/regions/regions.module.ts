import { Module } from "@nestjs/common"
import { RegionsSearchService, RegionsService } from "./regions.service"
import { RegionsController } from "./regions.controller"
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [RegionsController],
  providers: [RegionsService, RegionsSearchService, PrismaService]
})
export class RegionsModule {}
