import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { DistrictsModule } from './districts/districts.module';
import { WardsModule } from './wards/wards.module';
import { PlacesModule } from './places/places.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: '.env'}), RegionsModule, CountriesModule, DistrictsModule, WardsModule, PlacesModule],
})
export class AppModule {}
