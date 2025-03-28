import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  Res,
  Query,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ChatService, Model } from './chat.service';
import { ChatInput, ChatOuput } from './open-ai/open-ai.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getHealth(): string {
    return 'OK';
  }

  @Post('/api/chat')
  async postChat(@Body() chatInput: ChatInput): Promise<ChatOuput> {
    return await this.chatService.getChatResponse(chatInput);
  }

  // TODO: FIXME
  @Post('/api/chat-long-polling')
  async getChatLongPolling(
    @Body() chatInput: ChatInput,
    @Res() response: Response,
  ) {
    await this.chatService.getChatLongPollingResponse(chatInput, response);
  }

  @Sse('/sse/chat')
  async sse(@Query('prompt') prompt: string, @Query('model') model: Model) {
    // Passing prompt as a testing workaround instead of broadcasting after a post request
    return await this.chatService.getChatServerSentEvents({ prompt, model });
  }
}
