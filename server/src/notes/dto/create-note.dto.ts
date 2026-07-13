<<<<<<< HEAD
export class CreateNoteDto {
  title: string;
  content: string;
  color: string;
=======
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'New note' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  public title!: string;

  @ApiProperty({ example: 'New note content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  public content!: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  @IsBoolean()
  public isPublic!: boolean;

  @ApiProperty({ example: '["life", "sports"]' })
  @IsArray()
  @IsOptional()
  public tags!: string[];

  @ApiProperty({ example: 'red' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  public color!: string;
>>>>>>> 58b45b5 (Implement note management and user profile features)
}
