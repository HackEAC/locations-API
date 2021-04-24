import { Get, Param, Controller } from '@nestjs/common';
import { Places as PlacesModel } from "@prisma/client"
import { PlacesService } from "./places.service"

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService){}

  @Get()
  async getPlaces() {
    return this.placesService.places({})
  }

  @Get("name/:placeName")
  async getPlaceByName(@Param("placeName") placeName: string) {
    return this.placesService.places(
      {where: {placeName}}
    )
  }

  @Get(":id")
  async getPlaceById(@Param("id") id: string) {
    return this.placesService.place({id: +id})
  }

}
