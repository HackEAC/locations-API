import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [RegionsModule, CountriesModule],
})
export class AppModule {}
