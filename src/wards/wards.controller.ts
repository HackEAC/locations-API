import { Controller, Get, Param } from '@nestjs/common';
import { Wards as WardsModel } from "@prisma/client"
import { WardsService, WardsSearchService } from "./wards.service"

@Controller('wards')
export class WardsController {
  constructor(
    private readonly wardsService: WardsService,
    private readonly wardsSearchService: WardsSearchService
  ) {}

  @Get()
  async getWards(): Promise<WardsModel[]> {
    return this.wardsService.wards({})
  }

  @Get("name/:wardName")
  async getWardByName(@Param("wardName") wardName: string): Promise<WardsModel[]> {
    return this.wardsService.wards({where: {wardName}})
  }

  @Get(":wardCode")
  async getWardById(@Param("wardCode") wardCode: string): Promise<WardsModel> {
    return this.wardsService.ward({wardCode: +wardCode})
  }

  @Get(":wardCode/places")
  async getWardByIdWithPlaces(@Param("wardCode") wardCode: string): Promise<any> {
    return this.wardsService.wardWithPlaces({wardCode: +wardCode})
  }

  @Get("search/:searchText")
  async searchWards(@Param('searchText') searchText) {
    return this.wardsSearchService.search(searchText)
  }
}
