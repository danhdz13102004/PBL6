import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionsRepository.create(createQuestionDto);
    return this.questionsRepository.save(question);
  }

  async findAllQuestions(type?: string): Promise<Question[]> {
    const queryBuilder = this.questionsRepository.createQueryBuilder('question');
    
    if (type) {
      queryBuilder.where('question.type = :type', { type });
    }

    return await queryBuilder.getMany();
  }

  async findQuestionById(id: number): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { question_id: id },
      relations: ['exams', 'submission_answers']
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async updateQuestion(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findQuestionById(id);
    Object.assign(question, updateQuestionDto);
    return await this.questionsRepository.save(question);
  }

  async deleteQuestion(id: number): Promise<void> {
    const question = await this.findQuestionById(id);
    await this.questionsRepository.remove(question);
  }

  async findQuestionsByExam(examId: number): Promise<Question[]> {
    return await this.questionsRepository
      .createQueryBuilder('question')
      .innerJoin('question.exams', 'exam')
      .where('exam.exam_id = :examId', { examId })
      .getMany();
  }
}
