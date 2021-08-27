import { Module } from "@nestjs/common"
import { CountriesService, CountriesSearchService } from "./countries.service"
import { CountriesController } from "./countries.controller"
import { PrismaService } from "../prisma.service"

@Module({
  providers: [PrismaService, CountriesService, CountriesSearchService],
  controllers: [CountriesController]
})
export class CountriesModule {}
