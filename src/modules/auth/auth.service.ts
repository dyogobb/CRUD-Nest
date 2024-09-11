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
  ): Promise<{
    message: string;
    isLogged: boolean;
    access_token?: string | UnauthorizedException;
  }> {
    const user = await this.usersService.userLogin(email, password);
    if (user.isLogged) {
      const payload = { sub: user.data.id, email: user.data.email };
      const token = await this.jwtService.signAsync(payload);
      await this.usersService.updateUser(user.data.id, { token: token });
      return {
        message: user.message,
        isLogged: user.isLogged,
        access_token: token,
      };
    }

    return {
      message: user.message,
      isLogged: user.isLogged,
      access_token: new UnauthorizedException(),
    };
  }
}
