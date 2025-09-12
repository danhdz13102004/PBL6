import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionExamsController } from './question-exams.controller';
import { QuestionExamsService } from './question-exams.service';
import { QuestionExam } from './question-exam.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionExam]),
  ],
  controllers: [QuestionExamsController],
  providers: [QuestionExamsService],
  exports: [QuestionExamsService],
})
export class QuestionExamsModule {}
