import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    versionKey: false,
    id: true,
    timestamps: true,
  },
})
export class Attachment {
  public id: string;
  @prop({ required: true })
  public url!: string;

  @prop({ required: true })
  public publicId!: string;

  @prop({ required: true })
  public fileName!: string;

  @prop({ required: true })
  public mimeType!: string;

  @prop({ required: true })
  public size!: number;

  public createdAt: Date;
  public updatedAt: Date;
}
