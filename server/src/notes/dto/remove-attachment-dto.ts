import { IsArray, IsNotEmpty } from 'class-validator';

export class RemoveAttachmentDto {
  @IsArray()
  @IsNotEmpty()
  public ids!: string[];
}
