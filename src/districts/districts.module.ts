import { Module } from "@nestjs/common"
import { DistrictsController } from "./districts.controller"
import { DistrictsService } from "./districts.service"
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [DistrictsController],
  providers: [PrismaService, DistrictsService]
})
export class DistrictsModule {}
