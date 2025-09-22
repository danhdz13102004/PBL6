import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        posts: true,
        enrollments: true,
        teachers: true,
      },
    });
  }
}
