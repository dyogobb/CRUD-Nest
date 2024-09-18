import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface PayloadType {
  email: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(
    id: number,
    email: string,
  ): Promise<{
    token?: string;
  }> {
    const payload = { sub: id, email: email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
    };
  }

  async extractId(token: string) {
    const payload: PayloadType = await this.jwtService.decode(token);
    return payload.sub;
  }
}
