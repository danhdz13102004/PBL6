import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { ClassEnrollment } from '../../entities/class-enrollment.entity';
import { ClassTeacher } from '../../entities/class-teacher.entity';
import { Class } from 'src/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, ClassEnrollment, ClassTeacher])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
