import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Conversation } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    return await this.prisma.conversation.create({
      data: createConversationDto,
    });
  }

  async findAll(): Promise<Conversation[]> {
    return await this.prisma.conversation.findMany({
      include: {
        messages: true,
      },
    });
  }

  async findOne(id: number): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findUnique({ 
      where: { id },
      include: {
        messages: true,
      },
    });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  async findBySender(senderId: string): Promise<Conversation[]> {
    return await this.prisma.conversation.findMany({
      where: { sender_id: senderId },
      include: {
        messages: true,
      },
    });
  }

  async findByReceiver(receiverId: string): Promise<Conversation[]> {
    return await this.prisma.conversation.findMany({
      where: { receiver_id: receiverId },
      include: {
        messages: true,
      },
    });
  }

  async update(id: number, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.findOne(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return await this.prisma.conversation.update({
      where: { id },
      data: updateConversationDto,
    });
  }

  async remove(id: number): Promise<void> {
    const conversation = await this.findOne(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    await this.prisma.conversation.delete({
      where: { id },
    });
  }
}
