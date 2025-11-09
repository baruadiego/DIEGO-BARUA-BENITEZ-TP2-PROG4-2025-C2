import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export 
class AuthCookieGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies['accessToken'] as string;
    
    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }
    
    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'defaultSecret');
      request.user = decoded;
      return true;
    } catch (err) {
      throw err;
    }
    
  }
}
