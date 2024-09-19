import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class MyAccountDto {
  @IsEmail()
  email: string;
}

export class ToUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  first_name?: string;

  @IsOptional()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  token: string;

  @IsOptional()
  @IsNotEmpty()
  is_logged: boolean;

  @IsOptional()
  @IsNotEmpty()
  is_active: boolean;
}

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ToUpdateDto)
  to_update: ToUpdateDto;
}
