import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Model } from './chat.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return "OK"', () => {
      expect(appController.getHealth()).toBe('OK');
    });

    it('should return a chat completion', async () => {
      const response = await appController.postChat({
        prompt: 'Hello, how are you?',
        model: Model.GPT_3_5_TURBO,
      });
      expect(response).toHaveProperty('completion');
    });

    it('should throw an error for invalid input', async () => {
      await expect(
        appController.postChat({
          prompt: '',
          model: Model.GPT_4,
        }),
      ).rejects.toThrow('Invalid input: prompt is required');
    });

    it('should throw an error for unsupported model', async () => {
      await expect(
        appController.postChat({
          prompt: 'Hello, how are you?',
          model: 'unsupported-model' as Model,
        }),
      ).rejects.toThrow('Invalid input: model is not supported');
    });
  });
});
