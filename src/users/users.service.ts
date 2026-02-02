import { Injectable } from '@nestjs/common';
import { userDto } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: userDto[] = [];
  create(newUser: userDto) {
    newUser.id = uuid();
    newUser.password = bcryptHashSync(newUser.password, 10);
    this.users.push(newUser);
  }

  findByUserName(userName: string): userDto | undefined {
    return this.users.find((user) => user.username === userName);
  }
}
