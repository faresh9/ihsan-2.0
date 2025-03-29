
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.eventsService.findAll(req.user.id);
  }

  @Get('month')
  findByMonth(@Query('date') dateStr: string, @Request() req) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.eventsService.findByMonth(req.user.id, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.eventsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }
}
