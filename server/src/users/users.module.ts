import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { User } from 'src/db/models/user.model';
import { UsersController } from './users.controller';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
