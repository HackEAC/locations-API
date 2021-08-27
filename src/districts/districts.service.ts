import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Districts, Prisma } from "@prisma/client"

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService){}

  async district(
    districtUniqueInput: Prisma.DistrictsWhereUniqueInput
  ): Promise<Districts| null> {
    const res = await this.prisma.districts.findUnique({
      where: districtUniqueInput,
      include: {
        regions: {
          include: { countries: true }
        }
      }
    })


    if(!res)
      throw new NotFoundException(`Cannot find district with ID: ${districtUniqueInput}`)

    return res
  }

  async districtWithWards(
    districtUniqueInput: Prisma.DistrictsWhereUniqueInput
  ): Promise<any> {
    const res = await this.prisma.districts.findUnique({
      where: districtUniqueInput,
      include: {
        regions: {
          include: { countries: true }
        },
        wards: true
      }
    })


    if(!res)
      throw new NotFoundException(`Cannot find district with ID: ${districtUniqueInput}`)

    return res
  }

  async districts(
    params: {
      take?: number;
      skip?: number;
      cursor?: Prisma.DistrictsWhereUniqueInput;
      where?: Prisma.DistrictsWhereInput;
      orderBy?: Prisma.DistrictsOrderByInput;
    }
  ): Promise<Districts[]> {
    const { take, skip, where, cursor, orderBy } = params

    const res = await this.prisma.districts.findMany({
      take,
      where,
      skip,
      cursor,
      orderBy
    })

    if(res.length === 0)
      throw new NotFoundException(`Cannot find districts`)

    return res
  }
}

@Injectable()
export class DistrictSearchService {
  constructor(private prisma: PrismaService) {};

  async search(
    searchInput: String
  ): Promise<any | null> {

    if(searchInput.length >= 3) {
     const res = await this.prisma.districts.findMany({
       where: {
         districtName: {
           search: `${searchInput}:*`
         }
       },
       include: {
         countries: true,
         regions: true,
       }
     })

      if(res.length <= 0) {
        throw new NotFoundException(`No district found matching: ${searchInput}`)
      }

      return res
    }

    throw new HttpException(`Cannot search with less that 3 characters.`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
  }
}
