import { Controller, Get, Param } from '@nestjs/common';
import { RegionsSearchService, RegionsService } from "./regions.service"
import { Regions as RegionsModel } from "@prisma/client"
import { searchResults as searchResultsInterface } from "../types/search"

@Controller('regions')
export class RegionsController {
  constructor (
    private readonly regionsSerice: RegionsService,
    private readonly regionsSearchService: RegionsSearchService
  ) {}

  @Get()
  getAllRegions(): Promise<RegionsModel[]> {
    return this.regionsSerice.regions({})
  }

  @Get(":regionCode")
  async getRegionById(@Param("regionCode") regionCode: string): Promise<RegionsModel> {
    return this.regionsSerice.region({regionCode: Number(regionCode)})
  }

  @Get(":regionCode/districts")
  async getRegionByIdWithDistricts(@Param("regionCode") regionCode: string): Promise<any[]> {
    return this.regionsSerice.regionWithDistricts({regionCode: Number(regionCode)})
  }

  @Get("name/:regionName")
  async getRegionByName(@Param("regionName") regionName: string): Promise<RegionsModel[]> {
    return this.regionsSerice.regions({where: {regionName}})
  }

  @Get("search/:searchText")
  async searchRegions(@Param('searchText') searchText:string) : Promise<searchResultsInterface> {
    return this.regionsSearchService.search(searchText)
  }

}
