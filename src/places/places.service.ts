import { Injectable, NotFoundException } from '@nestjs/common';
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
