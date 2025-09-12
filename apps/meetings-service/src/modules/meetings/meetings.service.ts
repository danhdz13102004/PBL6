import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { CreateMeetingDto, UpdateMeetingDto } from './dto/meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingsRepo: Repository<Meeting>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const meeting = this.meetingsRepo.create({
      ...createMeetingDto,
      start_time: new Date(createMeetingDto.start_time),
      end_time: new Date(createMeetingDto.end_time),
    });
    return await this.meetingsRepo.save(meeting);
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDto): Promise<Meeting> {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    const updateData: any = { ...updateMeetingDto };
    if (updateMeetingDto.start_time) {
      updateData.start_time = new Date(updateMeetingDto.start_time);
    }
    if (updateMeetingDto.end_time) {
      updateData.end_time = new Date(updateMeetingDto.end_time);
    }

    await this.meetingsRepo.update(id, updateData);
    return await this.findOne(id);
  }

  async findOne(id: number): Promise<Meeting> {
    const meeting = await this.meetingsRepo.findOne({ 
      where: { meeting_id: id } 
    });
    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }
    return meeting;
  }

  async findByClass(classId: number): Promise<Meeting[]> {
    return await this.meetingsRepo.find({
      where: { class_id: classId },
      order: { start_time: 'ASC' },
    });
  }

  async findAll(): Promise<Meeting[]> {
    return await this.meetingsRepo.find({
      order: { start_time: 'ASC' },
    });
  }

  async remove(id: number): Promise<void> {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }
    await this.meetingsRepo.remove(meeting);
  }
}
