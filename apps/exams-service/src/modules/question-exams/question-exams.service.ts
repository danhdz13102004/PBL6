import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionExam } from './question-exam.entity';
import { CreateQuestionExamDto, UpdateQuestionExamDto } from './dto';

@Injectable()
export class QuestionExamsService {
  constructor(
    @InjectRepository(QuestionExam)
    private questionExamsRepository: Repository<QuestionExam>,
  ) {}

  async createQuestionExam(createDto: CreateQuestionExamDto): Promise<QuestionExam> {
    const questionExam = this.questionExamsRepository.create(createDto);
    return this.questionExamsRepository.save(questionExam);
  }

  async findQuestionExam(questionId: number, examId: number): Promise<QuestionExam> {
    const questionExam = await this.questionExamsRepository.findOne({
      where: { question_id: questionId, exam_id: examId },
      relations: ['question', 'exam']
    });

    if (!questionExam) {
      throw new NotFoundException(`Question-Exam relationship not found`);
    }

    return questionExam;
  }

  async updateQuestionExam(questionId: number, examId: number, updateDto: UpdateQuestionExamDto): Promise<QuestionExam> {
    const questionExam = await this.findQuestionExam(questionId, examId);
    Object.assign(questionExam, updateDto);
    return this.questionExamsRepository.save(questionExam);
  }

  async deleteQuestionExam(questionId: number, examId: number): Promise<void> {
    const questionExam = await this.findQuestionExam(questionId, examId);
    await this.questionExamsRepository.remove(questionExam);
  }

  async findQuestionsByExam(examId: number): Promise<QuestionExam[]> {
    return this.questionExamsRepository.find({
      where: { exam_id: examId },
      relations: ['question']
    });
  }

  async findExamsByQuestion(questionId: number): Promise<QuestionExam[]> {
    return this.questionExamsRepository.find({
      where: { question_id: questionId },
      relations: ['exam']
    });
  }
}
