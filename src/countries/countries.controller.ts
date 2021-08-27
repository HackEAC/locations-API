import { Get, Param, Controller } from '@nestjs/common'
import { CountriesService, CountriesSearchService } from "./countries.service"
import { Countries as CountriesModel } from "@prisma/client"

@Controller('countries')
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly countriesSearchService: CountriesSearchService,
  ){}


  @Get()
  async getAllCountries(): Promise<CountriesModel[]> {
    return this.countriesService.countries({})
  }

  @Get("name/:name")
  async getCountriesByName(@Param("name") name: string): Promise<CountriesModel[]> {
    return this.countriesService.countries({
      where: {name}
    })
  }

  @Get("code/:code")
  async getCountriesByCode(@Param("code") code: string): Promise<CountriesModel[]> {
    return this.countriesService.countries({
      where: {iso3: code}
    })
  }

  @Get(":id")
  async getCountryById(@Param("id") id: string): Promise<CountriesModel> {
    return this.countriesService.country({id: +id})
  }

  @Get("search/:searchText")
  async getCountriesSearch(@Param("searchText") searchText: string) {
    return this.countriesSearchService.search(searchText)
  }
}
