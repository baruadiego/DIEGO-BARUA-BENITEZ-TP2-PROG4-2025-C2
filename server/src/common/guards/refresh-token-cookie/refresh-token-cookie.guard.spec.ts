import { RefreshTokenCookieGuard } from './refresh-token-cookie.guard';

describe('RefreshTokenCookieGuard', () => {
  it('should be defined', () => {
    expect(new RefreshTokenCookieGuard()).toBeDefined();
  });
});
