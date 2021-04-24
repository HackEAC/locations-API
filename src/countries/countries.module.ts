import { Module } from "@nestjs/common"
import { CountriesService } from "./countries.service"
import { CountriesController } from "./countries.controller"
import { PrismaService } from "../prisma.service"

@Module({
  providers: [PrismaService, CountriesService],
  controllers: [CountriesController]
})
export class CountriesModule {}
