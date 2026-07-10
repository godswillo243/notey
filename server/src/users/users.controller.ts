import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {} from 'src/db/models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
