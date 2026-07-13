import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Note } from 'src/db/models/note.model';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [AuthModule, UsersModule, TypegooseModule.forFeature([Note])],
})
export class NotesModule {}
