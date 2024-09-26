import { DataSource } from 'typeorm';
import { User } from '../user/user.entity';
import 'dotenv/config';

export const PsqlDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST_DB,
  port: parseInt(process.env.PORT_DB, 10),
  username: process.env.USERNAME_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: ['/modules/migrations'],
});
