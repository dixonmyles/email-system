import { Test, TestingModule } from '@nestjs/testing';
import { GmailAccountController } from './gmail-account.controller';

describe('GmailAccountController', () => {
  let controller: GmailAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmailAccountController],
    }).compile();

    controller = module.get<GmailAccountController>(GmailAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
