import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Quote } from './entities/Quote.js';
import { User } from './entities/User.js';
import { Admin } from './entities/Admin.js';

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_NAME'] as const;

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(
      `${varName} is missing. Add it to your .env file.\n` +
        'Required variables: DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME\n' +
        'See the Environment_Variables-Setup file on canvas for setup instructions.',
    );
  }
}

const useSSL = process.env.DB_SSL_MODE === 'require';

export const AppDataSource = new DataSource({
  synchronize: true,
  logging: false,
  entities: [Quote, User, Admin],
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

await AppDataSource.initialize();
