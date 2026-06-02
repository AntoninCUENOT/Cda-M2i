# MCD - Modèle Conceptuel de Données - AnimeTracker

## Entités

### USER
- **id_user** (Identifiant unique)
- email (Email de connexion, unique)
- password (Mot de passe hashé)
- pseudo (Nom d'affichage, unique)
- photo (URL de la photo de profil)
- bio (Biographie courte)
- role (USER, MODERATEUR, ADMIN)
- is_active (Compte activé)
- is_suspended (Compte suspendu)
- suspension_end_date (Date de fin de suspension)
- created_at (Date de création)
- updated_at (Date de mise à jour)

### ANIME
- **id_anime** (ID MyAnimeList - Integer)
- title (Titre original)
- title_english (Titre anglais)
- synopsis (Résumé)
- image_url (URL de l'image)
- trailer_url (URL du trailer)
- episodes (Nombre d'épisodes)
- score (Score MAL)
- year (Année de sortie)
- status (Statut de diffusion)
- aired_from (Date de début de diffusion)
- aired_to (Date de fin de diffusion)
- last_fetched_at (Dernière synchro API)

### GENRE
- **id_genre** (Identifiant unique)
- name (Nom du genre)

### STUDIO
- **id_studio** (Identifiant unique)
- name (Nom du studio)

### REVIEW
- **id_review** (Identifiant unique)
- rating (Note sur 10)
- comment (Commentaire texte)
- visibility (PUBLIC, PRIVE)
- likes_count (Nombre de likes)
- created_at (Date de création)
- updated_at (Date de mise à jour)

### GROUP
- **id_group** (Identifiant unique)
- name (Nom du groupe)
- description (Description)
- type (OFFICIEL, PERSONNALISE)
- is_public (Public ou privé)
- created_at (Date de création)
- updated_at (Date de mise à jour)

### CONVERSATION
- **id_conversation** (Identifiant unique)
- created_at (Date de création)
- updated_at (Date de dernière activité)

### MESSAGE
- **id_message** (Identifiant unique)
- content (Contenu du message)
- is_read (Message lu ou non)
- created_at (Date d'envoi)

### GROUP_MESSAGE
- **id_group_message** (Identifiant unique)
- content (Contenu du message)
- created_at (Date de publication)
- deleted_at (Date de suppression)

### NOTIFICATION
- **id_notification** (Identifiant unique)
- type (Type de notification)
- title (Titre)
- message (Message)
- related_entity_id (ID de l'entité liée)
- is_read (Lu ou non)
- created_at (Date de création)

### NOTIFICATION_PREFERENCES
- **id_preferences** (Identifiant unique)
- new_follower (Activer notifications followers)
- new_episode (Activer notifications épisodes)
- new_message (Activer notifications messages)
- group_reply (Activer notifications groupes)
- updated_at (Date de mise à jour)

### REPORT
- **id_report** (Identifiant unique)
- reported_entity_type (Type d'entité signalée)
- reported_entity_id (ID de l'entité signalée)
- reason (Motif)
- description (Description détaillée)
- status (EN_ATTENTE, TRAITE, REJETE)
- reviewed_at (Date de traitement)
- created_at (Date du signalement)

---

## Associations

### POSSEDE (USER -- ANIME)
- **Cardinalités** : (1,n) USER ---- POSSEDE ---- (0,n) ANIME
- **Propriétés** :
  - status (A_VOIR, EN_COURS, TERMINE, ABANDONNE)
  - episodes_watched (Nombre d'épisodes vus)
  - started_at (Date de début)
  - completed_at (Date de fin)
  - created_at
  - updated_at
- **Commentaire** : Représente la bibliothèque d'animes d'un utilisateur

### EVALUE (USER -- ANIME)
- **Cardinalités** : (0,n) USER ---- EVALUE ---- (0,n) ANIME
- **Propriétés** : Portées par l'entité REVIEW
- **Commentaire** : Un user peut évaluer plusieurs animes, un anime peut être évalué par plusieurs users

### LIKE_REVIEW (USER -- REVIEW)
- **Cardinalités** : (0,n) USER ---- LIKE ---- (0,n) REVIEW
- **Propriétés** :
  - created_at
- **Commentaire** : Un user peut liker plusieurs reviews

### SUIT (USER -- USER) - Relation réflexive
- **Cardinalités** : (0,n) USER ---- SUIT ---- (0,n) USER
- **Propriétés** :
  - created_at
- **Commentaire** : Un user peut suivre et être suivi par d'autres users

### PARTICIPE_CONVERSATION (USER -- CONVERSATION)
- **Cardinalités** : (0,n) USER ---- PARTICIPE ---- (1,n) CONVERSATION
- **Propriétés** :
  - joined_at
- **Commentaire** : Une conversation a minimum 2 participants

### ENVOIE_MESSAGE (USER -- CONVERSATION)
- **Cardinalités** : (1,1) USER ---- ENVOIE ---- (0,n) MESSAGE
- **Cardinalités** : (1,1) CONVERSATION ---- CONTIENT ---- (0,n) MESSAGE
- **Commentaire** : Un message appartient à une conversation et est envoyé par un user

### CREE_GROUP (USER -- GROUP)
- **Cardinalités** : (1,1) USER ---- CREE ---- (0,n) GROUP
- **Commentaire** : Un groupe a un créateur

### MEMBRE_GROUP (USER -- GROUP)
- **Cardinalités** : (0,n) USER ---- MEMBRE_DE ---- (0,n) GROUP
- **Propriétés** :
  - is_moderator (Est modérateur)
  - joined_at
- **Commentaire** : Un user peut être membre de plusieurs groupes

### POSTE_MESSAGE_GROUP (USER -- GROUP)
- **Cardinalités** : (1,1) USER ---- POSTE ---- (0,n) GROUP_MESSAGE
- **Cardinalités** : (1,1) GROUP ---- CONTIENT ---- (0,n) GROUP_MESSAGE
- **Commentaire** : Un message de groupe est posté par un user dans un groupe

### SUPPRIME_MESSAGE_GROUP (USER -- GROUP_MESSAGE)
- **Cardinalités** : (0,1) USER ---- SUPPRIME ---- (0,n) GROUP_MESSAGE
- **Commentaire** : Un modérateur peut supprimer des messages

### GROUPE_OFFICIEL (ANIME -- GROUP)
- **Cardinalités** : (0,1) ANIME ---- A_GROUPE_OFFICIEL ---- (0,1) GROUP
- **Commentaire** : Un anime peut avoir un groupe officiel

### APPARTIENT_GENRE (ANIME -- GENRE)
- **Cardinalités** : (0,n) ANIME ---- APPARTIENT_A ---- (1,n) GENRE
- **Commentaire** : Un anime a au moins un genre

### PRODUIT_PAR (ANIME -- STUDIO)
- **Cardinalités** : (0,n) ANIME ---- PRODUIT_PAR ---- (0,1) STUDIO
- **Commentaire** : Un anime peut avoir un studio de production

### RECOIT_NOTIFICATION (USER -- NOTIFICATION)
- **Cardinalités** : (1,1) USER ---- RECOIT ---- (0,n) NOTIFICATION
- **Commentaire** : Un user reçoit des notifications

### CONFIGURE_PREFERENCES (USER -- NOTIFICATION_PREFERENCES)
- **Cardinalités** : (1,1) USER ---- CONFIGURE ---- (1,1) NOTIFICATION_PREFERENCES
- **Commentaire** : Un user a des préférences de notifications

### SIGNALE (USER -- REPORT)
- **Cardinalités** : (1,1) USER ---- SIGNALE ---- (0,n) REPORT
- **Commentaire** : Un user peut faire des signalements

### TRAITE_REPORT (USER -- REPORT)
- **Cardinalités** : (0,1) USER ---- TRAITE ---- (0,n) REPORT
- **Commentaire** : Un admin traite les signalements

---

## Règles de gestion

1. Un utilisateur possède un email et un pseudo uniques
2. Un utilisateur peut avoir plusieurs animes dans sa bibliothèque avec des statuts différents
3. Un utilisateur ne peut évaluer qu'une seule fois un anime (1 review max)
4. Un utilisateur ne peut pas liker sa propre review
5. Un utilisateur ne peut pas se suivre lui-même
6. Une conversation a au minimum 2 participants
7. Un groupe de type OFFICIEL est automatiquement créé pour chaque anime
8. Un groupe de type PERSONNALISE est créé par un utilisateur ou modérateur
9. Le créateur d'un groupe personnalisé est automatiquement modérateur
10. Seuls les modérateurs peuvent supprimer des messages dans un groupe
11. Les groupes officiels ne peuvent pas être supprimés
12. Un anime appartient à au moins un genre
13. Une notification est liée à une entité spécifique (anime, user, message...)
14. Chaque utilisateur a des préférences de notifications (créées à l'inscription)
15. Un signalement concerne une entité précise (review, message, group_message)
16. Seuls les administrateurs peuvent traiter les signalements

---

## Contraintes d'intégrité

- **Unicité** : email, pseudo (pour USER)
- **Clés primaires** : Tous les id_* sont des clés primaires
- **Clés étrangères** : Toutes les associations créent des clés étrangères
- **Contraintes de domaine** :
  - rating (REVIEW) : entre 0 et 10, paliers de 0.5
  - role (USER) : valeurs {USER, MODERATEUR, ADMIN}
  - status (POSSEDE) : valeurs {A_VOIR, EN_COURS, TERMINE, ABANDONNE}
  - type (GROUP) : valeurs {OFFICIEL, PERSONNALISE}
  - visibility (REVIEW) : valeurs {PUBLIC, PRIVE}
  - episodes_watched <= episodes (dans POSSEDE)

---

**Document créé le** : 19/01/2026
**Version** : 1.0
