import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingAttendee } from './meeting-attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingAttendee])],
  controllers: [],
  providers: [],
  exports: [],
})
export class MeetingAttendeesModule {}
