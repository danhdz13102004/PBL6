import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @MessagePattern('get_conversations_hello')
  getHello(@Payload() data: { name: string }) {
    return `Hello, ${data.name}! Welcome to the Chats Service - Conversations.`;
  }

  @MessagePattern('create_conversation')
  async create(@Payload() createConversationDto: CreateConversationDto) {
    return await this.conversationsService.create(createConversationDto);
  }

  @MessagePattern('get_all_conversations')
  async findAll() {
    return await this.conversationsService.findAll();
  }

  @MessagePattern('get_conversation_by_id')
  async findOne(@Payload() data: { id: number }) {
    return await this.conversationsService.findOne(data.id);
  }

  @MessagePattern('get_conversations_by_sender')
  async findBySender(@Payload() data: { senderId: string }) {
    return await this.conversationsService.findBySender(data.senderId);
  }

  @MessagePattern('get_conversations_by_receiver')
  async findByReceiver(@Payload() data: { receiverId: string }) {
    return await this.conversationsService.findByReceiver(data.receiverId);
  }

  @MessagePattern('update_conversation')
  async update(@Payload() data: { id: number; updateConversationDto: UpdateConversationDto }) {
    return await this.conversationsService.update(data.id, data.updateConversationDto);
  }

  @MessagePattern('delete_conversation')
  async remove(@Payload() data: { id: number }) {
    await this.conversationsService.remove(data.id);
    return { message: `Conversation with ID ${data.id} has been deleted` };
  }
}
