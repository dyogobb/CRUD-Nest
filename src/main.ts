import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDatabaseIfNotExists } from './modules/database/create.db';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await createDatabaseIfNotExists();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
