import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn({ name: 'meeting_id' })
  meeting_id: number;

  @Column({ type: 'integer', nullable: false })
  class_id: number;

  @Column({ type: 'varchar', nullable: false })
  topic: string;

  @Column({ name: 'start_time', type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: false })
  end_time: Date;

  @Column({ type: 'varchar', default: 'public', nullable: false })
  type: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  created_at: Date;
}
