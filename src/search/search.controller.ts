import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { SearchService } from "./search.service"

@Controller('search')
export class SearchController {
  constructor( 
    private readonly searchService: SearchService,
  ){}

  @Post()
  async getLocation(@Body() body) {
    return this.searchService.search(body.searchText)
  }

}
