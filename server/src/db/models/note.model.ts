import { index, modelOptions, prop, type Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
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
  @prop({
    minlength: 3,
    maxlength: 25,
    required: true,
  })
  public title!: string;

  @prop({
    maxlength: 256,
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
  public isPublic!: boolean;

  @prop({ default: () => [String] })
  public tags!: string[];

  @prop({ default: '' })
  public color!: string;
}
