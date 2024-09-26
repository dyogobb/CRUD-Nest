/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { UpdateResult } from 'typeorm';

interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface UpdateUserData {
  email: string;
  to_update: Partial<CanUpdate>;
}

interface CanUpdate {
  frist_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
  is_logged: boolean;
  is_active: boolean;
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

  async updateUser(
    userData: UpdateUserData,
    token: string,
  ): Promise<{
    message?: string;
    data?: Partial<User> | UpdateResult;
    error?: Error;
  }> {
    const storedUser = await this.findUser(userData.email, token);

    if (!storedUser.user) {
      return storedUser;
    }

    if (!(await this.verifyTokenById(token, storedUser.user.id))) {
      return { message: 'O token não pertence ao usuário.' };
    }

    if (userData.to_update.password) {
      userData.to_update.password = await this.hashPassword(
        userData.to_update.password,
      );
    }

    await this.usersRepository.update(storedUser.user.id, userData.to_update);

    return {
      message: 'Usuário atualizado.',
      data: await this.usersRepository.findOne({
        where: {
          email: userData.email,
        },
      }),
    };
  }

  async findUser(
    email: string,
    token: string,
  ): Promise<{ message: string; user?: User }> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return {
        message: 'O usuário não foi encontrado, verifique o e-mail.',
      };
    }

    if (token) {
      if (!(await this.verifyTokenById(token, user.id))) {
        return {
          message: 'Token não pertence ao usuário.',
        };
      }
    }

    if (!user.is_active) {
      return {
        message: 'Usuário inativo.',
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
  ): Promise<{ message?: string; data?: User; error?: Error }> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return {
          message: 'O usuário não foi encontrado, verifique o e-mail.',
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return {
          message: 'Senha inválida.',
        };
      }

      const token = await this.authService.generateToken(user.id, user.email);

      await this.usersRepository.update(user.id, {
        token: token.token,
        is_logged: true,
      });

      return {
        message: 'Login realizado com sucesso.',
        data: await this.usersRepository.findOne({
          where: {
            email: email,
          },
        }),
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async createUser(
    userData: CreateUser,
  ): Promise<{ message?: string; data?: User; error?: Error }> {
    try {
      if (userData.password !== userData.password_confirmation) {
        return {
          message: 'As senhas não são iguais.',
        };
      }
      userData.password = await this.hashPassword(userData.password);

      const newUser = this.usersRepository.create(userData);

      const response = await this.usersRepository.save(newUser);

      return {
        message: 'Usuário cadastrado com sucesso.',
        data: response,
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async verifyTokenById(token: string, id: number) {
    const verifyId = await this.authService.extractId(token);

    if (verifyId !== id) {
      return false;
    }

    return true;
  }

  async deactvateUser(
    userData: {
      password: string;
    },
    token: string,
  ): Promise<{ message: string }> {
    const id = await this.authService.extractId(token);
    const storedUser = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });

    const isMatch = await bcrypt.compare(
      userData.password,
      storedUser.password,
    );

    if (!isMatch) {
      return {
        message: 'Senha inválida.',
      };
    }

    await this.usersRepository.update(id, { is_active: false });

    return {
      message: 'Usuário desativado.',
    };
  }
}
