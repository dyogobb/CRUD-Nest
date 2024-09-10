import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

interface userData {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() userData: userData, @Res() res: Response) {
    try {
      const response = await this.authService.generateToken(
        userData.email,
        userData.password,
      );
      if (response.isLogged) {
        return res.status(200).json(response);
      }

      return res.status(401).json(response.message);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
