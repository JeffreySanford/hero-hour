import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });


  it('should create a user record correctly', async () => {
    const user = await service.create({ email: 'a@b.com', username: 'bob', password: 'pw' });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('a@b.com');
  });

  it('should find user by id/email/username', async () => {
    const user = await service.create({ email: 'find@b.com', username: 'find', password: 'pw' });
    const foundByEmail = await service.findByEmail('find@b.com');
    expect(foundByEmail).not.toBeNull();
    expect(foundByEmail?.id).toBe(user.id);
    // Add similar checks for id/username if implemented
  });

  it('should reject duplicate identity constraints', async () => {
    await service.create({ email: 'dupe@b.com', username: 'dupe', password: 'pw' });
    await expect(service.create({ email: 'dupe@b.com', username: 'dupe2', password: 'pw' })).rejects.toThrow(/duplicate/i);
  });

  it('should update safe profile fields only', async () => {
    const user = await service.create({ email: 'update@b.com', username: 'update', password: 'pw' });
    const updated = await service.update(user.id, { username: 'updated' });
    expect(updated.username).toBe('updated');
  });

  it('should prevent update of protected fields without privilege', async () => {
    const user = await service.create({ email: 'restrict@b.com', username: 'restrict', password: 'pw' });
    await expect(service.update(user.id, { email: 'hacker@b.com' })).rejects.toThrow(/not allowed|forbidden|restricted/i);
  });

  it('should soft-delete or deactivate users correctly if supported', async () => {
    // TODO: Implement soft-delete/deactivate logic and assertion
    // Example: await service.deactivateUser(id);
    // expect(...)
  });

  it('should return role information correctly if joined to auth data', async () => {
    // TODO: Implement role info join logic and assertion
    // Example: const user = await service.findById(id);
    // expect(user.roles).toContain('user');
  });
});
