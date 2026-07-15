import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { User } from 'src/db/models/user.model';
import { UsersController } from './users.controller';
import { UploadModule } from 'src/uploads/upload.module';

@Module({
  imports: [TypegooseModule.forFeature([User]), UploadModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
