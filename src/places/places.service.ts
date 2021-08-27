import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Places, Prisma } from "@prisma/client"

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService){}

  async place(
    placeWhereUniqueInput: Prisma.PlacesWhereUniqueInput
  ): Promise<Places | null> {
    const res = await this.prisma.places.findUnique({where: placeWhereUniqueInput})

    if(!res)
      throw new NotFoundException(`Cannot find place with ID: ${placeWhereUniqueInput}`)

    return res
  }

  async places(
    params: {
      take?: number;
      skip?: number;
      cursor?: Prisma.PlacesWhereUniqueInput;
      where?: Prisma.PlacesWhereInput;
      orderBy?: Prisma.PlacesOrderByInput;
    }
  ): Promise<Places[]> {
    const { take, skip, cursor, where, orderBy } = params

    const res = await this.prisma.places.findMany({
      take,
      skip,
      cursor,
      orderBy,
      where
    })

    if(res.length === 0)
      throw new NotFoundException("Cannot find places")

    return res
  }

}

@Injectable()
export class PlacesSearchService {
  constructor(private prisma: PrismaService) {};

  async search(
    searchInput: String
  ): Promise<any | null> {

    if(searchInput.length >= 3) {
     const res = await this.prisma.places.findMany({
       where: {
         placeName: {
           search: `${searchInput}:*`
         }
       },
       include: {
         ward: {
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
         }
       }
     })

      if(res.length <= 0) {
        throw new NotFoundException(`No street found matching: ${searchInput}`)
      }

      return res
    }

    throw new HttpException(`Cannot search with less that 3 characters.`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
  }
}
