import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';
import { User, UserDocument } from '../src/users/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('Authentication System', () => {
  let userModel: Model<UserDocument>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.init();
    userModel = moduleFixture.get<Model<UserDocument>>(
      getModelToken(User.name),
    );
  });
  let app: INestApplication;
  describe('Register', () => {
    it('I am allowed to register using an email and password', async () => {
      const email1 = 'razouq@gmail.com';
      const password = 'razouq';
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1, password })
        .expect(201)
        .then((res) => {
          const { _id, email, role } = res.body;
          expect(_id).toBeDefined();
          expect(email).toEqual(email1);
          expect(role).toEqual('user');
        });
    });

    it('I am NOT allowed to register using only the password', async () => {
      const password = 'razouq';
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ password })
        .expect(400);
    });

    it('I am NOT allowed register without password', async () => {
      const email1 = 'razouq@gmail.com';
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1 })
        .expect(400);
    });

    it('I am NOT allowed register with a wrong email', async () => {
      // email contains a space
      const email1 = 'razouq@gmail .com';
      const password = 'razouq';
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1, password })
        .expect(400);
    });

    it('I am NOT allowed to register with a wrong email', async () => {
      // email contains a space
      const email1 = 'razouq@gmail .com';
      const password = 'razouq';
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1, password })
        .expect(400);

      const { message } = res.body;
      expect(message[0]).toEqual('email must be an email');
    });

    it('I am NOT allowed to register with a used email', async () => {
      const email1 = 'razouq@gmail.com';
      const password = 'razouq';

      // Create a FAKE user with email1
      const fakeUser = new userModel({
        email: email1,
        password,
      });
      await fakeUser.save();

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1, password })
        .expect(400);

      const { message } = res.body;
      expect(message).toEqual('email in use');
    });
  });

  describe('Login', () => {
    it('I am allowed to login if I have the right email and password', async () => {
      const email1 = 'razouq@gmail.com';
      const password = 'razouq';

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1, password });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: email1, password });

      const { message } = res.body;
      console.log(res.body);

      expect(message).toEqual('success');
    });

    it('I am NOT allowed to login if I do NOT have the right password', async () => {
      const email1 = 'razouq@gmail.com';
      const password = 'razouq';

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: email1, password });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: email1, password: 'not razouq' })
        .expect(401);
    });
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });
});
