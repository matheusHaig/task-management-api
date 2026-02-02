import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly confiService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.confiService.get<number>(
      'JWT_EXPIRATION_TIME',
    )!;
  }

  signIn(userName: string, password: string): AuthResponseDto {
    const foundUser = this.userService.findByUserName(userName);

    if (!foundUser || !compareSync(password, foundUser.password)) {
      throw new UnauthorizedException();
    }

    const payLoad = { sub: foundUser.id, username: foundUser.username };
    const token = this.jwtService.sign(payLoad);
    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}
