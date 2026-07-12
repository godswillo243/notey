import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/db/models/user.model';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
}
