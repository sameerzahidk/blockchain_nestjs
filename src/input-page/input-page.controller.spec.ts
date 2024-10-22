import { Test, TestingModule } from '@nestjs/testing';
import { InputPageController } from './input-page.controller';

describe('InputPageController', () => {
  let controller: InputPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InputPageController],
    }).compile();

    controller = module.get<InputPageController>(InputPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
