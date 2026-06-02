# User Stories - AnimeTracker

## Vue d'ensemble du projet

**Nom** : AnimeTracker
**Type** : Application mobile (React Native Expo)
**Objectif** : Application de suivi et gestion de visionnage d'animes avec fonctionnalités communautaires

**Stack technique** :
- Frontend : React Native + Expo
- Backend : À définir (Node.js/Express recommandé)
- Base de données : PostgreSQL (recommandé pour projet CDA)
- API externe : Jikan API v4 (https://docs.api.jikan.moe/)

---

## Acteurs

1. **Visiteur** : Utilisateur non connecté, peut consulter le catalogue
2. **Utilisateur** : Utilisateur inscrit et connecté
3. **Modérateur** : Utilisateur avec droits de modération sur les groupes
4. **Administrateur** : Gestion complète de la plateforme
5. **Jikan API** : Système externe fournissant les données des animes

---

## User Stories par fonctionnalité

### A. Authentification & Profil

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US01 | Haute | Visiteur | Créer un compte avec email et mot de passe | Accéder aux fonctionnalités de l'application | - Email unique validé<br>- Mot de passe sécurisé (min 8 caractères)<br>- Confirmation par email |
| US02 | Haute | Utilisateur | Me connecter avec mes identifiants | Accéder à mon compte | - Authentification JWT<br>- Session persistante<br>- Message d'erreur si identifiants incorrects |
| US03 | Haute | Utilisateur | Me déconnecter | Sécuriser mon compte | - Token invalidé<br>- Redirection vers page d'accueil |
| US04 | Moyenne | Utilisateur | Modifier mon profil (photo, pseudo, bio, préférences) | Personnaliser mon compte | - Upload photo de profil<br>- Pseudo unique<br>- Bio limitée à 500 caractères |
| US05 | Basse | Utilisateur | Supprimer mon compte | Exercer mon droit à l'oubli (RGPD) | - Confirmation obligatoire<br>- Suppression de toutes les données personnelles<br>- Anonymisation des contenus publics |
| US06 | Moyenne | Utilisateur | Consulter le profil d'un autre utilisateur | Voir ses animes et reviews publiques | - Affichage pseudo, photo, bio<br>- Liste des animes publics<br>- Reviews publiques<br>- Statistiques publiques |

---

### B. Catalogue & Découverte d'animes

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US07 | Haute | Visiteur/Utilisateur | Rechercher un anime par nom | Trouver un anime spécifique | - Recherche en temps réel<br>- Résultats pertinents<br>- Affichage titre, image, note |
| US08 | Haute | Visiteur/Utilisateur | Filtrer les animes (genre, année, statut, score) | Découvrir des animes selon mes goûts | - Filtres multiples combinables<br>- Tri par popularité, date, score<br>- Résultats paginés |
| US09 | Haute | Visiteur/Utilisateur | Consulter la fiche détaillée d'un anime | Obtenir toutes les informations | - Synopsis, genres, studio<br>- Nombre d'épisodes, durée<br>- Dates de diffusion<br>- Score moyen communauté<br>- Trailer vidéo si disponible |
| US10 | Moyenne | Visiteur/Utilisateur | Voir les reviews publiques d'un anime | Connaître l'avis de la communauté | - Liste des reviews triées par likes<br>- Note et commentaire de chaque user<br>- Possibilité de filtrer |

---

### C. Ma bibliothèque personnelle

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US11 | Haute | Utilisateur | Ajouter un anime à ma liste "À voir" | Me créer une watchlist | - Ajout en 1 clic<br>- Anime ajouté à l'onglet "À voir"<br>- Possibilité de retirer |
| US12 | Haute | Utilisateur | Marquer un anime comme "En cours" | Suivre mes visionnages actuels | - Changement de statut<br>- Anime déplacé vers "En cours"<br>- Activation suivi progression |
| US13 | Haute | Utilisateur | Marquer un anime comme "Terminé" | Garder un historique de mes visionnages | - Changement de statut<br>- Anime déplacé vers "Terminé"<br>- Date de fin enregistrée |
| US14 | Moyenne | Utilisateur | Marquer un anime comme "Abandonné" | Gérer les animes que je ne finis pas | - Changement de statut<br>- Anime déplacé vers "Abandonné"<br>- Possibilité de reprendre |
| US15 | Haute | Utilisateur | Suivre ma progression (épisodes vus / total) | Savoir où j'en suis dans chaque anime | - Compteur épisodes vus<br>- Barre de progression visuelle<br>- Mise à jour manuelle ou auto |
| US16 | Moyenne | Utilisateur | Consulter mes statistiques (nb animes vus, temps passé, genres préférés) | Avoir une vue d'ensemble de mes visionnages | - Tableau de bord avec graphiques<br>- Total épisodes vus<br>- Temps total estimé<br>- Top genres<br>- Moyenne de mes notes |

---

### D. Notes & Commentaires

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US17 | Haute | Utilisateur | Noter un anime (sur 10 avec paliers de 0.5) | Exprimer mon appréciation | - Note de 0 à 10 par pas de 0.5<br>- Interface intuitive (étoiles ou slider)<br>- Note visible sur ma fiche anime |
| US18 | Haute | Utilisateur | Écrire un commentaire/review sur un anime | Partager mon avis détaillé | - Zone de texte riche<br>- Limite 2000 caractères<br>- Associé à ma note |
| US19 | Haute | Utilisateur | Choisir la visibilité de mon commentaire (public/privé) | Contrôler qui voit mes avis | - Toggle public/privé<br>- Par défaut privé<br>- Modification possible après publication |
| US20 | Moyenne | Utilisateur | Modifier ou supprimer mon commentaire | Corriger ou retirer mes avis | - Édition du texte et de la visibilité<br>- Suppression avec confirmation<br>- Historique non visible |
| US21 | Moyenne | Utilisateur | Liker une review publique d'un autre utilisateur | Montrer mon accord | - Bouton like/unlike<br>- Compteur de likes visible<br>- 1 like max par utilisateur |

---

### E. Interactions sociales

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US22 | Moyenne | Utilisateur | Suivre un autre utilisateur | Voir ses activités et profil facilement | - Bouton "Suivre" sur profil<br>- Ajout à ma liste de follows<br>- Notification pour l'utilisateur suivi |
| US23 | Moyenne | Utilisateur | Ne plus suivre un utilisateur | Gérer ma liste de follows | - Bouton "Ne plus suivre"<br>- Retrait de la liste<br>- Pas de notification |
| US24 | Basse | Utilisateur | Voir la liste de mes abonnements/abonnés | Gérer mon réseau | - Onglet "Abonnements"<br>- Onglet "Abonnés"<br>- Liens vers profils |
| US25 | Moyenne | Utilisateur | Envoyer un message privé à un utilisateur | Échanger en privé | - Interface de messagerie<br>- Envoi texte uniquement<br>- Horodatage des messages |
| US26 | Moyenne | Utilisateur | Recevoir et lire mes messages privés | Communiquer avec d'autres | - Liste des conversations<br>- Badge non-lus<br>- Historique complet |
| US27 | Basse | Utilisateur | Supprimer une conversation | Nettoyer ma messagerie | - Suppression côté utilisateur uniquement<br>- Confirmation obligatoire |

---

### F. Groupes de discussion par anime

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US28 | Moyenne | Utilisateur | Rejoindre le groupe officiel d'un anime | Échanger avec tous les fans de cet anime | - 1 groupe officiel auto-créé par anime<br>- Accès direct depuis fiche anime<br>- Rejoindre en 1 clic |
| US29 | Moyenne | Utilisateur/Modérateur | Créer un groupe de discussion personnalisé | Rassembler une communauté spécifique (thématique ou anime) | - Nom unique<br>- Description<br>- Public ou sur invitation<br>- Créateur = modérateur |
| US30 | Basse | Utilisateur (créateur) | Définir des modérateurs pour mon groupe personnalisé | Déléguer la gestion | - Liste des membres<br>- Promotion en modérateur<br>- Révocation possible |
| US31 | Basse | Utilisateur (créateur) | Supprimer mon groupe personnalisé | Arrêter un groupe inactif | - Confirmation obligatoire<br>- Impossible pour groupes officiels<br>- Notification aux membres |
| US32 | Moyenne | Utilisateur | Publier un message dans un groupe | Participer aux discussions | - Zone de texte<br>- Limite 1000 caractères<br>- Horodatage |
| US33 | Moyenne | Utilisateur | Lire les messages d'un groupe | Suivre les conversations | - Affichage chronologique<br>- Pagination/scroll infini<br>- Auteur et date visibles |
| US34 | Basse | Utilisateur | Quitter un groupe personnalisé | Arrêter de recevoir les notifications | - Bouton "Quitter"<br>- Impossible pour groupes officiels (désactivation notifs possible)<br>- Possibilité de rejoindre à nouveau |
| US35 | Basse | Modérateur de groupe | Supprimer un message inapproprié dans mon groupe | Modérer le contenu | - Bouton supprimer visible pour modos<br>- Message retiré définitivement<br>- Log de modération |

---

### G. Notifications

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US36 | Moyenne | Utilisateur | Recevoir une notification quand quelqu'un me suit | Être informé de mes nouveaux followers | - Notification push + in-app<br>- Lien vers profil du follower |
| US37 | Haute | Utilisateur | Recevoir une notification quand un nouvel épisode sort pour un anime de ma liste | Ne pas rater de sortie | - Notification uniquement pour animes "En cours" ou "À voir"<br>- Données de Jikan API<br>- Lien vers fiche anime |
| US38 | Haute | Utilisateur | Recevoir une notification pour les nouveaux messages privés | Répondre rapidement | - Notification push + in-app<br>- Aperçu du message<br>- Lien vers conversation |
| US39 | Moyenne | Utilisateur | Activer/désactiver les notifications par type | Personnaliser mes préférences | - Panneau de paramètres<br>- Toggle par type de notification<br>- Sauvegarde des préférences |

---

### H. Administration & Modération

| ID | Priorité | En tant que | Je veux | Afin de | Critères d'acceptation |
|----|----------|-------------|---------|---------|------------------------|
| US40 | Moyenne | Utilisateur | Signaler un commentaire ou message inapproprié | Alerter les modérateurs | - Bouton signaler<br>- Sélection du motif<br>- Commentaire optionnel |
| US41 | Haute | Admin | Consulter les signalements | Modérer le contenu | - Liste des signalements<br>- Filtre par type/statut<br>- Lien vers contenu signalé |
| US42 | Haute | Admin | Supprimer un commentaire/message | Retirer du contenu inapproprié | - Suppression définitive<br>- Notification à l'auteur<br>- Log de modération |
| US43 | Moyenne | Admin | Suspendre ou bannir un utilisateur | Sanctionner les comportements abusifs | - Suspension temporaire (durée définie)<br>- Bannissement définitif<br>- Motif enregistré<br>- Email de notification |

---

## Priorisation globale

### MVP (Minimum Viable Product) - Version 1.0
- Authentification complète (US01-US03)
- Catalogue et recherche (US07-US09)
- Bibliothèque personnelle (US11-US15)
- Notes et commentaires (US17-US19)
- Notifications épisodes (US37)

### Version 1.5
- Profils utilisateurs (US04, US06)
- Interactions sociales de base (US22-US26)
- Notifications sociales (US36, US38)
- Statistiques (US16)

### Version 2.0
- Groupes de discussion (US28-US35)
- Administration complète (US40-US43)
- Fonctionnalités avancées (US05, US20, US21, US39)

---

## Notes techniques

### Règles métier importantes

1. **Notes** : Échelle de 0 à 10 par pas de 0.5 (0, 0.5, 1, 1.5... 10)
2. **Commentaires** : Public par défaut = NON (privé par défaut pour protéger l'utilisateur)
3. **Groupes officiels** : 1 par anime, créés automatiquement, impossibles à supprimer
4. **Groupes personnalisés** : Créés par utilisateurs/modérateurs, gérables par le créateur
5. **Notifications** : Uniquement pour animes "En cours" et "À voir" (pas "Terminé" ni "Abandonné")
6. **API externe** : Jikan API v4 pour toutes les données d'animes (pas de stockage local du catalogue complet)

### Contraintes RGPD
- Consentement explicite pour notifications
- Droit à l'oubli (US05)
- Export des données personnelles (à ajouter si nécessaire)
- Politique de confidentialité obligatoire

---

**Document créé le** : 19/01/2026
**Dernière mise à jour** : 19/01/2026
**Version** : 1.0
