import request from 'supertest';

// Factory mocks — empêchent l'exécution du code d'initialisation Sequelize
jest.mock('../../src/config/database', () => ({
  sequelize: { authenticate: jest.fn(), query: jest.fn() },
  connectDatabase: jest.fn(),
}));
jest.mock('../../src/config/redis', () => ({
  redis: { set: jest.fn(), exists: jest.fn(), get: jest.fn(), connect: jest.fn(), on: jest.fn() },
  connectRedis: jest.fn(),
}));
jest.mock('../../src/models/User', () => ({
  default: { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn(), findAll: jest.fn() },
}));
jest.mock('../../src/models/Anime', () => ({
  default: { findByPk: jest.fn(), findAll: jest.fn(), upsert: jest.fn(), findAndCountAll: jest.fn() },
}));
jest.mock('../../src/models/UserAnime', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findAndCountAll: jest.fn(), count: jest.fn() },
}));
jest.mock('../../src/models/Review', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn(), findAndCountAll: jest.fn() },
}));
jest.mock('../../src/models/Follow', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), destroy: jest.fn() },
}));
jest.mock('../../src/models/Conversation', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
}));
jest.mock('../../src/models/ConversationParticipant', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn(), update: jest.fn() },
}));
jest.mock('../../src/models/Message', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
}));
jest.mock('../../src/models/Group', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
}));
jest.mock('../../src/models/GroupMember', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn(), destroy: jest.fn() },
}));
jest.mock('../../src/models/GroupMessage', () => ({
  default: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
}));
jest.mock('../../src/models/associations', () => ({ defineAssociations: jest.fn() }));

// Factory mock pour authService — contrôle total sur les retours
jest.mock('../../src/services/authService', () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  isTokenBlacklisted: jest.fn(),
  verifyToken: jest.fn(),
}));

import app from '../../src/app';
import * as authService from '../../src/services/authService';
import { AppError } from '../../src/middlewares/errorHandler';

const mockedAuth = authService as jest.Mocked<typeof authService>;

beforeEach(() => jest.clearAllMocks());

// ==============================
// POST /api/auth/register
// ==============================
describe('POST /api/auth/register', () => {
  it('201 — inscription réussie', async () => {
    mockedAuth.register.mockResolvedValue({ token: 'jwt_token', userId: 'uuid-123' });

    const res = await request(app).post('/api/auth/register').send({
      email: 'user@example.com',
      password: 'Pass1234',
      pseudo: 'newuser',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token', 'jwt_token');
  });

  it('409 — email déjà utilisé', async () => {
    mockedAuth.register.mockRejectedValue(new AppError(409, 'Un compte existe déjà avec cet email'));

    const res = await request(app).post('/api/auth/register').send({
      email: 'existing@example.com',
      password: 'Pass1234',
      pseudo: 'user2',
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('email');
  });

  it('400 — email invalide (Zod)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: 'Pass1234',
      pseudo: 'user',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('400 — mot de passe sans majuscule (Zod)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'user@example.com',
      password: 'pass1234',
      pseudo: 'user',
    });

    expect(res.status).toBe(400);
    expect(res.body.errors['body.password']).toBeDefined();
  });
});

// ==============================
// POST /api/auth/login
// ==============================
describe('POST /api/auth/login', () => {
  it('200 — connexion réussie', async () => {
    mockedAuth.login.mockResolvedValue({ token: 'jwt_token', userId: 'uuid-123' });

    const res = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'Pass1234',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token', 'jwt_token');
  });

  it('401 — identifiants incorrects', async () => {
    mockedAuth.login.mockRejectedValue(new AppError(401, 'Email ou mot de passe incorrect'));

    const res = await request(app).post('/api/auth/login').send({
      email: 'user@example.com',
      password: 'WrongPass',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('400 — body vide', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

// ==============================
// GET /api/auth/me
// ==============================
describe('GET /api/auth/me', () => {
  it('401 — sans Authorization header', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('Token');
  });

  it('401 — token blacklisté', async () => {
    mockedAuth.isTokenBlacklisted.mockResolvedValue(true);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer blacklisted_token');

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('révoqué');
  });

  it('200 — token valide retourne userId et role', async () => {
    mockedAuth.isTokenBlacklisted.mockResolvedValue(false);
    mockedAuth.verifyToken.mockReturnValue({ userId: 'uuid-123', role: 'USER' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid_token');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ userId: 'uuid-123', role: 'USER' });
  });
});

// ==============================
// GET /api/health
// ==============================
describe('GET /api/health', () => {
  it('200 — status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data).toHaveProperty('timestamp');
  });
});
