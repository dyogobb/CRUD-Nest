import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

interface CreateUser {
  frist_name: string;
  last_name: string;
  email: string;
  password: string;
  isActive: boolean;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('create')
  async createUser(
    @Body() userData: CreateUser,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      return res.status(200).json(await this.userService.createUser(userData));
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao criar usuário',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async updateUser(
    @Body() userData: { email: string; toUpdate: Partial<User> },
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      const response = await this.userService.updateUser(
        parseInt(id),
        userData.toUpdate,
      );
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('my-account')
  async findUser(
    @Body() userData: Partial<User>,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const response = await this.userService.findOneUser(userData.email);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  @Post('login')
  async userLogin(
    @Body() userData: Partial<User>,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const response = await this.userService.userLogin(
        userData.email,
        userData.password,
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteUser(
    @Body() userData: Partial<User>,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      return res
        .status(200)
        .json(await this.userService.deactvateUser(userData));
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
