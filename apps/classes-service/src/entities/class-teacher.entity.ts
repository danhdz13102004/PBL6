import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Class } from './class.entity';

@Entity('class_teacher')
export class ClassTeacher {
  @PrimaryColumn({ type: 'integer' })
  class_id: number;

  @PrimaryColumn({ type: 'integer' })
  teacher_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @ManyToOne(() => Class, classEntity => classEntity.teachers)
  @JoinColumn({ name: 'class_id' })
  class: Class;
}
