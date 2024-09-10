import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateToken(
    email: string,
    password: string,
  ): Promise<{ message: string; isLogged: boolean; access_token: string }> {
    const user = await this.usersService.userLogin(email, password);
    if (user.isLogged) {
      const payload = { sub: user.data.id, email: user.data.email };
      return {
        message: user.message,
        isLogged: user.isLogged,
        access_token: await this.jwtService.signAsync(payload),
      };
    }

    throw new UnauthorizedException();
  }
}
