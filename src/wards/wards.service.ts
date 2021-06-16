import { Injectable, NotFoundException } from '@nestjs/common';
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
