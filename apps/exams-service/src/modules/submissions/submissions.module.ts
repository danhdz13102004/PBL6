import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Submission } from './submission.entity';
import { SubmissionAnswer } from '../submission-answers/submission-answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, SubmissionAnswer]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
