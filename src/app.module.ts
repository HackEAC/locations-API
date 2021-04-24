import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { DistrictsModule } from './districts/districts.module';
import { WardsModule } from './wards/wards.module';

@Module({
  imports: [RegionsModule, CountriesModule, DistrictsModule, WardsModule],
})
export class AppModule {}
