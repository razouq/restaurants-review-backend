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
    it('I am allowed to create a restaurant if I have owner role', async () => {
      const email = 'razouq@gmail.com';
      const password = 'razouq';

      const fakeUser = new userModel({
        email,
        password,
        role: 'owner',
      });
      await fakeUser.save();

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password });

      const restaurantBody = {
        title: 'title',
        description: 'description',
      };
      request(app.getHttpServer()).post('/api/auth/login').send(restaurantBody);
      expect(201);
    });

    it('I am NOT allowed to create a restaurant if I do NOT have owner role', async () => {
      const email = 'razouq@gmail.com';
      const password = 'razouq';

      const fakeUser = new userModel({
        email,
        password,
        role: 'user',
      });
      await fakeUser.save();

      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password });

      const restaurantBody = {
        title: 'title',
        description: 'description',
      };
      request(app.getHttpServer()).post('/api/auth/login').send(restaurantBody);
      expect(400);
    });
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });
});
