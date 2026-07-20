import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail({}, { message: 'Invalid email or password.' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Invalid email or password.' })
  password: string;
}
