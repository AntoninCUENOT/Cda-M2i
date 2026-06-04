# AnimeTracker — Projet CDA

[![CI](https://github.com/AntoninCUENOT/AnimeTracker-CDA/actions/workflows/ci.yml/badge.svg)](https://github.com/AntoninCUENOT/AnimeTracker-CDA/actions/workflows/ci.yml)

Application mobile de suivi d'animés développée par **Antonin CUENOT** dans le cadre du titre professionnel **Concepteur Développeur d'Applications (CDA)**.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend mobile | React Native + Expo + TypeScript |
| Backend API | Node.js + Express + TypeScript |
| Base de données | PostgreSQL 15 (Docker) |
| Cache / Auth | Redis 7 (Docker) |
| ORM | Sequelize |
| Validation | Zod |
| Tests | Jest + Supertest |

---

## Installation sur une nouvelle machine

### Prérequis

- [Node.js 20+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Expo Go](https://expo.dev/go) sur téléphone OU émulateur Android (Android Studio)
- Git

---

### Étape 1 — Cloner le projet

```bash
git clone https://github.com/AntoninCUENOT/AnimeTracker-CDA.git
cd AnimeTracker-CDA
```

---

### Étape 2 — Configurer les variables d'environnement

```bash
cp .env.dev .env
cp backend/.env.example backend/.env  # ou copier manuellement
```

> **Important :** Sur émulateur Android, l'URL de l'API est `http://10.0.2.2:3000/api`.  
> Sur téléphone physique, remplace par l'IP locale : `http://192.168.x.x:3000/api`.

---

### Étape 3 — Démarrer la base de données et Redis

```bash
docker compose up -d
```

PostgreSQL et Redis démarrent. La base est **initialisée automatiquement** via `docker/postgres/init.sql`.

```bash
docker ps
# STATUS doit afficher "healthy" pour postgres et redis
```

---

### Étape 4 — Démarrer le backend

```bash
cd backend
npm install
npm run dev
# Serveur démarré sur http://localhost:3000
```

---

### Étape 5 — Démarrer le frontend Expo

```bash
cd ..
npm install
npx expo start
```

- **Émulateur Android** : appuie sur `a`
- **Téléphone physique** : scanne le QR code avec Expo Go

---

## Lancer les tests

```bash
cd backend
npm test
# 38 tests, 0 failed
```

---

## Structure du projet

```
AnimeTracker-CDA/
├── src/                    # Frontend React Native
│   ├── screens/            # Écrans de l'app
│   ├── store/slices/       # Redux slices (8 slices)
│   ├── services/           # apiClient + jikanApi
│   ├── navigation/         # React Navigation
│   └── contexts/           # ThemeContext
├── backend/                # API REST Node.js
│   ├── src/
│   │   ├── controllers/    # Gestion HTTP
│   │   ├── services/       # Logique métier
│   │   ├── models/         # Modèles Sequelize
│   │   ├── routes/         # 54 endpoints API
│   │   ├── middlewares/    # Auth JWT, erreurs
│   │   └── schemas/        # Validation Zod
│   └── tests/              # Tests Jest
├── docker/postgres/init.sql  # Init BDD automatique
├── docker-compose.yml
└── .env.dev                  # Template variables d'env

```

---

## Ports utilisés

| Service | Port hôte | Port conteneur |
|---------|-----------|----------------|
| Backend Node.js | 3000 | 3000 |
| PostgreSQL | **5433** | 5432 |
| Redis | 6379 | 6379 |

---

*AnimeTracker v1.0.0 — CDA Juin 2026*
