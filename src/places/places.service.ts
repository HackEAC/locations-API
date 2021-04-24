import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Places, Prisma } from "@prisma/client"

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService){}

  async place(
    placeWhereUniqueInput: Prisma.PlacesWhereUniqueInput
  ): Promise<Places | null> {
    return this.prisma.places.findUnique({where: placeWhereUniqueInput})
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

    return this.prisma.places.findMany({
      take,
      skip,
      cursor,
      orderBy,
      where
    })
  }

}
