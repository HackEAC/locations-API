import { Get, Param, Controller } from '@nestjs/common';
import { DistrictSearchService, DistrictsService } from "./districts.service"
import { Districts as DistrictModel } from "@prisma/client"
import { searchResults as searchResultsInterface } from "../types/search"

@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsService: DistrictsService,
    private readonly districtsSearchService: DistrictSearchService
  ){}

  @Get()
  async getAllDistricts(): Promise<DistrictModel[]> {
    return this.districtsService.districts({})
  }

  @Get("name/:name")
  async getDistrictByName(@Param("name") name: string): Promise<DistrictModel[]> {
    return this.districtsService.districts({where: {districtName: name}})
  }

  @Get(":id")
  async getDistrictsById(@Param("id") id: string): Promise<DistrictModel> {
    return this.districtsService.district({districtCode: +id})
  }

  @Get(":id/wards")
  async getDistrictsByIdWithWards(@Param("id") id: string): Promise<DistrictModel> {
    return this.districtsService.districtWithWards({districtCode: +id})
  }

  @Get("search/:searchText")
  async searchDistricts(@Param('searchText') searchText) : Promise<searchResultsInterface> {
    return this.districtsSearchService.search(searchText)
  }

}
