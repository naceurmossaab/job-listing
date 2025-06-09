import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Services } from '../utils/constants';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: process.env.JWT_EXPIRES } }),
    UsersModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, RolesGuard, { provide: Services.AUTH, useClass: AuthService }],
})
export class AuthModule { }
