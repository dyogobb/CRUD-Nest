import { Client } from 'pg';
import 'dotenv/config';

export async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.HOST_DB,
    port: parseInt(process.env.PORT_DB, 10),
    user: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DATABASE}'`,
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.DATABASE}`);
      console.log('Banco de dados criado com sucesso!');
    } else {
      console.log('Banco de dados já existe.');
    }
  } catch (error) {
    console.error('Erro ao conectar no PostgreSQL:', error);
  } finally {
    await client.end();
  }
}
