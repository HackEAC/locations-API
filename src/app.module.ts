import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { DistrictsModule } from './districts/districts.module';
import { WardsModule } from './wards/wards.module';
import { PlacesModule } from './places/places.module';
import { ConfigModule } from '@nestjs/config';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { SearchModule } from './search/search.module';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env'}), RegionsModule, CountriesModule, DistrictsModule, WardsModule, PlacesModule, SearchModule],
})
export class AppModule {}
