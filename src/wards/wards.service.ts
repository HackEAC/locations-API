import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Wards, Prisma } from "@prisma/client"

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService){}

  async ward(
    wardWhereUniqueInput: Prisma.WardsWhereUniqueInput
  ): Promise<Wards | null> {
    const res = await this.prisma.wards.findUnique({
      where: wardWhereUniqueInput,
      include: {
        districts: {
          include: {
            regions: {
              include: {
                countries: true
              }
            }
          }
        }
      }
    })

    if(!res)
      throw new NotFoundException(`Cannot find ward with ID: ${wardWhereUniqueInput}`)

    return res
  }

  async wardWithPlaces(
    wardWhereUniqueInput: Prisma.WardsWhereUniqueInput
  ): Promise<any> {
    const res = await this.prisma.wards.findUnique({
      where: wardWhereUniqueInput,
      include: {
        places: true,
        districts: {
          include: {
            regions: {
              include: {
                countries: true
              }
            }
          }
        }
      }
    })

    if(!res)
      throw new NotFoundException(`Cannot find ward with ID: ${wardWhereUniqueInput}`)

    return res
  }

  async wards(
    params: {
      take?: number;
      skip?: number;
      cursor?: Prisma.WardsWhereUniqueInput;
      where?: Prisma.WardsWhereInput;
      orderBy?: Prisma.WardsOrderByInput;
    }): Promise<Wards[]> {
      const { take, skip, where, orderBy, cursor } = params

      const res = await this.prisma.wards.findMany({
        take,
        skip,
        where,
        orderBy,
        cursor
      })

      if(res.length === 0)
        throw new NotFoundException(`Cannot find wards`)

      return res
    }
}

@Injectable()
export class WardsSearchService {
  constructor(private prisma: PrismaService) {};

  async search(
    searchInput: String
  ): Promise<any | null> {

    if(searchInput.length >= 3) {
     const res = await this.prisma.wards.findMany({
       where: {
         wardName: {
           search: `${searchInput}:*`
         }
       },
       include: {
         districts: {
           include: {
             regions: {
               include: {
                 countries: true
               }
             }
           }
         }
       }
     })

      if(res.length <= 0) {
        throw new NotFoundException(`No ward found matching: ${searchInput}`)
      }

      return res
    }

    throw new HttpException(`Cannot search with less that 3 characters.`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
  }
}
