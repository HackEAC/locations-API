import { Test, TestingModule } from '@nestjs/testing';
import { WardsService } from './wards.service';

describe('WardsService', () => {
  let service: WardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WardsService],
    }).compile();

    service = module.get<WardsService>(WardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
