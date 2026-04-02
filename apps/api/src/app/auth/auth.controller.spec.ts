import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const mockService = {
      register: jest.fn((dto) => ({ id: 1, ...dto, password: 'hashed' })),
      login: jest.fn(() => ({ accessToken: 'token', refreshToken: 'refresh' })),
      refresh: jest.fn(() => ({ accessToken: 'newtoken', refreshToken: 'newrefresh' })),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should register a user and hash password', async () => {
    const dto: RegisterDto = { email: 'a@b.com', password: 'secret123', username: 'bob' };
    const result = await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result.password).toBe('hashed');
  });

  it('should login and return tokens', async () => {
    const dto: LoginDto = { email: 'a@b.com', password: 'secret123' };
    const result = await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should refresh tokens', async () => {
    const dto: RefreshTokenDto = { refreshToken: 'refresh' };
    const result = await controller.refresh(dto);
    expect(service.refresh).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should logout with or without token header', async () => {
    const noTokenResult = await controller.logout({ headers: {} });
    expect(noTokenResult).toEqual({ success: true });

    const withToken = await controller.logout({ headers: { authorization: 'Bearer example' } });
    expect(service.logout).toHaveBeenCalledWith('example');
    expect(withToken).toEqual({ success: true });
  });

  it('should throw BadRequestException on register error', async () => {
    jest.spyOn(service, 'register').mockImplementationOnce(() => { throw new Error('fail'); });
    const dto: RegisterDto = { email: 'bad@b.com', password: 'fail', username: 'fail' };
    await expect(controller.register(dto)).rejects.toThrow('fail');
  });
});
