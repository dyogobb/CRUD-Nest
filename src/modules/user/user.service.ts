/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

interface FindOneUserResponse {
  message: string;
  user?: User;
}

interface LoginResponse {
  message?: string;
  data?: User;
  isLogged: boolean;
  error?: Error;
}

interface UpdateUser {
  frist_name: string;
  last_name: string;
  email: string;
  password: string;
  isActive: boolean;
  token: string;
}

interface CreateUser {
  frist_name: string;
  last_name: string;
  email: string;
  password: string;
  isActive: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(id: number, userData: Partial<UpdateUser>): Promise<void> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    await this.usersRepository.update(id, userData);
  }

  async findOneUser(email: string): Promise<FindOneUserResponse> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return {
        message: 'O usuário não existe',
      };
    }
    return {
      message: 'Usuário encontrado',
      user: user,
    };
  }

  async userLogin(
    email: string,
    password: string,
  ): Promise<Partial<LoginResponse>> {
    try {
      const response = await this.findOneUser(email);

      if (!response.user) {
        return response;
      }

      const isMatch = await bcrypt.compare(password, response.user.password);

      if (isMatch) {
        const token = await this.authService.generateToken(
          response.user.id,
          response.user.email,
        );
        return {
          message: 'Login realizado com sucesso.',
          isLogged: true,
          data: response.user,
        };
      }
    } catch (error) {
      return {
        error: error.message,
        isLogged: false,
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async createUser(
    userdata: CreateUser,
  ): Promise<{ message?: string; data?: User; error?: Error }> {
    try {
      userdata.password = await this.hashPassword(userdata.password);
      const newUser = this.usersRepository.create(userdata);
      const response = await this.usersRepository.save(newUser);
      return {
        message: 'Usuário cadastrado com sucesso.',
        data: response,
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}
