import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service"
import { Wards, Prisma } from "@prisma/client"

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService){}

  async ward(
    wardWhereUniqueInput: Prisma.WardsWhereUniqueInput
  ): Promise<Wards | null> {
    return this.prisma.wards.findUnique({
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

      return this.prisma.wards.findMany({
        take,
        skip,
        where,
        orderBy,
        cursor
      })
    }
}
