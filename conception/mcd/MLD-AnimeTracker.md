# MLD - Modèle Logique de Données - AnimeTracker

## Transformation du MCD en tables relationnelles

---

## Tables principales

### USER
```
USER (
  id_user UUID [PK],
  email VARCHAR(255) [UNIQUE, NOT NULL],
  password VARCHAR(255) [NOT NULL],
  pseudo VARCHAR(50) [UNIQUE, NOT NULL],
  photo VARCHAR(500),
  bio TEXT,
  role ENUM('USER', 'MODERATEUR', 'ADMIN') [DEFAULT 'USER'],
  is_active BOOLEAN [DEFAULT TRUE],
  is_suspended BOOLEAN [DEFAULT FALSE],
  suspension_end_date TIMESTAMP,
  created_at TIMESTAMP [DEFAULT NOW()],
  updated_at TIMESTAMP [DEFAULT NOW()]
)
```

### ANIME
```
ANIME (
  id_anime INTEGER [PK],
  title VARCHAR(255) [NOT NULL],
  title_english VARCHAR(255),
  synopsis TEXT,
  image_url VARCHAR(500),
  trailer_url VARCHAR(500),
  episodes INTEGER,
  score DECIMAL(3,2),
  year INTEGER,
  status VARCHAR(50),
  aired_from DATE,
  aired_to DATE,
  last_fetched_at TIMESTAMP,
  #id_studio INTEGER [FK -> STUDIO]
)
```

### GENRE
```
GENRE (
  id_genre INTEGER [PK],
  name VARCHAR(100) [UNIQUE, NOT NULL]
)
```

### STUDIO
```
STUDIO (
  id_studio INTEGER [PK],
  name VARCHAR(255) [UNIQUE, NOT NULL]
)
```

---

## Tables d'association (entités devenues tables)

### USER_ANIME (bibliothèque personnelle)
```
USER_ANIME (
  id_user_anime UUID [PK],
  #id_user UUID [FK -> USER, NOT NULL],
  #id_anime INTEGER [FK -> ANIME, NOT NULL],
  status ENUM('A_VOIR', 'EN_COURS', 'TERMINE', 'ABANDONNE') [NOT NULL],
  episodes_watched INTEGER [DEFAULT 0],
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP [DEFAULT NOW()],
  updated_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(id_user, id_anime)
)
```
**Contrainte** : Un user ne peut avoir qu'une seule entrée par anime

### REVIEW
```
REVIEW (
  id_review UUID [PK],
  #id_user UUID [FK -> USER, NOT NULL],
  #id_anime INTEGER [FK -> ANIME, NOT NULL],
  rating DECIMAL(3,1) [NOT NULL, CHECK rating >= 0 AND rating <= 10],
  comment TEXT,
  visibility ENUM('PUBLIC', 'PRIVE') [DEFAULT 'PRIVE'],
  likes_count INTEGER [DEFAULT 0],
  created_at TIMESTAMP [DEFAULT NOW()],
  updated_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(id_user, id_anime)
)
```
**Contrainte** : Un user ne peut évaluer qu'une fois un anime

### REVIEW_LIKE
```
REVIEW_LIKE (
  id_review_like UUID [PK],
  #id_review UUID [FK -> REVIEW, NOT NULL],
  #id_user UUID [FK -> USER, NOT NULL],
  created_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(id_review, id_user)
)
```
**Contrainte** : Un user ne peut liker qu'une fois une review

### FOLLOW (relation réflexive USER)
```
FOLLOW (
  id_follow UUID [PK],
  #id_follower UUID [FK -> USER, NOT NULL],
  #id_following UUID [FK -> USER, NOT NULL],
  created_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(id_follower, id_following),
  CHECK(id_follower != id_following)
)
```
**Contrainte** : Un user ne peut pas se suivre lui-même

### ANIME_GENRE (association n-n)
```
ANIME_GENRE (
  #id_anime INTEGER [FK -> ANIME, NOT NULL],
  #id_genre INTEGER [FK -> GENRE, NOT NULL],
  PRIMARY KEY (id_anime, id_genre)
)
```

