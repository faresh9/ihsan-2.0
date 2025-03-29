import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      user,
    });
    
    const savedEvent = await this.eventsRepository.save(event);
    
    return savedEvent;
  }

  async findAll(userId: string): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { user: { id: userId } },
      order: { start: 'ASC' },
    });
  }

  async findByMonth(userId: string, date: Date): Promise<Event[]> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    
    const events = await this.eventsRepository.find({
      where: {
        user: { id: userId },
        start: Between(startOfMonth, endOfMonth),
      },
      order: { start: 'ASC' },
    });
    
    return events;
  }

  async findOne(id: string, userId: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event> {
    const event = await this.findOne(id, userId);
    
    const updatedEvent = this.eventsRepository.merge(event, updateEventDto);
    const result = await this.eventsRepository.save(updatedEvent);
    
    return result;
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.findOne(id, userId);
    
    await this.eventsRepository.remove(event);
  }

  private getMonthYear(date: Date): string {
    return `${date.getMonth()}_${date.getFullYear()}`;
  }
}
