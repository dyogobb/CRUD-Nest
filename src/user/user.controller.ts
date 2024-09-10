import { Controller, Get, Post, Body, Res, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('create')
  async createUser(
    @Body() userData: Partial<User>,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const newUser = await this.userService.createUser(userData);
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao criar usuário',
        error: error.message,
      });
    }
  }

  @Put('update')
  async updateUser(
    @Body() userData: Partial<User>,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.userService.updateUser(userData.id, userData);
      return res.status(201).json({
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

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
}
