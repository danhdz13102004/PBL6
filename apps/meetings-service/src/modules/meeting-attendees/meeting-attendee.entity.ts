import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('meeting_attendees')
@Index(["meeting_id", "user_id"], { unique: true })
export class MeetingAttendee {
  @PrimaryGeneratedColumn({ name: 'attendance_id' })
  attendance_id: number;

  @Column({ type: 'integer', nullable: false })
  meeting_id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamp', default: () => 'now()' })
  joined_at: Date;

  @Column({ type: 'varchar', nullable: true })
  device_id: string;
}
