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
    @Body() userData: Partial<User>,
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      if (userData.id) {
        return res.status(401).json({
          message: 'O id não pode ser alterado',
        });
      }
      await this.userService.updateUser(parseInt(id), userData);
      return res.status(201).json({
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('find')
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
      const response = await this.authService.generateToken(
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
  @Post('delete/:id')
  async deleteUser(
    @Body() userData: Partial<User>,
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      await this.userService.updateUser(parseInt(id, 10), { isActive: false });
      return res.status(202).json({
        message: 'Usuário desativado com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
