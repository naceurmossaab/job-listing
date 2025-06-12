import { Body, Req, Controller, HttpException, Inject, Post, Get, UseFilters, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { Services } from '../utils/constants';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { IUserService } from '../users/users.interface';
import { IAuthService } from './auth.interface';
import { CreateUserDto } from '../users/dtos';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags()
@UseFilters(new HttpExceptionFilter())
@Controller()
export class AuthController {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
    @Inject(Services.AUTH) private readonly authService: IAuthService
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      throw new HttpException(error.detail || error.message, 400);
    }
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('me')
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  async getLoggedInUser(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new HttpException('No token provided', HttpStatus.FORBIDDEN);

    const user = await this.authService.validateToken(token);
    if (!user) throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);

    return user;
  }
}
