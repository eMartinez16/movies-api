import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenValidationMiddleware } from './middleware/token-validation.middleware';
import { RolesGuard } from './core/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { FilmsModule } from './films/films.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('DATABASE_HOST', 'mysql.railway.internal'),
          port: config.get<number>('DATABASE_PORT', 3306),
          username: config.get<string>('DATABASE_USERNAME', 'root'),
          password: config.get<string>('DATABASE_PASSWORD', 'root'),
          database: config.get<string>('DATABASE_NAME', 'movie_api'),
          autoLoadEntities: true,
          synchronize: false,
          entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          migrations: [`${__dirname}/**/migrations/*{.ts,.js}`],
        };
      },
    }),
    UserModule,
    FilmsModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    // { 
    //   useClass: RolesGuard, 
    //   provide: APP_GUARD
    // }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .forRoutes({ path: "**", method: RequestMethod.ALL })
  }
}
