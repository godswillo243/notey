import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({ example: 'update note' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(25)
  public title!: string;

  @ApiProperty({ example: 'update note content' })
  @IsString()
  @MaxLength(512)
  @IsOptional()
  public content!: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  @IsBoolean()
  public isPublic!: boolean;

  @ApiProperty({ example: '["life", "sports"]' })
  @IsArray()
  @IsOptional()
  public tags: string[];

  @ApiProperty({ example: 'red' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  public color: string;
}
