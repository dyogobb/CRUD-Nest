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
    id: number,
    email: string,
  ): Promise<{
    access_token?: string;
  }> {
    const payload = { sub: id, email: email };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }
}
