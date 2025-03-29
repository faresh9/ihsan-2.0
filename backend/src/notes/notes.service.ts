import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      user,
    });
    
    const savedNote = await this.notesRepository.save(note);
    
    return savedNote;
  }

  async findAll(userId: string): Promise<Note[]> {
    const notes = await this.notesRepository.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
    
    return notes;
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, user: { id: userId } },
    });
    
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    
    const updatedNote = this.notesRepository.merge(note, updateNoteDto);
    const result = await this.notesRepository.save(updatedNote);
    
    return result;
  }

  async remove(id: string, userId: string): Promise<void> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);
  }
}
