import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { Prisma, Countries } from "@prisma/client"

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService){}

  async country(
    countryWhereUniqueInput: Prisma.CountriesWhereUniqueInput
  ): Promise<Countries | null> {
    return this.prisma.countries.findUnique({
      where: countryWhereUniqueInput
    })
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

    return this.prisma.countries.findMany({
      where,
      skip,
      cursor,
      orderBy,
      take
    })
  }
}
