import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  sender_id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  receiver_id: string;
}
