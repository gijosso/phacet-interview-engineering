import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatInput, OpenAiService } from './open-ai/open-ai.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';

export enum Model {
  GPT_4_TURBO_PREVIEW = 'gpt-4-turbo-preview',
  GPT_4 = 'gpt-4',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly openAIservice: OpenAiService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private validateChatInput(chatInput: ChatInput) {
    if (!chatInput.prompt) {
      throw new HttpException(
        'Invalid input: prompt is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (chatInput.model && !Object.values(Model).includes(chatInput.model)) {
      throw new HttpException(
        'Invalid input: model is not supported',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getChatResponse(chatInput: ChatInput) {
    this.validateChatInput(chatInput);

    const cacheKey = `${chatInput.model}-${chatInput.prompt}`;
    const cachedResponse = await this.cacheManager.get<string>(cacheKey);

    if (cachedResponse) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return { completion: cachedResponse };
    }

    try {
      const {
        choices: [{ message }],
      } = await this.openAIservice.getCompletion(chatInput);

      const completion = message.content || 'No response';

      await this.cacheManager.set(cacheKey, completion);
      this.logger.log(`Cache set for key: ${cacheKey}`);

      return { completion };
    } catch (error) {
      this.logger.error(
        'Error fetching response from OpenAI service',
        error.stack,
      );
      throw new HttpException(
        'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: FIXME
  async getChatLongPollingResponse(chatInput: ChatInput, response: Response) {
    this.validateChatInput(chatInput);

    const stream = await this.openAIservice.getStreamCompletion(chatInput);

    try {
      for await (const data of stream) {
        if (data?.['choices']?.[0]?.['delta']?.['content']) {
          response.write(data['choices'][0]['delta']['content']);
        }
      }

      response.end();
    } catch (error) {
      this.logger.error('Error processing stream response', error.stack);
      throw new HttpException(
        'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChatServerSentEvents(
    chatInput: ChatInput,
  ): Promise<Observable<{ data: string }>> {
    this.validateChatInput(chatInput);

    const stream = await this.openAIservice.getStreamCompletion(chatInput);

    try {
      return new Observable<{ data: string }>((subscriber) => {
        (async () => {
          try {
            for await (const data of stream) {
              if (data?.choices?.[0]?.delta?.content) {
                subscriber.next({
                  data: data.choices[0].delta.content,
                });
              }
            }
            // subscriber.complete();
          } catch (error) {
            subscriber.error(error);
          }
        })();
      });
    } catch (error) {
      this.logger.error('Error processing stream response', error.stack);
      throw new HttpException(
        'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
