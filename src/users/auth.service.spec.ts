import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (signInUserDto: SignInUserDto) =>
        Promise.resolve({
          id: 1,
          email: signInUserDto.email,
          password: signInUserDto.password,
        }),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // create instance of authService with
    // all dependencies already initialized
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    // create a fake copy of user service

    expect(service).toBeDefined();
  });
});
