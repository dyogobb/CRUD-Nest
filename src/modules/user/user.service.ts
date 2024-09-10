/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

interface FindOneUserResponse {
  message: string;
  user?: User;
}

interface LoginResponse {
  message: string;
  data?: User;
  isLogged: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const hash = await this.hashPassword(userData.password);
    userData.password = hash;
    const newUser = this.usersRepository.create(userData);
    const response = await this.usersRepository.save(newUser);
    return response;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<void> {
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

  async userLogin(email: string, password: string): Promise<LoginResponse> {
    const response = await this.findOneUser(email);
    const user = response.user;
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return {
        message: 'Login realizado com sucesso.',
        isLogged: true,
        data: user,
      };
    }

    return {
      message: 'Credenciais inválidas.',
      isLogged: false,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
