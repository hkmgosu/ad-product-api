import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { username: string; password: string };
type AuthResult = { accessToken: string; username: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(input: AuthInput): Promise<AuthResult | null> {
    const user = await this.usersService.findOne(input.username);

    // Of course in a real application, you wouldn't store a password in plain text.
    // You'd instead use a library like bcrypt, with a salted one-way hash algorithm.
    if (user?.password !== input.password) {
      throw new UnauthorizedException();
    }
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload = { sub: user.userId, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      username: user.username,
    };
  }
}