---

## Messagerie privée

### CONVERSATION
```
CONVERSATION (
  id_conversation UUID [PK],
  created_at TIMESTAMP [DEFAULT NOW()],
  updated_at TIMESTAMP [DEFAULT NOW()]
)
```

### CONVERSATION_PARTICIPANT
```
CONVERSATION_PARTICIPANT (
  id_participant UUID [PK],
  #id_conversation UUID [FK -> CONVERSATION, NOT NULL],
  #id_user UUID [FK -> USER, NOT NULL],
  joined_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(id_conversation, id_user)
)
```

### MESSAGE
```
MESSAGE (
  id_message UUID [PK],
  #id_conversation UUID [FK -> CONVERSATION, NOT NULL],
  #id_sender UUID [FK -> USER, NOT NULL],
  content TEXT [NOT NULL],
  is_read BOOLEAN [DEFAULT FALSE],
  created_at TIMESTAMP [DEFAULT NOW()]
)
```

---

## Groupes de discussion

### GROUP
```
GROUP (
  id_group UUID [PK],
  name VARCHAR(255) [NOT NULL],
  description TEXT,
  type ENUM('OFFICIEL', 'PERSONNALISE') [NOT NULL],
  #id_anime INTEGER [FK -> ANIME],
  #id_creator UUID [FK -> USER, NOT NULL],
  is_public BOOLEAN [DEFAULT TRUE],
  created_at TIMESTAMP [DEFAULT NOW()],
  updated_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(type, id_anime) WHERE type = 'OFFICIEL'
)
```
**Contrainte** : Un anime ne peut avoir qu'un seul groupe officiel

### GROUP_MEMBER
```
GROUP_MEMBER (
  id_member UUID [PK],
  #id_group UUID [FK -> GROUP, NOT NULL],
  #id_user UUID [FK -> USER, NOT NULL],
  is_moderator BOOLEAN [DEFAULT FALSE],
  joined_at TIMESTAMP [DEFAULT NOW()],
  UNIQUE(id_group, id_user)
)
```

### GROUP_MESSAGE
```
GROUP_MESSAGE (
  id_group_message UUID [PK],
  #id_group UUID [FK -> GROUP, NOT NULL],
  #id_author UUID [FK -> USER, NOT NULL],
  content TEXT [NOT NULL],
  created_at TIMESTAMP [DEFAULT NOW()],
  deleted_at TIMESTAMP,
  #id_deleted_by UUID [FK -> USER]
)
```

---

## Notifications

### NOTIFICATION
```
NOTIFICATION (
  id_notification UUID [PK],
  #id_user UUID [FK -> USER, NOT NULL],
  type ENUM('NOUVEAU_FOLLOWER', 'NOUVEL_EPISODE', 'NOUVEAU_MESSAGE', 'REPONSE_GROUPE') [NOT NULL],
  title VARCHAR(255) [NOT NULL],
  message TEXT [NOT NULL],
  related_entity_id UUID,
  is_read BOOLEAN [DEFAULT FALSE],
  created_at TIMESTAMP [DEFAULT NOW()]
)
```

### NOTIFICATION_PREFERENCES
```
NOTIFICATION_PREFERENCES (
  id_preferences UUID [PK],
  #id_user UUID [FK -> USER, NOT NULL, UNIQUE],
  new_follower BOOLEAN [DEFAULT TRUE],
  new_episode BOOLEAN [DEFAULT TRUE],
  new_message BOOLEAN [DEFAULT TRUE],
  group_reply BOOLEAN [DEFAULT TRUE],
  updated_at TIMESTAMP [DEFAULT NOW()]
)
```
**Contrainte** : Relation 1-1 avec USER

---

## Modération

### REPORT
```
REPORT (
  id_report UUID [PK],
  #id_reporter UUID [FK -> USER, NOT NULL],
  reported_entity_type ENUM('REVIEW', 'MESSAGE', 'GROUP_MESSAGE') [NOT NULL],
  reported_entity_id UUID [NOT NULL],
  reason VARCHAR(255) [NOT NULL],
  description TEXT,
  status ENUM('EN_ATTENTE', 'TRAITE', 'REJETE') [DEFAULT 'EN_ATTENTE'],
  #id_reviewed_by UUID [FK -> USER],
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP [DEFAULT NOW()]
)
```

