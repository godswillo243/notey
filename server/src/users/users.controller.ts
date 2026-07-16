import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/db/models/user.model';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:userId')
  @Public()
  async getUserProfile(@Param('userId') userId: string) {
    return await this.usersService.getUserProfile(userId);
  }

  @Put('profile')
  async updateProfile(
    @Body() dto: UpdateUserProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return this.usersService.uploadAvatar(user.id, file);
  }

  @Delete('avatar')
  async removeAvatar(@CurrentUser() user: User) {
    return this.usersService.removeAvatar(user.id);
  }
}
