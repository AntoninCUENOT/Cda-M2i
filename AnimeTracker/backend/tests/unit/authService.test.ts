import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mocks avant tout import du code source
jest.mock('../../src/models/User');
jest.mock('../../src/config/redis', () => ({
  redis: {
    set: jest.fn().mockResolvedValue('OK'),
    exists: jest.fn().mockResolvedValue(0),
    connect: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

import User from '../../src/models/User';
import { redis } from '../../src/config/redis';
import {
  register,
  login,
  logout,
  isTokenBlacklisted,
  verifyToken,
} from '../../src/services/authService';
import { AppError } from '../../src/middlewares/errorHandler';

const mockedUser = User as jest.Mocked<typeof User>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

const fakeUser = {
  id_user: 'uuid-123',
  email: 'test@example.com',
  password: 'hashed_password',
  pseudo: 'testuser',
  role: 'USER' as const,
  is_active: true,
  is_suspended: false,
  suspension_end_date: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ==============================
// register
// ==============================
describe('authService.register', () => {
  it('crée un compte et retourne un token', async () => {
    mockedUser.findOne.mockResolvedValue(null);
    mockedBcrypt.hash.mockResolvedValue('hashed_pw' as never);
    mockedUser.create.mockResolvedValue({ ...fakeUser } as never);
    mockedJwt.sign.mockReturnValue('jwt_token' as never);

    const result = await register({ email: 'test@example.com', password: 'Pass1234', pseudo: 'testuser' });

    expect(result).toHaveProperty('token', 'jwt_token');
    expect(result).toHaveProperty('userId', 'uuid-123');
    expect(mockedBcrypt.hash).toHaveBeenCalledWith('Pass1234', 12);
  });

  it('rejette si l\'email est déjà utilisé', async () => {
    mockedUser.findOne.mockResolvedValueOnce({ ...fakeUser } as never);

    await expect(
      register({ email: 'test@example.com', password: 'Pass1234', pseudo: 'testuser' }),
    ).rejects.toThrow(new AppError(409, 'Un compte existe déjà avec cet email'));
  });

  it('rejette si le pseudo est déjà utilisé', async () => {
    mockedUser.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ ...fakeUser } as never);

    await expect(
      register({ email: 'new@example.com', password: 'Pass1234', pseudo: 'testuser' }),
    ).rejects.toThrow(new AppError(409, 'Ce pseudo est déjà utilisé'));
  });
});

// ==============================
// login
// ==============================
describe('authService.login', () => {
  it('retourne un token avec des identifiants valides', async () => {
    mockedUser.findOne.mockResolvedValue({ ...fakeUser } as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedJwt.sign.mockReturnValue('jwt_token' as never);

    const result = await login({ email: 'test@example.com', password: 'Pass1234' });

    expect(result).toHaveProperty('token', 'jwt_token');
    expect(result).toHaveProperty('userId', 'uuid-123');
  });

  it('rejette si l\'utilisateur n\'existe pas', async () => {
    mockedUser.findOne.mockResolvedValue(null);

    await expect(
      login({ email: 'unknown@example.com', password: 'Pass1234' }),
    ).rejects.toThrow(new AppError(401, 'Email ou mot de passe incorrect'));
  });

  it('rejette si le mot de passe est incorrect', async () => {
    mockedUser.findOne.mockResolvedValue({ ...fakeUser } as never);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(
      login({ email: 'test@example.com', password: 'WrongPass' }),
    ).rejects.toThrow(new AppError(401, 'Email ou mot de passe incorrect'));
  });

  it('rejette si le compte est désactivé', async () => {
    mockedUser.findOne.mockResolvedValue({ ...fakeUser, is_active: false } as never);

    await expect(
      login({ email: 'test@example.com', password: 'Pass1234' }),
    ).rejects.toThrow(new AppError(403, 'Compte désactivé'));
  });

  it('rejette si le compte est suspendu', async () => {
    mockedUser.findOne.mockResolvedValue({
      ...fakeUser,
      is_suspended: true,
      suspension_end_date: new Date('2099-01-01'),
    } as never);

    await expect(
      login({ email: 'test@example.com', password: 'Pass1234' }),
    ).rejects.toThrow(AppError);
  });
});

// ==============================
// logout + blacklist
// ==============================
describe('authService.logout', () => {
  it('ajoute le token à la blacklist Redis avec un TTL', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    mockedJwt.decode.mockReturnValue({ userId: 'uuid-123', role: 'USER', exp: futureExp });

    await logout('valid_token');

    expect(mockedRedis.set).toHaveBeenCalledWith(
      'blacklist:valid_token',
      '1',
      'EX',
      expect.any(Number),
    );
  });

  it('ne fait rien si le token est déjà expiré', async () => {
    mockedJwt.decode.mockReturnValue({ userId: 'uuid-123', role: 'USER', exp: 0 });

    await logout('expired_token');

    expect(mockedRedis.set).not.toHaveBeenCalled();
  });
});

describe('authService.isTokenBlacklisted', () => {
  it('retourne true si le token est blacklisté', async () => {
    mockedRedis.exists.mockResolvedValue(1);
    const result = await isTokenBlacklisted('some_token');
    expect(result).toBe(true);
  });

  it('retourne false si le token n\'est pas blacklisté', async () => {
    mockedRedis.exists.mockResolvedValue(0);
    const result = await isTokenBlacklisted('valid_token');
    expect(result).toBe(false);
  });
});

// ==============================
// verifyToken
// ==============================
describe('authService.verifyToken', () => {
  it('retourne le payload si le token est valide', () => {
    mockedJwt.verify.mockReturnValue({ userId: 'uuid-123', role: 'USER' } as never);

    const payload = verifyToken('valid_token');

    expect(payload).toEqual({ userId: 'uuid-123', role: 'USER' });
  });

  it('lève une AppError si le token est invalide', () => {
    mockedJwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    expect(() => verifyToken('bad_token')).toThrow(new AppError(401, 'Token invalide ou expiré'));
  });
});
