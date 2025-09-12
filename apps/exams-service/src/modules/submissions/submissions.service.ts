import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { SubmissionAnswer } from '../submission-answers/submission-answer.entity';
import { CreateSubmissionDto, GradeSubmissionDto } from './dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectRepository(SubmissionAnswer)
    private submissionAnswersRepository: Repository<SubmissionAnswer>,
  ) {}

  async createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const { answers, ...submissionData } = createSubmissionDto;
    
    const submission = this.submissionsRepository.create(submissionData);
    const savedSubmission = await this.submissionsRepository.save(submission);

    // Create submission answers
    const submissionAnswers = answers.map(answer => 
      this.submissionAnswersRepository.create({
        ...answer,
        submission_id: savedSubmission.submission_id,
      })
    );

    await this.submissionAnswersRepository.save(submissionAnswers);

    return await this.findSubmissionById(savedSubmission.submission_id);
  }

  async findSubmissionsByExam(examId: number): Promise<Submission[]> {
    return await this.submissionsRepository.find({
      where: { exam_id: examId },
      relations: ['answers', 'answers.question']
    });
  }

  async findSubmissionById(id: number): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne({
      where: { submission_id: id },
      relations: ['answers', 'answers.question', 'exam']
    });

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    return submission;
  }

  async findSubmissionsByStudent(studentId: number, examId?: number): Promise<Submission[]> {
    const queryBuilder = this.submissionsRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.answers', 'answers')
      .leftJoinAndSelect('answers.question', 'question')
      .leftJoinAndSelect('submission.exam', 'exam')
      .where('submission.student_id = :studentId', { studentId });

    if (examId) {
      queryBuilder.andWhere('submission.exam_id = :examId', { examId });
    }

    return await queryBuilder.getMany();
  }

  async gradeSubmission(submissionId: number, gradeData: GradeSubmissionDto): Promise<Submission> {
    const submission = await this.findSubmissionById(submissionId);
    
    submission.score = gradeData.score;
    submission.teacher_feedback = gradeData.teacher_feedback;
    submission.graded_by = gradeData.graded_by;
    submission.graded_at = new Date();

    return await this.submissionsRepository.save(submission);
  }
}
