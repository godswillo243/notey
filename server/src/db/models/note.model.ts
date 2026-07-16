import { index, modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { User } from './user.model';
import { Attachment } from './attachment.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    id: true,
    versionKey: false,
  },
})
@index({
  title: 'text',
})
@index({
  owner: 1,
})
@index(
  {
    owner: 1,
    title: 1,
  },
  {
    unique: true,
  },
)
export class Note {
  public id!: string;

  @prop({
    minlength: 3,
    maxlength: 25,
    required: true,
  })
  public title!: string;

  @prop({
    maxlength: 512,
    required: true,
  })
  public content!: string;

  @prop({ ref: () => User, required: true })
  public owner!: Ref<User>;

  @prop({ ref: () => User })
  public collaborators!: Ref<User>[];

  @prop({
    default: false,
  })
  public pinned!: boolean;

  @prop({
    default: false,
  })
  public archived!: boolean;

  @prop({
    default: false,
  })
  public deleted!: boolean;

  @prop({
    default: false,
  })
  public isPublic!: boolean;

  @prop({
    type: () => Attachment,
    default: [],
  })
  attachments!: Attachment[];

  @prop({ default: () => [String] })
  public tags!: string[];

  @prop({ default: '' })
  public color!: string;

  @prop({})
  public deletedAt: Date;

  public createdAt: Date;
  public updatedAt: Date;
}
