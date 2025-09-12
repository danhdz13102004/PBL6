import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Submission } from '../submissions/submission.entity';
import { Question } from '../questions/question.entity';

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  exam_id: number;

  @Column({ type: 'integer', nullable: false })
  class_id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_time: Date;

  @Column({ type: 'enum', enum: ExamStatus, default: ExamStatus.DRAFT })
  status: ExamStatus;

  @Column({ type: 'integer', nullable: false })
  created_by: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @OneToMany(() => Submission, submission => submission.exam)
  submissions: Submission[];

  @ManyToMany(() => Question, question => question.exams)
  @JoinTable({
    name: 'question_exams',
    joinColumn: {
      name: 'exam_id',
      referencedColumnName: 'exam_id'
    },
    inverseJoinColumn: {
      name: 'question_id',
      referencedColumnName: 'question_id'
    }
  })
  questions: Question[];
}
