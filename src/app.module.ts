import { Module } from '@nestjs/common';
import { RegionsModule } from './regions/regions.module';

@Module({
  imports: [RegionsModule],
})
export class AppModule {}
