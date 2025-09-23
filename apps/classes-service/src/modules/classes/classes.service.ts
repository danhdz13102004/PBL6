import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddStudentsDto, CreateClassDto } from './dto/class.dto';
import { UserInfoDto } from './dto/user.dto';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClassDto: CreateClassDto) {
    try {
      const newClass = await this.prisma.class.create({
        data: {
          class_name: createClassDto.class_name,
          class_code: createClassDto.class_code,
          description: createClassDto.description,
          teacher_id: createClassDto.teacher_id,
        },
        include: {
          posts: true,
          enrollments: true,
          teachers: true,
        },
      });

      return {
        success: true,
        data: newClass,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'DUPLICATE_CLASS_CODE',
        };
      }
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        posts: true,
        enrollments: true,
        teachers: true,
      },
    });
  }


  async addStudents(addStudentsDto: AddStudentsDto){
    try{
      var records = []
      for (let stu of addStudentsDto.students){
        records.push({
          class_id: addStudentsDto.class_id,
          student_id: stu.id,
        })
      }
      this.prisma.classEnrollment.createMany({
        data: records
      })
      return {
        success: true,
      }

    }catch(error){
      console.log('Failed to add students to classes', error.message);
      return {
        sucess: false,
        error: error.message,
      }
    }
    
  }
}
