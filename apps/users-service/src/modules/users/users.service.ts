import { Injectable } from '@nestjs/common';
import { 
  UserResponseDto, 
  UserListResponseDto, 
} from './dto/user-response.dto';
import { UserMapper } from './mapper/user.mapper';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dto/user.dto';
import { User } from './interfaces/user.interface';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService, private mailSer: MailerService) {}
  private readonly expired_verify_otp = 5*60*1000;

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(page: number, limit: number): Promise<UserListResponseDto> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);
    
    return UserMapper.toUserListResponseDto(users, total, page, limit);
  }

  async findOne(user_id: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { user_id },
    });
    
    if (!user) return null;
    return UserMapper.toResponseDto(user);
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