---

## Index recommandés pour les performances

### Index sur clés étrangères
```sql
-- USER_ANIME
INDEX idx_user_anime_user ON USER_ANIME(id_user)
INDEX idx_user_anime_anime ON USER_ANIME(id_anime)
INDEX idx_user_anime_status ON USER_ANIME(status)

-- REVIEW
INDEX idx_review_user ON REVIEW(id_user)
INDEX idx_review_anime ON REVIEW(id_anime)
INDEX idx_review_visibility ON REVIEW(visibility)

-- FOLLOW
INDEX idx_follow_follower ON FOLLOW(id_follower)
INDEX idx_follow_following ON FOLLOW(id_following)

-- MESSAGE
INDEX idx_message_conversation ON MESSAGE(id_conversation)
INDEX idx_message_sender ON MESSAGE(id_sender)

-- GROUP_MESSAGE
INDEX idx_group_message_group ON GROUP_MESSAGE(id_group)
INDEX idx_group_message_author ON GROUP_MESSAGE(id_author)

-- NOTIFICATION
INDEX idx_notification_user ON NOTIFICATION(id_user)
INDEX idx_notification_read ON NOTIFICATION(is_read)

-- ANIME_GENRE
INDEX idx_anime_genre_anime ON ANIME_GENRE(id_anime)
INDEX idx_anime_genre_genre ON ANIME_GENRE(id_genre)
```

### Index pour recherches
```sql
-- Recherche d'animes
INDEX idx_anime_title ON ANIME(title)
INDEX idx_anime_year ON ANIME(year)

-- Recherche d'utilisateurs
INDEX idx_user_pseudo ON USER(pseudo)
INDEX idx_user_email ON USER(email)
```

---

## Résumé du MLD

### Nombre de tables : 18

**Tables principales (entités)** :
1. USER
2. ANIME
3. GENRE
4. STUDIO
5. CONVERSATION
6. GROUP
7. NOTIFICATION_PREFERENCES

**Tables d'association** :
8. USER_ANIME
9. REVIEW
10. REVIEW_LIKE
11. FOLLOW
12. ANIME_GENRE
13. CONVERSATION_PARTICIPANT
14. MESSAGE
15. GROUP_MEMBER
16. GROUP_MESSAGE
17. NOTIFICATION
18. REPORT

---

## Dépendances fonctionnelles

### USER
- id_user → email, password, pseudo, photo, bio, role, is_active, is_suspended, suspension_end_date, created_at, updated_at

### ANIME
- id_anime → title, title_english, synopsis, image_url, trailer_url, episodes, score, year, status, aired_from, aired_to, last_fetched_at, id_studio

### USER_ANIME
- id_user_anime → id_user, id_anime, status, episodes_watched, started_at, completed_at, created_at, updated_at
- (id_user, id_anime) → id_user_anime (contrainte d'unicité)

### REVIEW
- id_review → id_user, id_anime, rating, comment, visibility, likes_count, created_at, updated_at
- (id_user, id_anime) → id_review (contrainte d'unicité)

---

## Formes normales

Le MLD respecte la **3ème forme normale (3FN)** :
- ✅ **1FN** : Tous les attributs sont atomiques
- ✅ **2FN** : Tous les attributs non-clés dépendent de la totalité de la clé primaire
- ✅ **3FN** : Aucune dépendance transitive (pas d'attribut non-clé dépendant d'un autre attribut non-clé)

**Exemple de normalisation** :
- La table USER_ANIME sépare la relation entre USER et ANIME avec ses propres attributs (status, episodes_watched)
- La table REVIEW lie USER et ANIME avec les attributs d'évaluation
- Pas de redondance : les likes_count dans REVIEW est une dénormalisation volontaire pour performance

---

**Document créé le** : 19/01/2026
**Version** : 1.0
