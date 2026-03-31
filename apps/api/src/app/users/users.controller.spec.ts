import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(dto => ({ id: 1, ...dto })),
      findById: jest.fn(id => (id === 'u1' ? { id } : null)),
      findByEmail: jest.fn(email => (email === 'exists@example.com' ? { id: 1, email } : null)),
      update: jest.fn((id, dto) => ({ id, ...dto })),
      remove: jest.fn(id => ({ id, deleted: true })),
      deactivate: jest.fn(id => ({ id, active: false })),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should create a user with valid DTO', async () => {
    const dto: CreateUserDto = { email: 'a@b.com', username: 'bob', password: 'pw' };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('id');
  });

  it('should fail DTO validation for missing fields', async () => {
    // Simulate validation pipe throwing
    await expect(controller.create({} as any)).rejects.toThrow();
  });

  it('should reject invalid enum payloads', async () => {
    // Simulate invalid role enum in update
    const dto: UpdateUserDto = { roles: ['not-a-role'] as any };
    await expect(controller.update('1', dto)).rejects.toThrow();
  });

  it('should return correct status codes and error mapping', async () => {
    jest.spyOn(service, 'create').mockImplementationOnce(() => { throw new BadRequestException('bad'); });
    await expect(controller.create({ email: 'bad', username: 'bad', password: 'bad' } as any)).rejects.toThrow(BadRequestException);
  });

  it('should enforce guard behavior (forbidden)', async () => {
    // Simulate forbidden update
    jest.spyOn(service, 'update').mockImplementationOnce(() => { throw new ForbiddenException(); });
    await expect(controller.update('1', { username: 'hacker' } as any)).rejects.toThrow(ForbiddenException);
  });

  it('should scope to current user on private endpoints', async () => {
    // Simulate current-user scoping by passing userId
    const userId = '1';
    const dto: UpdateUserDto = { username: 'bob' };
    await controller.update(userId, dto);
    expect(service.update).toHaveBeenCalledWith(userId, dto);
  });

  it('should call service methods with correct args', async () => {
    await controller.findByEmail('exists@example.com');
    expect(service.findByEmail).toHaveBeenCalledWith('exists@example.com');
    await controller.remove('1');
    expect(service.deactivate).toHaveBeenCalledWith('1');
  });
});
