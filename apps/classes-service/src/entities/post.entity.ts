import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Material } from './material.entity';
import { Class } from './class.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  class_id: number;

  @Column({ type: 'integer', nullable: true })
  parent_id: number;

  @Column({ type: 'varchar', nullable: true })
  message: string;

  @Column({ type: 'integer', nullable: false })
  sender_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @ManyToOne(() => Class, classEntity => classEntity.posts)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @OneToMany(() => Material, material => material.post)
  materials: Material[];
}
