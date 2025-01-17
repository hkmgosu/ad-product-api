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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when a valid username is given', async () => {
      const user = await service.findOne('john');
      expect(user).toEqual({
        userId: 1,
        username: 'john',
        password: 'changeme',
      });
    });

    it('should return undefined when an invalid username is given', async () => {
      const user = await service.findOne('nonexistent');
      expect(user).toBeUndefined();
    });
  });
});
