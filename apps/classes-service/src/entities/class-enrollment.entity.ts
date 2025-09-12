import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Class } from './class.entity';

@Entity('class_enrollments')
@Index(['class_id', 'student_id'], { unique: true })
export class ClassEnrollment {
  @PrimaryGeneratedColumn()
  enrollment_id: number;

  @Column({ type: 'integer', nullable: false })
  class_id: number;

  @Column({ type: 'integer', nullable: false })
  student_id: number;

  @CreateDateColumn({ name: 'enrolled_at', type: 'timestamp', default: () => 'now()' })
  enrolled_at: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at: Date;

  @ManyToOne(() => Class, classEntity => classEntity.enrollments)
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
