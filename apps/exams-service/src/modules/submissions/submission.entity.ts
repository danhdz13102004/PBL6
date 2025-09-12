import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Exam } from '../exams/exam.entity';
import { SubmissionAnswer } from '../submission-answers/submission-answer.entity';

@Entity('submissions')
@Unique(['exam_id', 'student_id'])
export class Submission {
  @PrimaryGeneratedColumn()
  submission_id: number;

  @Column({ type: 'integer', nullable: false })
  exam_id: number;

  @Column({ type: 'integer', nullable: false })
  student_id: number;

  @CreateDateColumn({ name: 'submitted_at', type: 'timestamp', default: () => 'now()' })
  submitted_at: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, comment: 'Score out of total points' })
  score: number;

  @Column({ type: 'text', nullable: true })
  teacher_feedback: string;

  @Column({ type: 'timestamp', nullable: true })
  graded_at: Date;

  @Column({ type: 'integer', nullable: true })
  graded_by: number;

  @ManyToOne(() => Exam, exam => exam.submissions)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @OneToMany(() => SubmissionAnswer, answer => answer.submission)
  answers: SubmissionAnswer[];
}
