# Modèle de Classes - AnimeTracker

## Vue d'ensemble

Ce document décrit le modèle objet de l'application AnimeTracker.

---

## Classes principales

### 1. User (Utilisateur)

Représente un utilisateur de l'application.

**Attributs :**
- `id` : Identifiant unique (UUID)
- `email` : Email unique pour connexion
- `password` : Mot de passe hashé (bcrypt)
- `pseudo` : Nom d'affichage unique
- `photo` : URL de la photo de profil
- `bio` : Biographie (max 500 caractères)
- `role` : Rôle (USER, MODERATEUR, ADMIN)
- `isActive` : Compte activé ou non
- `isSuspended` : Compte suspendu temporairement
- `suspensionEndDate` : Date de fin de suspension
- `createdAt` : Date de création du compte
- `updatedAt` : Dernière mise à jour

**Méthodes principales :**
- `register()` : Inscription
- `login()` : Connexion (retourne token JWT)
- `logout()` : Déconnexion
- `updateProfile()` : Modification du profil
- `deleteAccount()` : Suppression RGPD
- `follow(user)` : Suivre un utilisateur
- `unfollow(user)` : Ne plus suivre
- `getStatistics()` : Obtenir les statistiques

**Relations :**
- Possède plusieurs UserAnime (bibliothèque)
- Écrit plusieurs Review
- Like plusieurs Review
- Suit/est suivi par d'autres User (Follow)
- Participe à plusieurs Conversation
- Membre de plusieurs Group
- Reçoit plusieurs Notification
- A 1 NotificationPreferences

---

### 2. Anime

Cache local des informations d'animes provenant de Jikan API.

**Attributs :**
- `id` : ID MyAnimeList (Integer, pas UUID)
- `title` : Titre original (japonais/romaji)
- `titleEnglish` : Titre anglais
- `synopsis` : Résumé de l'anime
- `imageUrl` : URL de l'image principale
- `trailerUrl` : URL du trailer YouTube
- `episodes` : Nombre d'épisodes total
- `score` : Score MyAnimeList (0-10)
- `year` : Année de sortie
- `status` : Statut (Finished Airing, Currently Airing, etc.)
- `airedFrom` / `airedTo` : Dates de diffusion
- `lastFetchedAt` : Dernière synchro avec API

**Méthodes :**
- `fetchFromJikanAPI()` : Récupérer les données depuis l'API
- `updateFromAPI()` : Mettre à jour les données
- `getOfficialGroup()` : Obtenir le groupe officiel de discussion

**Relations :**
- Suivi par plusieurs User via UserAnime
- Évalué par plusieurs Review
- Appartient à plusieurs Genre
- Produit par un Studio
- A un Group officiel (créé automatiquement)

---

### 3. UserAnime

Table de liaison entre User et Anime, représente un anime dans la bibliothèque d'un utilisateur.

**Attributs :**
- `id` : UUID
- `userId` : Référence vers User
- `animeId` : Référence vers Anime
- `status` : Statut (A_VOIR, EN_COURS, TERMINE, ABANDONNE)
- `episodesWatched` : Nombre d'épisodes visionnés
- `startedAt` : Date de début de visionnage
- `completedAt` : Date de fin de visionnage
- `createdAt` / `updatedAt` : Horodatage

**Méthodes :**
- `updateStatus(status)` : Changer le statut
- `updateProgress(episodes)` : Mettre à jour la progression
- `getProgress()` : Calculer le % de progression

**Contraintes :**
- Un utilisateur ne peut avoir qu'une seule entrée par anime
- `episodesWatched` <= `anime.episodes`

---

### 4. Review

Représente une note et un commentaire sur un anime.

**Attributs :**
- `id` : UUID
- `userId` : Auteur de la review
- `animeId` : Anime évalué
- `rating` : Note (0 à 10 par pas de 0.5)
- `comment` : Texte du commentaire (max 2000 caractères)
- `visibility` : PUBLIC ou PRIVE
- `likesCount` : Nombre de likes (dénormalisé pour performance)
- `createdAt` / `updatedAt` : Horodatage

**Méthodes :**
- `create()` : Créer une review
- `update()` : Modifier
- `delete()` : Supprimer
- `toggleVisibility()` : Changer public/privé
- `addLike(user)` : Ajouter un like
- `removeLike(user)` : Retirer un like

