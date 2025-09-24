import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../dto/user.dto';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get('hello')
  getHello(@Body() data: { name: string }) {
    return this.usersClient.send('users.get_hello', { name: data.name });
  }

  @Get(':id/sendotp')
  sendOTP(@Param('id') id: number, @Body() data: {email: string}){
    return this.usersClient.send('users.send_otp', {user_id: id, email: data.email});
  }

  @Post(':id/verifyotp')
  verifyOTP(@Param('id') id:number, @Body() data: {otp:string, send_at:string}){
    return this.usersClient.send('users.verify_otp', {user_id: id, user_otp: data.otp, user_otp_send_at: data.send_at});
  }
}
