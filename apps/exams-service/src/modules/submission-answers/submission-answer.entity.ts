import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Submission } from '../submissions/submission.entity';
import { Question } from '../questions/question.entity';

@Entity('submission_answers')
export class SubmissionAnswer {
  @PrimaryGeneratedColumn()
  answer_id: number;

  @Column({ type: 'integer', nullable: false })
  submission_id: number;

  @Column({ type: 'integer', nullable: false })
  question_id: number;

  @Column({ type: 'text', nullable: false })
  answer_content: string;

  @Column({ type: 'boolean', default: false })
  is_correct: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  points_earned: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'integer', nullable: true })
  comment_by: number;

  @ManyToOne(() => Submission, submission => submission.answers)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @ManyToOne(() => Question, question => question.submission_answers)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
