import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.get_hello')
  getHello(@Payload() data: { name: string }) {
    return `Hello, ${data.name}! Welcome to the Users Service.`;
  }

  @MessagePattern('users.create')
  async create(@Payload() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @MessagePattern('users.findAll')
  async findAll() {
    return await this.usersService.findAll();
  }

  @MessagePattern('users.findOne')
  async findOne(@Payload() data: { id: number }) {
    return await this.usersService.findOne(data.id);
  }

  @MessagePattern('users.findByEmail')
  async findByEmail(@Payload() data: { email: string }) {
    return await this.usersService.findByEmail(data.email);
  }

  @MessagePattern('users.update')
  async update(@Payload() data: { id: number; updateUserDto: UpdateUserDto }) {
    return await this.usersService.update(data.id, data.updateUserDto);
  }

  @MessagePattern('users.remove')
  async remove(@Payload() data: { id: number }) {
    return await this.usersService.remove(data.id);
  }
}
