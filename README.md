# AnimeTracker — Projet CDA

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
git clone https://github.com/AntoninCUENOT/Cda-M2i.git
cd Cda-M2i
```

---

### Étape 2 — Configurer les variables d'environnement

```bash
cd AnimeTracker
cp .env.dev .env
```

Ouvre le fichier `.env` et vérifie les valeurs. Les valeurs par défaut fonctionnent pour un environnement local.

> **Important :** Sur émulateur Android, l'URL de l'API est `http://10.0.2.2:3000/api` (pas `localhost`).  
> Sur téléphone physique, remplace par l'IP locale de la machine : `http://192.168.x.x:3000/api`.

---

### Étape 3 — Démarrer la base de données et Redis

```bash
# Depuis le dossier AnimeTracker/
docker compose up -d
```

PostgreSQL et Redis démarrent. La base de données est **initialisée automatiquement** (tables, ENUM, contraintes) via `docker/postgres/init.sql` au premier lancement.

Attends que les healthchecks passent (~15 secondes) :

```bash
docker ps
# STATUS doit afficher "healthy" pour postgres et redis
```

---

### Étape 4 — Démarrer le backend

```bash
cd AnimeTracker/backend
npm install
npm run dev
# Serveur démarré sur http://localhost:3000
```

Vérifie que ça fonctionne :
```bash
curl http://localhost:3000/api/health
# {"success":true,"data":{"status":"ok"}}
```

---

### Étape 5 — Démarrer le frontend Expo

```bash
# Depuis AnimeTracker/ (pas backend/)
cd ..
npm install
npx expo start
```

- **Émulateur Android** : appuie sur `a`
- **Téléphone physique** : scanne le QR code avec l'app Expo Go

---

## Lancer les tests

```bash
cd AnimeTracker/backend
npm test
# 38 tests, 0 failed
```

---

## Arrêter les services

```bash
# Arrêter Docker
docker compose stop

# Pour tout supprimer (données incluses)
docker compose down -v
```

---

## Structure du projet

```
Cda-M2i/
├── AnimeTracker/               # Code source principal
│   ├── src/                    # Frontend React Native
│   │   ├── screens/            # Écrans de l'app
│   │   ├── store/slices/       # Redux slices
│   │   ├── services/           # apiClient + jikanApi
│   │   ├── navigation/         # React Navigation
│   │   └── contexts/           # ThemeContext
│   ├── backend/                # API REST Node.js
│   │   ├── src/
│   │   │   ├── controllers/    # Gestion HTTP
│   │   │   ├── services/       # Logique métier
│   │   │   ├── models/         # Modèles Sequelize
│   │   │   ├── routes/         # Endpoints API
│   │   │   ├── middlewares/    # Auth JWT, erreurs
│   │   │   └── schemas/        # Validation Zod
│   │   └── tests/              # Tests Jest
│   ├── docker/postgres/init.sql  # Init BDD automatique
│   ├── docker-compose.yml
│   └── .env.dev                # Template variables d'env
├── documentation/              # Dossier CDA (DOCX, MD)
├── maquettes/                  # Wireframes, charte graphique
├── scripts-docx/               # Scripts génération dossier
└── conception/                 # MCD, MLD, diagrammes UML
```

---

## Ports utilisés

| Service | Port hôte | Port conteneur |
|---------|-----------|----------------|
| Backend Node.js | 3000 | 3000 |
| PostgreSQL | **5433** | 5432 |
| Redis | 6380 | 6379 |

> PostgreSQL est sur le port **5433** (pas 5432) pour éviter les conflits avec une installation native éventuelle.

---

## Problème courant — Windows + Docker

Sur Windows, le hot-reload de nodemon ne fonctionne pas depuis le conteneur (problème inotify). Lance le backend **directement sur la machine hôte** (`npm run dev` dans `backend/`) plutôt qu'en conteneur.

---

*AnimeTracker v1.0.0 — CDA Mai 2026*
