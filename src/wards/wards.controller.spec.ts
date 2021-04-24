import { Test, TestingModule } from '@nestjs/testing';
import { WardsController } from './wards.controller';

describe('WardsController', () => {
  let controller: WardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WardsController],
    }).compile();

    controller = module.get<WardsController>(WardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
