import { Injectable } from '@nestjs/common';
import { 
  UserResponseDto, 
  UserListResponseDto, 
} from './dto/user-response.dto';
import { UserMapper } from './mapper/user.mapper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}



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
}
