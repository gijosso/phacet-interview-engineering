import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiService } from './open-ai/open-ai.service';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 3600, // Cache expiration time in seconds
      store: 'memory', // Use in-memory cache
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService, OpenAiService],
})
export class AppModule {}
