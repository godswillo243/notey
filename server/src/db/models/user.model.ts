import { index, modelOptions, prop } from '@typegoose/typegoose';
import { Role } from '../enums';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    id: true,
  },
})
@index({ email: 1 })
export class User {
  public id!: string;

  @prop({
    minlength: 3,
    maxlength: 20,
    required: true,
    trim: true,
  })
  public name!: string;

  @prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  public email!: string;

  @prop({
    minlength: 6,
    required: true,
  })
  public password!: string;

  @prop({
    enum: Role,
    default: Role.USER,
  })
  public role!: Role;

  @prop({ default: false })
  public isVerified!: boolean;

  @prop({ default: '' })
  public bio!: string;

  @prop({ default: '' })
  public verificationToken!: string | null;

  @prop({
    type: Date,
  })
  public verificationTokenExpiresAt?: Date | null;

  @prop({ default: '' })
  public avatar!: string;

  @prop({ default: '' })
  public refreshToken!: string | null;

  @prop({
    type: Date,
  })
  public refreshTokenExpiresAt?: Date | null;

  @prop({ default: '' })
  public resetPasswordToken!: string | null;

  @prop({
    type: Date,
  })
  public resetPasswordTokenExpiresAt?: Date | null;

  @prop({
    type: Date,
  })
  public lastLogin?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

/*

User
├── name
├── email
├── password
├── avatar
├── bio
├── emailVerified
├── role
├── refreshToken
├── lastLogin
├── createdAt
└── updatedAt

*/
