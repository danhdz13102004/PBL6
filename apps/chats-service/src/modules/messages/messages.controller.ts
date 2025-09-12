import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessagesService } from './messages.service';
import { CreateMessageDto, UpdateMessageDto } from './dto/message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @MessagePattern('get_messages_hello')
  getHello(@Payload() data: { name: string }) {
    return `Hello, ${data.name}! Welcome to the Chats Service - Messages.`;
  }

  @MessagePattern('create_message')
  async create(@Payload() createMessageDto: CreateMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }

  @MessagePattern('get_all_messages')
  async findAll() {
    return await this.messagesService.findAll();
  }

  @MessagePattern('get_message_by_id')
  async findOne(@Payload() data: { id: number }) {
    return await this.messagesService.findOne(data.id);
  }

  @MessagePattern('get_messages_by_conversation')
  async findByConversation(@Payload() data: { conversationId: number }) {
    return await this.messagesService.findByConversation(data.conversationId);
  }

  @MessagePattern('get_messages_by_sender')
  async findBySender(@Payload() data: { senderId: number }) {
    return await this.messagesService.findBySender(data.senderId);
  }

  @MessagePattern('update_message')
  async update(@Payload() data: { id: number; updateMessageDto: UpdateMessageDto }) {
    return await this.messagesService.update(data.id, data.updateMessageDto);
  }

  @MessagePattern('delete_message')
  async remove(@Payload() data: { id: number }) {
    await this.messagesService.remove(data.id);
    return { message: `Message with ID ${data.id} has been deleted` };
  }
}
