import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissionAnswer } from './submission-answer.entity';
import { CreateSubmissionAnswerDto, UpdateSubmissionAnswerDto } from './dto';

@Injectable()
export class SubmissionAnswersService {
  constructor(
    @InjectRepository(SubmissionAnswer)
    private submissionAnswersRepository: Repository<SubmissionAnswer>,
  ) {}

  async createSubmissionAnswer(createDto: CreateSubmissionAnswerDto): Promise<SubmissionAnswer> {
    const submissionAnswer = this.submissionAnswersRepository.create(createDto);
    return this.submissionAnswersRepository.save(submissionAnswer);
  }

  async findSubmissionAnswerById(id: number): Promise<SubmissionAnswer> {
    const submissionAnswer = await this.submissionAnswersRepository.findOne({
      where: { answer_id: id },
      relations: ['submission', 'question']
    });

    if (!submissionAnswer) {
      throw new NotFoundException(`Submission answer with ID ${id} not found`);
    }

    return submissionAnswer;
  }

  async updateSubmissionAnswer(id: number, updateDto: UpdateSubmissionAnswerDto): Promise<SubmissionAnswer> {
    const submissionAnswer = await this.findSubmissionAnswerById(id);
    Object.assign(submissionAnswer, updateDto);
    return this.submissionAnswersRepository.save(submissionAnswer);
  }

  async findAnswersBySubmission(submissionId: number): Promise<SubmissionAnswer[]> {
    return this.submissionAnswersRepository.find({
      where: { submission_id: submissionId },
      relations: ['question']
    });
  }
}
