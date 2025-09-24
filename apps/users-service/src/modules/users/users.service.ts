import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { type Prisma } from '@prisma/users-client';
import { User } from './interfaces/user.interface';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private mailSer: MailerService) {}
  private readonly expired_verify_otp = 5*60*1000;
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(user_id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { user_id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(user_id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { user_id },
      data: updateUserDto,
    });
  }

  async remove(user_id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: { user_id },
    });
  }

  async sendOTP(user_id: number, email: string) {
    var otp = '';
    for (let i = 0; i<6; i++){
      otp += (Math.floor(Math.random()*10)).toString();
    } 
    try{
      var res = await this.mailSer.sendMail({
        from: `"Me" <${process.env.GMAIL_USER}>`,
        to: `${email}`,
        subject: `OTP CODE`,
        html: `<p>Your OTP: </p>`+
              `<h1>${otp}</h1>`+
              `<p>Do not share this to anyone</p>`,
      });
      await this.saveOTP(user_id, otp);

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }    
  }
  
  async saveOTP(user_id: number, otp: string){
    return await this.prisma.user.update({
      where:{user_id},
      data:{
        otp,
        opt_send_at: new Date(),
      }
    })
  }

  async verifyOTP(user_id:number, user_otp: string, user_otp_send_at: Date){
    var saved_otp = await this.prisma.user.findFirst({
      where: {user_id},
      select:{user_id: true, otp: true, opt_send_at: true},
    })
    var isValid = (user_otp === saved_otp.otp && (user_otp_send_at.getTime() - saved_otp.opt_send_at.getTime() <= this.expired_verify_otp))
    return {
      isValid
    }
  }
}
