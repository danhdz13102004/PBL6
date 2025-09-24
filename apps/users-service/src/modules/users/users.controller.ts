import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { 
  UserResponseDto, 
  UserListResponseDto, 
} from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @MessagePattern('users.list')
  async findAll(@Payload() data: { page: number; limit: number }): Promise<UserListResponseDto> {
    console.log('Finding all users with pagination:', data);
    return await this.usersService.findAll(data.page, data.limit);
  }

  @MessagePattern('users.get_user')
  async findOne(@Payload() data: { id: number }): Promise<UserResponseDto | null> {
    console.log('Finding user with ID:', data.id);
    return await this.usersService.findOne(data.id);
  }


  @MessagePattern('users.send_otp')
  async sendPTP(@Payload() data: {userId: number, email: string}){
    return await this.usersService.sendOTP(data.userId, data.email);
  }

  @MessagePattern('users.verify_otp')
  async verifyPTP(@Payload() data: {user_id: number, user_otp: string, user_otp_send_at: string}){
    return await this.usersService.verifyOTP(data.user_id, data.user_otp, new Date(data.user_otp_send_at));
  }
}
