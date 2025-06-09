import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Services } from '../utils/constants';
import { IUserService } from '../users/users.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) { }

  async validate(email: string, password: string): Promise<User> {
    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.findByLogin(email);
      if (!user) throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);

    return user;
  }

  login(user: any) {
    const { id, login, email, role } = user;
    const payload = { id, login, email, role };

    return {
      ...payload,
      token: this.jwtService.sign(payload),
    }
  }

  async validateToken(token: string): Promise<any> {
    const decoded: any = this.jwtService.verify(token);
    const user = await this.userService.findOne(decoded.id);
    if (!user) return null;
    const { id, login, email, role } = user;
    return { id, login, email, role, token };
  }
}
