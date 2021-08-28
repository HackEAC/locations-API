import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Prisma, Countries } from "@prisma/client"

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService){}

  async country(
    countryWhereUniqueInput: Prisma.CountriesWhereUniqueInput
  ): Promise<Countries | null> {
    const res = await this.prisma.countries.findUnique({
      where: countryWhereUniqueInput
    })

    if(!res) 
      throw new NotFoundException(`Cannot find country with ID: ${countryWhereUniqueInput}`)

    return res
  }

  async countries(
    params: {
      take?: number;
      skip?: number;
      cursor?: Prisma.CountriesWhereUniqueInput;
      where?: Prisma.CountriesWhereInput;
      orderBy?: Prisma.CountriesOrderByInput;
    }
  ): Promise<Countries[]> {
    const { take, skip, cursor, where, orderBy } = params

    const res = await this.prisma.countries.findMany({
      where,
      skip,
      cursor,
      orderBy,
      take
    })

    if(res.length === 0) 
      throw new NotFoundException("Cannot find countries")

    return res
  }
}

@Injectable()
export class CountriesSearchService {
  constructor(private prisma: PrismaService) {};

  async search(
    searchInput: String
  ): Promise<any | null> {

    if(searchInput.length >= 3) {

     const res = await this.prisma.countries.findMany({
       where: {
         nicename: {
           search: `${searchInput}:*`
         }
       }
     })

      if(res.length <= 0) {
        throw new NotFoundException(`No district found matching: ${searchInput}`)
      }

      const responses = res.map(response => ({
        locationType: "country",
        locationName: response.nicename,
        locationObject: response
      }))

      return responses
    }

    throw new HttpException(`Cannot search with less that 3 characters.`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
  }
}
