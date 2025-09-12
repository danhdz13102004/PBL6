import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { ClassEnrollment } from './class-enrollment.entity';
import { ClassTeacher } from './class-teacher.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  class_id: number;

  @Column({ type: 'varchar', nullable: false })
  class_name: string;

  @Column({ type: 'varchar', unique: true })
  class_code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: false })
  teacher_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @OneToMany(() => Post, post => post.class)
  posts: Post[];

  @OneToMany(() => ClassEnrollment, enrollment => enrollment.class)
  enrollments: ClassEnrollment[];

  @OneToMany(() => ClassTeacher, classTeacher => classTeacher.class)
  teachers: ClassTeacher[];
}
