import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/db/models/user.model';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @CurrentUser() user: User) {
    return this.notesService.create(createNoteDto, user.id);
  }

  @Get('/')
  findMyNotes(@CurrentUser() user: User) {
    return this.notesService.findUserNotes(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findById(id);
  }
  @Get('user/:id')
  findUserNotes(@Param('id') id: string, @Query() query: GetNotesQueryDto) {
    return this.notesService.findUserNotesSorted(id, query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, user.id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.remove(id, user.id);
  }

  @Patch(':id/pin')
  pin(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.pin(id, user.id);
  }
  @Patch(':id/archive')
  archive(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.archive(id, user.id);
  }
}
