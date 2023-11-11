import { DataSource } from 'typeorm';
import { join } from 'path';
import { loadConfig } from './config';
loadConfig();

/**
 * Defines the configuration for the database connection.
 *
 * type: The type of database to connect to.
 * host: The host of the database.
 * port: The port of the database.
 * username: The username for the database.
 * password: The password for the database.
 * database: The name of the database.
 * logging: Whether to log database operations.
 * entities: Specifies to location of entity files for TypeORM.
 * migrations: Specifies the location of migration files for TypeORM.
 * synchronize: Whether to automatically synchronize the database schema. Set to false for production.
 * migrationsTableName: The name of the table to store migrations.
 * migrationsRun: Controls if migrations should be auto run on every application launch. Set to false for production.
 */
export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],
  synchronize: false,
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: false,
});
