import { Injectable, NotFoundException } from '@nestjs/common';
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
