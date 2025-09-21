import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto, UpdateMessageDto } from './dto/message.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    return await this.prisma.message.create({
      data: createMessageDto,
    });
  }

  async findAll(): Promise<Message[]> {
    return await this.prisma.message.findMany({
      orderBy: { timestamp: 'asc' },
      include: {
        conversation: true,
      },
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.prisma.message.findUnique({ 
      where: { id },
      include: {
        conversation: true,
      },
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async findByConversation(conversationId: number): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async findBySender(senderId: number): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: { sender_id: senderId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    await this.prisma.message.delete({
      where: { id },
    });
  }
}
