import { httpExceptionFilter } from './http-exception.filter';

describe('httpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new httpExceptionFilter()).toBeDefined();
  });
});
