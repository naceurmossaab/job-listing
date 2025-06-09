import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { IAuthService } from '../auth.interface';
import { Services } from 'src/utils/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validate(email, password);
    if (!user) throw new HttpException("invalid credentials", HttpStatus.BAD_REQUEST);

    return user;
  }
}