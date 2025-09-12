import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepo: Repository<Conversation>,
  ) {}

  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationsRepo.create(createConversationDto);
    return await this.conversationsRepo.save(conversation);
  }

  async findAll(): Promise<Conversation[]> {
    return await this.conversationsRepo.find();
  }

  async findOne(id: number): Promise<Conversation> {
    const conversation = await this.conversationsRepo.findOne({ 
      where: { id } 
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async findBySender(senderId: string): Promise<Conversation[]> {
    return await this.conversationsRepo.find({
      where: { sender_id: senderId },
    });
  }

  async findByReceiver(receiverId: string): Promise<Conversation[]> {
    return await this.conversationsRepo.find({
      where: { receiver_id: receiverId },
    });
  }

  async update(id: number, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.findOne(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    await this.conversationsRepo.update(id, updateConversationDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const conversation = await this.findOne(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    await this.conversationsRepo.remove(conversation);
  }
}
