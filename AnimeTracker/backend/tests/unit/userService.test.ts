jest.mock('../../src/models/User');
jest.mock('../../src/models/Follow');
jest.mock('../../src/models/UserAnime');
jest.mock('../../src/models/Review');
jest.mock('bcrypt');

import bcrypt from 'bcrypt';
import User from '../../src/models/User';
import Follow from '../../src/models/Follow';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  exportMyData,
  followUser,
  unfollowUser,
} from '../../src/services/userService';
import { AppError } from '../../src/middlewares/errorHandler';

const mockedUser = User as jest.Mocked<typeof User>;
const mockedFollow = Follow as jest.Mocked<typeof Follow>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const fakeUser = {
  id_user: 'uuid-123',
  email: 'test@example.com',
  password: 'hashed_pw',
  pseudo: 'testuser',
  photo: null,
  bio: null,
  role: 'USER',
  is_active: true,
  is_suspended: false,
  toJSON: jest.fn().mockReturnValue({ id_user: 'uuid-123', email: 'test@example.com', pseudo: 'testuser' }),
  update: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
};

beforeEach(() => jest.clearAllMocks());

// ==============================
// getProfile
// ==============================
describe('userService.getProfile', () => {
  it('retourne le profil sans mot de passe', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser } as never);

    const profile = await getProfile('uuid-123');

    expect(mockedUser.findByPk).toHaveBeenCalledWith('uuid-123', expect.objectContaining({
      attributes: { exclude: ['password'] },
    }));
    expect(profile).toBeDefined();
  });

  it('lève une 404 si l\'utilisateur n\'existe pas', async () => {
    mockedUser.findByPk.mockResolvedValue(null);

    await expect(getProfile('unknown-id')).rejects.toThrow(new AppError(404, 'Utilisateur introuvable'));
  });
});

// ==============================
// updateProfile
// ==============================
describe('userService.updateProfile', () => {
  it('met à jour le pseudo si disponible', async () => {
    mockedUser.findByPk.mockResolvedValueOnce({ ...fakeUser } as never);
    mockedUser.findOne.mockResolvedValue(null);
    mockedUser.findByPk.mockResolvedValueOnce({ ...fakeUser, pseudo: 'newpseudo' } as never);

    await updateProfile('uuid-123', { pseudo: 'newpseudo' });

    expect(fakeUser.update).toHaveBeenCalled();
  });

  it('rejette si le nouveau pseudo est déjà pris', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser } as never);
    mockedUser.findOne.mockResolvedValue({ ...fakeUser, pseudo: 'taken' } as never);

    await expect(
      updateProfile('uuid-123', { pseudo: 'taken' }),
    ).rejects.toThrow(new AppError(409, 'Ce pseudo est déjà utilisé'));
  });
});

// ==============================
// changePassword
// ==============================
describe('userService.changePassword', () => {
  it('change le mot de passe avec les bons identifiants', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser } as never);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedBcrypt.hash.mockResolvedValue('new_hashed_pw' as never);

    await changePassword('uuid-123', 'OldPass1', 'NewPass1');

    expect(fakeUser.update).toHaveBeenCalledWith(expect.objectContaining({ password: 'new_hashed_pw' }));
  });

  it('rejette si l\'ancien mot de passe est incorrect', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser } as never);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(
      changePassword('uuid-123', 'WrongPass', 'NewPass1'),
    ).rejects.toThrow(new AppError(401, 'Mot de passe actuel incorrect'));
  });
});

// ==============================
// deleteAccount (RGPD Art. 17)
// ==============================
describe('userService.deleteAccount', () => {
  it('supprime le compte utilisateur', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser } as never);

    await deleteAccount('uuid-123');

    expect(fakeUser.destroy).toHaveBeenCalled();
  });

  it('lève une 404 si le compte n\'existe pas', async () => {
    mockedUser.findByPk.mockResolvedValue(null);

    await expect(deleteAccount('unknown-id')).rejects.toThrow(new AppError(404, 'Utilisateur introuvable'));
  });
});

// ==============================
// exportMyData (RGPD Art. 20)
// ==============================
describe('userService.exportMyData', () => {
  it('retourne toutes les données de l\'utilisateur', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser, toJSON: () => ({ id_user: 'uuid-123' }) } as never);
    const UserAnime = require('../../src/models/UserAnime').default as jest.Mocked<{ findAll: jest.Mock }>;
    const Review = require('../../src/models/Review').default as jest.Mocked<{ findAll: jest.Mock }>;
    mockedFollow.findAll.mockResolvedValue([] as never);
    UserAnime.findAll.mockResolvedValue([] as never);
    Review.findAll.mockResolvedValue([] as never);

    const data = await exportMyData('uuid-123');

    expect(data).toHaveProperty('exported_at');
    expect(data).toHaveProperty('profile');
    expect(data).toHaveProperty('anime_list');
    expect(data).toHaveProperty('reviews');
  });
});

// ==============================
// followUser
// ==============================
describe('userService.followUser', () => {
  it('rejette si on essaie de se suivre soi-même', async () => {
    await expect(followUser('uuid-123', 'uuid-123')).rejects.toThrow(
      new AppError(400, 'Impossible de se suivre soi-même'),
    );
  });

  it('rejette si la cible n\'existe pas', async () => {
    mockedUser.findByPk.mockResolvedValue(null);

    await expect(followUser('uuid-123', 'uuid-456')).rejects.toThrow(
      new AppError(404, 'Utilisateur introuvable'),
    );
  });

  it('rejette si on suit déjà cet utilisateur', async () => {
    mockedUser.findByPk.mockResolvedValue({ ...fakeUser } as never);
    mockedFollow.findOne.mockResolvedValue({ id_follow: 'f-1' } as never);

    await expect(followUser('uuid-123', 'uuid-456')).rejects.toThrow(
      new AppError(409, 'Vous suivez déjà cet utilisateur'),
    );
  });
});

// ==============================
// unfollowUser
// ==============================
describe('userService.unfollowUser', () => {
  it('rejette si on ne suit pas cet utilisateur', async () => {
    mockedFollow.findOne.mockResolvedValue(null);

    await expect(unfollowUser('uuid-123', 'uuid-456')).rejects.toThrow(
      new AppError(404, 'Vous ne suivez pas cet utilisateur'),
    );
  });
});
