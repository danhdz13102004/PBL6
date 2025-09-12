import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from '../questions/question.entity';
import { Exam } from '../exams/exam.entity';

@Entity('question_exams')
export class QuestionExam {
  @PrimaryColumn()
  question_id: number;

  @PrimaryColumn()
  exam_id: number;

  @Column({ type: 'integer', default: 1 })
  points: number;

  @ManyToOne(() => Question, question => question.question_exams)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Exam, exam => exam.questions)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;
}
