import { Controller, Get, Param } from '@nestjs/common';
import { Wards as WardsModel } from "@prisma/client"
import { WardsService } from "./wards.service"

@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

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
}
