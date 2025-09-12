import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image'
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  sender_id: number;

  @Column({ type: 'integer', nullable: false })
  conversation_id: number;

  @CreateDateColumn({ name: 'timestamp', type: 'timestamp', default: () => 'now()' })
  timestamp: Date;

  @Column({ 
    type: 'enum', 
    enum: MessageType, 
    default: MessageType.TEXT 
  })
  message_type: MessageType;

  @Column({ type: 'text', nullable: true })
  content: string;
}
