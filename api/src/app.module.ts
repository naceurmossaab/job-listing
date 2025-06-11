import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppRoutingModule } from './app-routing.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      // migrations: ['dist/migrations/*.js'],
      // migrationsRun: false,
    }),
    AppRoutingModule,
    AuthModule,
    UsersModule,
    JobsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
