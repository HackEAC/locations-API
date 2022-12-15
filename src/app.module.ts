import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { DistrictsModule } from './districts/districts.module';
import { WardsModule } from './wards/wards.module';
import { PlacesModule } from './places/places.module';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { HealthCheckController } from './health-check/health-check.controller';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env'}), RegionsModule, CountriesModule, DistrictsModule, WardsModule, PlacesModule, SearchModule],
  controllers: [HealthCheckController],
})
export class AppModule {}
