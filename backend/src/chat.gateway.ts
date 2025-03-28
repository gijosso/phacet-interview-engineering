import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatInput, OpenAiService } from './open-ai/open-ai.service';

@WebSocketGateway(80, {
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway {
  constructor(private readonly openAiService: OpenAiService) {}

  @SubscribeMessage('prompt')
  async handlePrompt(
    @MessageBody() chatInput: ChatInput,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const stream = await this.openAiService.getStreamCompletion(chatInput);

    for await (const data of stream) {
      try {
        const message = data['choices'][0]['delta']['content'];

        if (message) {
          client.emit('completion', message);
        }
      } catch (error) {
        console.error('Error emitting completion:', error);
      }
    }
  }
}
