import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Exam } from '../exams/exam.entity';
import { SubmissionAnswer } from '../submission-answers/submission-answer.entity';
import { QuestionExam } from '../question-exams/question-exam.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  question_id: number;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false, comment: 'MCQ, essay, true/false' })
  type: string;

  @Column({ type: 'json', nullable: true, comment: 'JSON array for MCQ options' })
  options: any;

  @Column({ type: 'text', nullable: true })
  correct_answer: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @OneToMany(() => SubmissionAnswer, answer => answer.question)
  submission_answers: SubmissionAnswer[];

  @ManyToMany(() => Exam, exam => exam.questions)
  exams: Exam[];

  @OneToMany(() => QuestionExam, questionExam => questionExam.question)
  question_exams: QuestionExam[];
}
