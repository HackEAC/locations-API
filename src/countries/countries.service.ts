import { Injectable, NotFoundException } from "@nestjs/common"
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
