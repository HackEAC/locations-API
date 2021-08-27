import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Regions, Prisma } from "@prisma/client"

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async region(
    regionWhereUniqueInput: Prisma.RegionsWhereUniqueInput
  ): Promise<Regions | null> {

    const res = await this.prisma.regions.findUnique({
      where: regionWhereUniqueInput,
      include: { countries: true }
    })

    if(!res) 
      throw new NotFoundException(`Cannot find region with ID: ${regionWhereUniqueInput}`)

    return res
  }

  async regionWithDistricts(
    regionWhereUniqueInput: Prisma.RegionsWhereUniqueInput
  ): Promise<any> {
    const res = await this.prisma.regions.findUnique({
      where: regionWhereUniqueInput,
      include: { countries: true, districts: true }
    })

    if(!res) 
      throw new NotFoundException(`Cannot find region with ID: ${regionWhereUniqueInput}`)

    return res
  }

  async regions(params: {
    take?: number;
    skip?: number;
    cursor?: Prisma.RegionsWhereUniqueInput;
    where?: Prisma.RegionsWhereInput;
    orderBy?: Prisma.RegionsOrderByInput;
  }): Promise<Regions[]> {

    const {take, skip, cursor, orderBy, where} = params
    const res = await this.prisma.regions.findMany({
      skip,
      take,
      cursor,
      orderBy,
      where
    })

    if(res.length === 0) 
      throw new NotFoundException(`Cannot find regions`)

    return res
  }
}

@Injectable()
export class RegionsSearchService {
  constructor(private prisma: PrismaService) {};

  async search(
    searchInput: String
  ): Promise<any | null> {

    if(searchInput.length >= 3) {
     const res = await this.prisma.regions.findMany({
       where: {
         regionName: {
           search: `${searchInput}:*`
         }
       },
       include: {
         countries: true
       }
     })

      if(res.length <= 0) {
        throw new NotFoundException(`No region found matching: ${searchInput}`)
      }

      return res
    }

    throw new HttpException(`Cannot search with less that 3 characters.`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
  }
}