**Contraintes :**
- Un utilisateur ne peut avoir qu'une seule review par anime
- Le rating doit être entre 0 et 10 avec paliers de 0.5
- Seules les reviews publiques peuvent être likées

---

### 5. ReviewLike

Table de liaison pour les likes sur les reviews.

**Attributs :**
- `id` : UUID
- `reviewId` : Review likée
- `userId` : Utilisateur qui like
- `createdAt` : Date du like

**Contraintes :**
- Un utilisateur ne peut liker qu'une seule fois une review
- On ne peut pas liker sa propre review

---

### 6. Follow

Relation de suivi entre utilisateurs.

**Attributs :**
- `id` : UUID
- `followerId` : Utilisateur qui suit
- `followingId` : Utilisateur suivi
- `createdAt` : Date du suivi

**Contraintes :**
- Un utilisateur ne peut pas se suivre lui-même
- Pas de doublon (followerId + followingId unique)

---

### 7. Conversation

Représente une conversation privée entre utilisateurs.

**Attributs :**
- `id` : UUID
- `createdAt` : Date de création
- `updatedAt` : Dernière mise à jour (nouveau message)

**Méthodes :**
- `getParticipants()` : Liste des participants
- `getLastMessage()` : Dernier message envoyé

**Relations :**
- A plusieurs ConversationParticipant (2 minimum)
- Contient plusieurs Message

---

### 8. ConversationParticipant

Table de liaison entre Conversation et User.

**Attributs :**
- `id` : UUID
- `conversationId` : Conversation
- `userId` : Participant
- `joinedAt` : Date d'ajout

---

### 9. Message

Message dans une conversation privée.

**Attributs :**
- `id` : UUID
- `conversationId` : Conversation parente
- `senderId` : Expéditeur
- `content` : Contenu du message (max 1000 caractères)
- `isRead` : Lu ou non
- `createdAt` : Date d'envoi

**Méthodes :**
- `send()` : Envoyer le message
- `markAsRead()` : Marquer comme lu

---

### 10. Group

Groupe de discussion (officiel ou personnalisé).

**Attributs :**
- `id` : UUID
- `name` : Nom du groupe
- `description` : Description
- `type` : OFFICIEL ou PERSONNALISE
- `animeId` : Anime lié (pour groupes officiels et perso liés à un anime)
- `creatorId` : Créateur du groupe
- `isPublic` : Public (tout le monde peut rejoindre) ou privé (sur invitation)
- `createdAt` / `updatedAt` : Horodatage

**Méthodes :**
- `create()` : Créer un groupe
- `delete()` : Supprimer (uniquement PERSONNALISE)
- `addMember(user)` : Ajouter un membre
- `removeMember(user)` : Retirer un membre
- `addModerator(user)` : Promouvoir en modérateur
- `removeModerator(user)` : Révoquer modérateur

**Contraintes :**
- Les groupes OFFICIEL ne peuvent pas être supprimés
- Le créateur est automatiquement modérateur
- Nom unique par type et animeId

---

### 11. GroupMember

Table de liaison entre Group et User.

**Attributs :**
- `id` : UUID
- `groupId` : Groupe
- `userId` : Membre
- `isModerator` : Est modérateur du groupe
- `joinedAt` : Date d'adhésion

**Contraintes :**
- Le créateur du groupe est toujours membre et modérateur
- Pas de doublon (groupId + userId unique)

---

### 12. GroupMessage

Message dans un groupe de discussion.

**Attributs :**
- `id` : UUID
- `groupId` : Groupe parent
- `authorId` : Auteur
- `content` : Contenu (max 1000 caractères)
- `createdAt` : Date de publication
- `deletedAt` : Date de suppression (soft delete)
- `deletedBy` : Modérateur ayant supprimé

**Méthodes :**
- `post()` : Publier le message
- `delete(moderator)` : Supprimer (par modérateur)

---

### 13. Notification

Notification pour l'utilisateur.

**Attributs :**
- `id` : UUID
- `userId` : Destinataire
- `type` : Type (NOUVEAU_FOLLOWER, NOUVEL_EPISODE, NOUVEAU_MESSAGE, REPONSE_GROUPE)
- `title` : Titre court
- `message` : Message complet
- `relatedEntityId` : ID de l'entité liée (anime, user, message...)
- `isRead` : Lue ou non
- `createdAt` : Date de création

**Méthodes :**
- `send()` : Envoyer la notification (push + in-app)
- `markAsRead()` : Marquer comme lue

