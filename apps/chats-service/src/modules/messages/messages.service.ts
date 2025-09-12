import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto, UpdateMessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messagesRepo.create({
      ...createMessageDto,
      message_type: createMessageDto.message_type as any,
    });
    return await this.messagesRepo.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.messagesRepo.find({
      order: { timestamp: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messagesRepo.findOne({ 
      where: { id } 
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async findByConversation(conversationId: number): Promise<Message[]> {
    return await this.messagesRepo.find({
      where: { conversation_id: conversationId },
      order: { timestamp: 'ASC' },
    });
  }

  async findBySender(senderId: number): Promise<Message[]> {
    return await this.messagesRepo.find({
      where: { sender_id: senderId },
      order: { timestamp: 'DESC' },
    });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    const updateData: any = { ...updateMessageDto };
    if (updateMessageDto.message_type) {
      updateData.message_type = updateMessageDto.message_type as any;
    }

    await this.messagesRepo.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    await this.messagesRepo.remove(message);
  }
}
