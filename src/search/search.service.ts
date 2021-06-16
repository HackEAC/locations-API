import { Injectable, NotFoundException, HttpException, HttpStatus  } from '@nestjs/common';
import { PrismaService } from "../prisma.service"

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {};

  async search(
    searchInput: String
  ): Promise<any | null> {

    if(searchInput.length >= 3) {
      const res = await this.prisma.$queryRaw(`
        SELECT * FROM general WHERE
          to_tsvector(general::text) @@ to_tsquery('${searchInput}');
        `)

      if(res.length <= 0) {
        throw new NotFoundException(`No location found matching: ${searchInput}`)
      }

      return res
    }

    throw new HttpException(`Cannot search with less that 3 characters.`, HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
  }
}
