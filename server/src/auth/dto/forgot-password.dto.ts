import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email: string;
}
