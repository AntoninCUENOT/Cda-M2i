import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { redis } from '../config/redis';
import { AppError } from '../middlewares/errorHandler';
import User from '../models/User';
import { JwtPayload, UserRole } from '../types';
import { RegisterInput, LoginInput } from '../schemas/auth';

const BCRYPT_ROUNDS = 12;
const BLACKLIST_PREFIX = 'blacklist:';

function signToken(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);
}

/**
 * Crée un nouveau compte utilisateur.
 *
 * Vérifie l'unicité de l'email et du pseudo, hache le mot de passe avec bcrypt
 * (12 rounds) puis persiste l'utilisateur. Retourne un JWT signé prêt à l'emploi.
 *
 * @throws {AppError} 409 si l'email ou le pseudo est déjà utilisé
 */
export async function register(input: RegisterInput): Promise<{ token: string; userId: string }> {
  const existing = await User.findOne({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, 'Un compte existe déjà avec cet email');
  }

  const pseudoTaken = await User.findOne({ where: { pseudo: input.pseudo } });
  if (pseudoTaken) {
    throw new AppError(409, 'Ce pseudo est déjà utilisé');
  }

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await User.create({
    email: input.email,
    password: hashedPassword,
    pseudo: input.pseudo,
  });

  const token = signToken(user.id_user, user.role ?? 'USER');
  return { token, userId: user.id_user };
}

/**
 * Authentifie un utilisateur par email/mot de passe.
 *
 * Vérifie que le compte est actif et non suspendu avant de comparer le mot de
 * passe via bcrypt. En cas d'échec d'authentification, renvoie toujours le même
 * message générique (protection contre l'énumération d'emails).
 *
 * @throws {AppError} 401 si les identifiants sont incorrects
 * @throws {AppError} 403 si le compte est désactivé ou suspendu
 */
export async function login(input: LoginInput): Promise<{ token: string; userId: string }> {
  const user = await User.findOne({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, 'Email ou mot de passe incorrect');
  }

  if (!user.is_active) {
    throw new AppError(403, 'Compte désactivé');
  }

  if (user.is_suspended) {
    const until = user.suspension_end_date
      ? ` jusqu'au ${user.suspension_end_date.toLocaleDateString('fr-FR')}`
      : '';
    throw new AppError(403, `Compte suspendu${until}`);
  }

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) {
    throw new AppError(401, 'Email ou mot de passe incorrect');
  }

  const token = signToken(user.id_user, user.role ?? 'USER');
  return { token, userId: user.id_user };
}

/**
 * Invalide un JWT en l'ajoutant à la blacklist Redis.
 *
 * Le TTL Redis est calé sur le temps de vie restant du token : l'entrée
 * expire automatiquement quand le token aurait de toute façon expiré,
 * évitant ainsi toute accumulation inutile en mémoire.
 * Sans expiration valide (token déjà expiré), l'opération est sans effet.
 */
export async function logout(token: string): Promise<void> {
  const decoded = jwt.decode(token) as JwtPayload | null;
  if (!decoded?.exp) return;

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  if (ttl > 0) {
    await redis.set(`${BLACKLIST_PREFIX}${token}`, '1', 'EX', ttl);
  }
}

/**
 * Vérifie si un token figure dans la blacklist Redis.
 *
 * Utilisé par le middleware `authenticate` à chaque requête protégée,
 * avant même la vérification de la signature JWT.
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await redis.exists(`${BLACKLIST_PREFIX}${token}`);
  return result === 1;
}

/**
 * Vérifie la signature et l'expiration d'un JWT, puis retourne son payload.
 *
 * @throws {AppError} 401 si le token est invalide, malformé ou expiré
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.jwt.secret) as JwtPayload;
  } catch {
    throw new AppError(401, 'Token invalide ou expiré');
  }
}