---

### 14. NotificationPreferences

Préférences de notifications d'un utilisateur.

**Attributs :**
- `id` : UUID
- `userId` : Utilisateur
- `newFollower` : Activer notif nouveaux followers (défaut: true)
- `newEpisode` : Activer notif nouveaux épisodes (défaut: true)
- `newMessage` : Activer notif nouveaux messages (défaut: true)
- `groupReply` : Activer notif réponses groupes (défaut: true)
- `updatedAt` : Dernière modification

**Méthodes :**
- `updatePreferences()` : Mettre à jour les préférences

---

### 15. Report

Signalement de contenu inapproprié.

**Attributs :**
- `id` : UUID
- `reporterId` : Utilisateur signalant
- `reportedEntityType` : Type d'entité (Review, Message, GroupMessage)
- `reportedEntityId` : ID de l'entité signalée
- `reason` : Motif (spam, harcèlement, contenu inapproprié...)
- `description` : Description détaillée
- `status` : EN_ATTENTE, TRAITE, REJETE
- `reviewedBy` : Admin ayant traité
- `reviewedAt` : Date de traitement
- `createdAt` : Date du signalement

**Méthodes :**
- `create()` : Créer un signalement
- `review(admin)` : Examiner
- `resolve()` : Marquer comme traité
- `reject()` : Rejeter le signalement

---

### 16. UserStatistics

Statistiques calculées d'un utilisateur.

**Attributs :**
- `totalAnimes` : Nombre total d'animes dans la bibliothèque
- `animesWatched` : Nombre d'animes terminés
- `animesInProgress` : Nombre d'animes en cours
- `animesToWatch` : Nombre d'animes à voir
- `animesDropped` : Nombre d'animes abandonnés
- `totalEpisodes` : Total d'épisodes visionnés
- `totalWatchTime` : Temps total estimé en minutes
- `averageRating` : Note moyenne donnée
- `favoriteGenres` : Top 3 des genres préférés

**Méthodes :**
- `calculate(userId)` : Calculer les statistiques pour un utilisateur

**Notes :**
- Ces statistiques sont calculées à la demande (pas stockées)
- Possibilité de mettre en cache pour optimisation

---

## Classes auxiliaires

### Genre
Représente un genre d'anime (Action, Romance, Shonen, etc.)

### Studio
Représente un studio d'animation (Ufotable, MAPPA, etc.)

---

## Énumérations

### AnimeStatus
- `A_VOIR` : Anime dans la watchlist
- `EN_COURS` : Anime en cours de visionnage
- `TERMINE` : Anime terminé
- `ABANDONNE` : Anime abandonné

### GroupType
- `OFFICIEL` : Groupe créé automatiquement par anime
- `PERSONNALISE` : Groupe créé par un utilisateur/modérateur

### NotificationType
- `NOUVEAU_FOLLOWER` : Quelqu'un vous suit
- `NOUVEL_EPISODE` : Nouvel épisode disponible
- `NOUVEAU_MESSAGE` : Nouveau message privé
- `REPONSE_GROUPE` : Réponse dans un groupe

### ReportStatus
- `EN_ATTENTE` : Signalement en attente de traitement
- `TRAITE` : Signalement traité
- `REJETE` : Signalement rejeté (non fondé)

### UserRole
- `USER` : Utilisateur standard
- `MODERATEUR` : Modérateur (gestion des groupes)
- `ADMIN` : Administrateur (gestion complète)

### Visibility
- `PUBLIC` : Visible par tous
- `PRIVE` : Visible uniquement par l'auteur

---

## Règles métier importantes

1. **Un utilisateur = une review par anime**
2. **Un utilisateur = un anime dans sa bibliothèque** (pas de doublons)
3. **Les notes vont de 0 à 10 par paliers de 0.5**
4. **Les groupes OFFICIEL sont automatiquement créés et ne peuvent pas être supprimés**
5. **Seul le créateur d'un groupe PERSONNALISE peut le supprimer**
6. **Les modérateurs de groupe peuvent supprimer des messages**
7. **Les admins peuvent tout supprimer et bannir des utilisateurs**
8. **Les reviews privées ne peuvent pas être likées**
9. **On ne peut pas liker sa propre review**
10. **On ne peut pas se suivre soi-même**

---

**Document créé le** : 19/01/2026
**Version** : 1.0
