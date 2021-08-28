import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';
import { User, UserDocument } from '../src/users/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('Restaurants System', () => {
  let userModel: Model<UserDocument>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
    userModel = moduleFixture.get<Model<UserDocument>>(
      getModelToken(User.name),
    );
  });
  let app: INestApplication;

  describe('Create Restaurant', () => {
    it('I am allowed to create a restaurant if I have owner role', () => {
      console.log('test');
    });
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });
});
