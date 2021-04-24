import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Districts, Prisma } from "@prisma/client"

@Injectable()
export class DistrictsService {
  constructor(private prisma: PrismaService){}

  async district(
    districtUniqueInput: Prisma.DistrictsWhereUniqueInput
  ): Promise<Districts| null> {
    return this.prisma.districts.findUnique({where: districtUniqueInput})
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

    return this.prisma.districts.findMany({
      take,
      where,
      skip,
      cursor,
      orderBy
    })
  }
}
