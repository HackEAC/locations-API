import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Regions, Prisma } from "@prisma/client"

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  async region(
    regionWhereUniqueInput: Prisma.RegionsWhereUniqueInput
  ): Promise<Regions | null> {

    return this.prisma.regions.findUnique({
      where: regionWhereUniqueInput
    })
  }

  async regions(params: {
    take?: number;
    skip?: number;
    cursor?: Prisma.RegionsWhereUniqueInput;
    where?: Prisma.RegionsWhereInput;
    orderBy?: Prisma.RegionsOrderByInput;
  }): Promise<Regions[]> {

    const {take, skip, cursor, orderBy, where} = params
    return this.prisma.regions.findMany({
      skip,
      take,
      cursor,
      orderBy,
      where
    })
  }
}
