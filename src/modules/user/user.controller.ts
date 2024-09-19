import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateUserDto,
  DeactvateUserDto,
  LoginDto,
  MyAccountDto,
  UpdateUserDto,
} from './user.validation';

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
    @Body() userData: CreateUserDto,
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

  @Put('update')
  async updateUser(
    @Body()
    userData: UpdateUserDto,
    @Headers('authorization') token: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const response = await this.userService.updateUser(
        userData,
        token.split(' ')[1],
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
    @Body() userData: MyAccountDto,
    @Headers('authorization') token: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const response = await this.userService.findUser(
        userData.email,
        token.split(' ')[1],
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  @Post('login')
  async userLogin(
    @Body() userData: LoginDto,
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
    @Body() userData: DeactvateUserDto,
    @Res() res: Response,
    @Headers('authorization') token: string,
  ): Promise<Response> {
    try {
      return res
        .status(200)
        .json(
          await this.userService.deactvateUser(userData, token.split(' ')[1]),
        );
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
