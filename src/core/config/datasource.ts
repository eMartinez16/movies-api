import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const options: DataSourceOptions = {
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST', 'mysql.railway.internal'),
  port: configService.get<number>('DATABASE_PORT', 3306),
  username: configService.get<string>('DATABASE_USERNAME', 'root'),
  password: configService.get<string>('DATABASE_PASSWORD', 'root'),
  database: configService.get<string>('DATABASE_NAME', 'movie_api'),
  entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../../**/migrations/*{.ts,.js}`],
  synchronize: false,
};

export default new DataSource(options);
