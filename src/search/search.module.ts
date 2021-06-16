import { Module } from '@nestjs/common';
import { SearchController } from "./search.controller"
import { SearchService } from "./search.service"
import { PrismaService } from "../prisma.service"

@Module({
  controllers: [SearchController],
  providers: [SearchService, PrismaService]
})
export class SearchModule {}
