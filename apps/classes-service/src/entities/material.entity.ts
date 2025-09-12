import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

export enum FileType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other'
}

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn()
  material_id: number;

  @Column({ type: 'integer', nullable: false })
  post_id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  file_url: string;

  @Column({ type: 'integer', nullable: false })
  uploaded_by: number;

  @CreateDateColumn({ name: 'uploaded_at', type: 'timestamp', default: () => 'now()' })
  uploaded_at: Date;

  @Column({ 
    type: 'enum', 
    enum: FileType, 
    default: FileType.OTHER 
  })
  type: FileType;

  @Column({ type: 'integer', nullable: true })
  file_size: number;

  @ManyToOne(() => Post, post => post.materials)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
