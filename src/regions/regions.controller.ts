import { Controller, Get, Param } from '@nestjs/common';
import { RegionsService } from "./regions.service"
import { Regions as RegionsModel } from "@prisma/client"

@Controller('regions')
export class RegionsController {
  constructor (private readonly regionsSerice: RegionsService) {}

  @Get()
  getAllRegions(): Promise<RegionsModel[]> {
    return this.regionsSerice.regions({})
  }

  @Get(":regionCode")
  async getRegionById(@Param("regionCode") regionCode: string): Promise<RegionsModel> {
    return this.regionsSerice.region({regionCode: Number(regionCode)})
  }

  @Get("name/:regionName")
  async getRegionByName(@Param("regionName") regionName: string): Promise<RegionsModel[]> {
    return this.regionsSerice.regions({where: {regionName}})
  }
}
