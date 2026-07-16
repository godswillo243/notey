import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { type ReturnModelType } from '@typegoose/typegoose';
import { Note } from 'src/db/models/note.model';
import { UsersService } from 'src/users/users.service';
import { Document, Types } from 'mongoose';
import { GetNotesQueryDto } from './dto/get-notes-query.dto';
import { UploadService } from 'src/uploads/upload.service';
import { Attachment } from 'src/db/models/attachment.model';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private readonly noteModel: ReturnModelType<typeof Note>,
    @InjectModel(Attachment)
    private readonly attachmentModel: ReturnModelType<typeof Attachment>,
    private readonly userService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string) {
    const note = await this.noteModel.create({
      ...createNoteDto,
      owner: userId,
    });
    return this.serialize(note);
  }

  find() {
    return `This action returns all notes`;
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid id.');

    const note = (await this.noteModel
      .findById(new Types.ObjectId(id))
      .populate('attachments')) as Note;

    if (!note) throw new NotFoundException('Note not found.');

    return this.serialize(note);
  }

  async findUserNotes(userId: string, limit: number = 32) {
    const notes = (await this.noteModel
      .find({ owner: userId }, {}, { limit, sort: { createdAt: -1 } })
      .populate('attachments')) as unknown as Note[];
    return notes.map((note) => this.serialize(note));
  }

  async findUserNotesSorted(userId: string, query: GetNotesQueryDto) {
    const { limit, search, page, archived, pinned } = query;

    const filter: Record<string, any> = {
      owner: new Types.ObjectId(userId),
    };

    if (archived !== undefined) filter.archived = archived;
    if (pinned !== undefined) filter.pinned = pinned;
    if (search)
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];

    const notes = await this.noteModel
      .find(filter, null, {
        limit,
        skip: (page - 1) * limit,
        sort: { createdAt: -1 },
      })
      .populate('attachments');
    return notes.map((note) => this.serialize(note));
  }

  async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOwnedNote(id, userId);

    const updatedNote = (await this.noteModel.findByIdAndUpdate(
      note.id,
      updateNoteDto,
      { returnDocument: 'after' },
    )) as Note;

    return this.serialize(updatedNote);
  }

  async pin(id: string, userId: string) {
    const note = await this.findOwnedNote(id, userId);

    let updatedNote: Note | null = null;
    if (!note.pinned) {
      updatedNote = await this.noteModel.findByIdAndUpdate(
        id,
        { pinned: !note.pinned },
        { returnDocument: 'after' },
      );
    } else {
      updatedNote = await this.noteModel.findByIdAndUpdate(
        id,
        { pinned: !note.pinned },
        { returnDocument: 'after' },
      );
    }

    return this.serialize(updatedNote as Note);
  }
  async archive(id: string, userId: string) {
    const note = await this.findOwnedNote(id, userId);

    let updatedNote: Note | null = null;
    if (!note.archived) {
      updatedNote = await this.noteModel.findByIdAndUpdate(
        id,
        { archived: true },
        { returnDocument: 'after' },
      );
    } else {
      updatedNote = await this.noteModel.findByIdAndUpdate(
        id,
        { archived: false },
        { returnDocument: 'after' },
      );
    }

    return this.serialize(updatedNote as Note);
  }
  async remove(id: string, userId: string) {
    const note = await this.findOwnedNote(id, userId);

    await this.noteModel.findByIdAndDelete(note.id);
    return { message: 'Note removed successfully.' };
  }

  async getTrashed(userId: string) {
    const trashedNotes = await this.noteModel.find({
      owner: userId,
      deletedAt: { $exists: true },
    });
    return trashedNotes.map((note) => this.serialize(note));
  }

  async moveToTrash(id: string, userId: string) {
    const note = await this.findOwnedNote(id, userId);

    if (note.deletedAt === null)
      throw new BadRequestException('Note is already in trash');

    await this.noteModel.findByIdAndUpdate(note.id, {
      deletedAt: new Date(Date.now()).toISOString(),
    });
    return { message: 'Note moved to trash successfully.' };
  }

  async restoreFromTrash(id: string, userId: string) {
    const note = await this.findOwnedNote(id, userId);

    if (note.deletedAt !== null)
      throw new BadRequestException('Note is not in trash');

    await this.noteModel.findByIdAndUpdate(id, {
      $unset: {
        deletedAt: 1,
      },
    });
    return { message: 'Note removed from trash successfully.' };
  }

  async getStats(userId: string) {
    const [stats]: Record<string, number>[] = await this.noteModel.aggregate([
      {
        $match: {
          owner: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pinned: {
            $sum: {
              $cond: ['$pinned', 1, 0],
            },
          },

          archived: {
            $sum: {
              $cond: ['$archived', 1, 0],
            },
          },
          public: {
            $sum: {
              $cond: ['$isPublic', 1, 0],
            },
          },
          trash: {
            $sum: {
              $cond: [{ $ne: ['$deletedAt', null] }, 1, 0],
            },
          },
        },
      },
    ]);

    return (
      stats ?? {
        total: 0,
        pinned: 0,
        archived: 0,
        trash: 0,
      }
    );
  }

  async addAttachments(
    userId: string,
    noteId: string,
    files: Express.Multer.File[],
  ) {
    const note = await this.findOwnedNote(noteId, userId);
    const results = await this.uploadService.uploadImages(files, 'attachments');
    const attachmentFields = results.map(
      ({ secure_url, bytes, public_id, original_filename, resource_type }) => ({
        url: secure_url,
        publicId: public_id,
        fileName: original_filename,
        mimeType: resource_type,
        size: bytes,
      }),
    );
    const attachments = await this.attachmentModel.create(attachmentFields);
    const attachmentIds = [
      ...note.attachments.map(({ id }) => id),
      ...attachments.map(({ id }) => id),
    ];
    await this.noteModel.findByIdAndUpdate(note.id, {
      attachments: attachmentIds,
    });

    return attachments.map(({ url, id, mimeType, size }) => ({
      id,
      url,
      mimeType,
      size,
    }));
  }

  async removeAttachments(
    attachmentIds: string[],
    noteId: string,
    userId: string,
  ) {
    const note = await this.findOwnedNote(noteId, userId);
    const attachments = await this.attachmentModel.find({
      id: { $in: attachmentIds },
      note: note.id,
    });

    await this.uploadService.removeImages(attachments.map(({ url }) => url));

    await this.attachmentModel.deleteMany({ id: { $in: attachmentIds } });

    return { message: 'Attachments deleted successfully' };
  }

  private async findOwnedNote(id: string, userId: string) {
    // validate id
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid id.');
    // find note
    const note = await this.noteModel.findById(new Types.ObjectId(id));
    if (!note) {
      throw new NotFoundException('Note not found.');
    }
    // check ownership
    if (note.owner._id.toString() !== userId)
      throw new UnauthorizedException(
        'You cannot access a note that you do not own.',
      );
    return note;
  }

  serialize(note: Note): Note {
    return {
      archived: note.archived,
      attachments: note.attachments,
      collaborators: note.collaborators,
      color: note.color,
      content: note.content,
      createdAt: note.createdAt,
      deleted: note.deleted,
      deletedAt: note.deletedAt,
      id: note.id,
      isPublic: note.isPublic,
      owner: note.owner,
      pinned: note.pinned,
      tags: note.tags,
      title: note.title,
      updatedAt: note.updatedAt,
    };
  }
}
