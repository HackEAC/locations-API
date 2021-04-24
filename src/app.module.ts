import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { DistrictsModule } from './districts/districts.module';

@Module({
  imports: [RegionsModule, CountriesModule, DistrictsModule],
})
export class AppModule {}
