import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionAnswersController } from './submission-answers.controller';
import { SubmissionAnswersService } from './submission-answers.service';
import { SubmissionAnswer } from './submission-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionAnswer]),
  ],
  controllers: [SubmissionAnswersController],
  providers: [SubmissionAnswersService],
  exports: [SubmissionAnswersService],
})
export class SubmissionAnswersModule {}
