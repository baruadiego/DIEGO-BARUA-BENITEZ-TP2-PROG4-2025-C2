import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie/auth-cookie.guard';

const ACCESS_TOKEN_TIME = 15 * 60 * 1000; // 15 minutos

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseGuards(AuthCookieGuard)
  @HttpCode(200)
  async isAuthenticated(@Res({ passthrough: true }) res: Response) {
    return { message: 'Authenticated' };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, accessToken } = await this.authService.login(loginUserDto);

    this.setJwt(res, accessToken, ACCESS_TOKEN_TIME);
    return { data: data, statusCode: 200 };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.authService.register(createUserDto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthCookieGuard)
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    res.clearCookie('accessToken');
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @UseGuards(AuthCookieGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = (req as any).user['id'];

    const newAccessToken = await this.authService.refreshToken(id);

    this.setJwt(res, newAccessToken, ACCESS_TOKEN_TIME);

    return { message: 'Refresh successful' };
  }

  private setJwt(res: Response, token: string, time: number) {
    const isProd = process.env.ENVIRONMENT === 'production';

    res.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'strict',
      secure: isProd,
      expires: new Date(Date.now() + time),
    });
  }
}
