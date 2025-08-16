import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'emlak_portfoy_db',
      charset: 'utf8mb4'
    },
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100
    },
    migrations: {
      directory: path.join(__dirname, 'database/migrations'),
      tableName: 'knex_migrations',
      extension: 'ts'
    },
    seeds: {
      directory: path.join(__dirname, 'database/seeds'),
      extension: 'ts'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: path.join(__dirname, 'database/migrations'),
      tableName: 'knex_migrations',
      extension: 'ts'
    },
    seeds: {
      directory: path.join(__dirname, 'database/seeds'),
      extension: 'ts'
    }
  }
};

export default config;