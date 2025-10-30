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
import { RefreshTokenCookieGuard } from 'src/common/guards/refresh-token-cookie/refresh-token-cookie.guard';

const ACCESS_TOKEN_TIME = 15 * 60 * 1000; // 15 minutos
const REFRESH_TOKEN_TIME = 7 * 24 * 60 * 60 * 1000; // 7 días

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
    const { data, accessToken, refreshToken } = await this.authService.login(loginUserDto);

    this.setJwtCookies(res, accessToken, refreshToken);
    return { data: data, statusCode: 200 };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearCookies(res);
    const { data, accessToken, refreshToken } = await this.authService.register(createUserDto);

    this.setJwtCookies(res, accessToken, refreshToken);
    return { data };
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthCookieGuard)
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const id = (req as any).user['id'];
    this.clearCookies(res);
    await this.authService.deleteRefreshToken(id);

    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenCookieGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = (req as any).user['id'];
    const refreshToken = req.cookies['refreshToken'] as string;

    const newAccessToken = await this.authService.refreshToken(
      id,
      refreshToken,
    );

    this.setJwtCookie(res, newAccessToken, 'accessToken', ACCESS_TOKEN_TIME);

    return { message: 'Refresh successful' };
  }

  private setJwtCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    this.setJwtCookie(res, accessToken, 'accessToken', ACCESS_TOKEN_TIME);
    this.setJwtCookie(res, refreshToken, 'refreshToken', REFRESH_TOKEN_TIME);
  }
  private setJwtCookie(
    res: Response,
    token: string,
    cookieName: 'accessToken' | 'refreshToken',
    time: number,
  ) {
    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: 'none',
      secure: false,
      expires: new Date(Date.now() + time),
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
