import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;
}
