//@ts-nocheck
//todo fix sequelize typescript
import 'dotenv/config';
import { app, timeoutId, httpServer, io } from '../index';
import supertest from 'supertest';
import { mapOfIntervals } from '../controllers/controller';
import { Party, AuthTableOwner, AuthTableUser } from '../models/model';

describe('Integration tests', () => {
  const request = supertest(app);

  beforeEach(async () => {
    await AuthTableOwner.sync({ force: true });
    await Party.sync({ force: true });
    await AuthTableUser.sync({ force: true });
  });

  afterEach(async () => {
    httpServer.close();
    io.close();
  });

  describe('POST /users/owner', () => {
    it('Should respond with 204 when correct json', async () => {
      await request
        .post('/users/owner')
        .send({ email: 'testing@gmail.com' })
        .expect(204);
    });

    it('Should respond with 500 when the body does not have an email', async () => {
      await request.post('/users/owner').send({ bad_json: 2536 }).expect(500);
    });

    it('Should create the user in the DB', async () => {
      await createNewUser();
      const newUser = await AuthTableOwner.findOne({
        where: { user_email: 'testing@gmail.com' },
      });
      expect(newUser.user_email).toBe('testing@gmail.com');
    });
  });

  describe('POST /users/party/create', () => {
    it('Should respond with 404 when user not found', async () => {
      await request
        .post('/users/party/create')
        .send({ email: 'testing@gmail.com' })
        .expect(404);
    });

    it('Should respond with 200 when creating a party_id for the user', async () => {
      await createNewUser();
      await AuthTableOwner.findOne({
        where: { user_email: 'testing@gmail.com' },
      });
      await request
        .post('/users/party/create')
        .send({ email: 'testing@gmail.com' })
        .expect(200);
    });

    it('Should respond with 400 if user already has party_id', async () => {
      await createNewUser();
      await createParty();
      await request
        .post('/users/party/create')
        .send({ email: 'testing@gmail.com' })
        .expect(400);
    });
  });

  describe('GET /users/info/party/:email', () => {
    it('Should respond with 404 if user does not exist', async () => {
      await request.get('/users/info/party/test@gmail.com').expect(404);
    });
    it('Should respond with 204 if user does not have a party_id', async () => {
      await createNewUser();
      await request.get('/users/info/party/testing@gmail.com').expect(204);
    });
    it('Should respond with 200 if user has party_id', async () => {
      await createNewUser();
      await request
        .post('/users/party/create')
        .send({ email: 'testing@gmail.com' });

      await request.get('/users/info/party/testing@gmail.com').expect(200);
    });
  });

  async function createNewUser() {
    return request.post('/users/owner').send({ email: 'testing@gmail.com' });
  }

  async function createParty() {
    return request
      .post('/users/party/create')
      .send({ email: 'testing@gmail.com' });
  }
});
