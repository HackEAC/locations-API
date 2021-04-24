import { Module } from "@nestjs/common"
import { PlacesController } from "./places.controller"
import { PlacesService } from './places.service'
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [PlacesController],
  providers: [PrismaService, PlacesService]
})
export class PlacesModule {}
