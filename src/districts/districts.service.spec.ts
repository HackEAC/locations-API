import { Test, TestingModule } from '@nestjs/testing';
import { DistrictsService } from './districts.service';

describe('DistrictsService', () => {
  let service: DistrictsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DistrictsService],
    }).compile();

    service = module.get<DistrictsService>(DistrictsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
