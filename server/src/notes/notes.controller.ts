import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/db/models/user.model';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RemoveAttachmentDto } from './dto/remove-attachment-dto';

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

  @Delete('trash')
  getTrashedNotes(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.getTrashed(user.id);
  }
  @Delete(':id/trash')
  trash(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.moveToTrash(id, user.id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.restoreFromTrash(id, user.id);
  }

  @Patch(':id/pin')
  pin(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.pin(id, user.id);
  }
  @Patch(':id/archive')
  archive(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.archive(id, user.id);
  }

  @Post(':id/attachment')
  @UseInterceptors(FilesInterceptor('files'))
  async addAttachments(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @CurrentUser() user: User,
    @Query('id') noteId: string,
  ) {
    return this.notesService.addAttachments(user.id, noteId, files);
  }

  @Patch(':id/attachment')
  async removeAttachments(
    @Body() dto: RemoveAttachmentDto,
    @Query('id') noteId: string,
    @CurrentUser() user: User,
  ) {
    return this.notesService.removeAttachments(dto.ids, noteId, user.id);
  }
}
