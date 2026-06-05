# Script oral CDA - AnimeTracker

Objectif : tenir environ 45 minutes, demo comprise.  
Rythme conseille : parler calmement, laisser respirer les slides, ne pas tout lire. Le texte ci-dessous sert de conducteur : tu peux le dire presque tel quel, mais le plus important est de garder l'intention de chaque partie.

---

## Decoupage global

| Partie | Slides | Duree cible |
|---|---:|---:|
| Introduction et contexte | 1 à 4 | 5 min |
| Méthode, stack, architecture | 5 à 7 | 6 min |
| Fonctionnalités, UX, sécurité | 8 à 10 | 6 min |
| BDD + MPD, Admin, DevOps | 11 à 12b | 8 min |
| Tests, bugs | 13 à 14 | 5 min |
| Code technique | 15 à 18 | 9 min |
| Démo, améliorations, conclusion | 19 à 23 | 11 min |
| Total | 23 slides | 45 min |

Astuce timing : si tu es en retard, raccourcis les slides MPD (reste sur les grandes relations) et DevOps (reste sur le Docker dev, skip la prod). Si tu es en avance, détaille davantage les bugs résolus et commente plus longuement la vidéo de démo.

---

## Slide 1 - Couverture - 1 min

Bonjour, je m'appelle Antonin CUENOT, et je vous presente aujourd'hui mon projet realise dans le cadre du titre professionnel CDA, Concepteur Developpeur d'Applications.

Le projet s'appelle AnimeTracker. C'est une application mobile full-stack de suivi d'animes. L'idee est de permettre a un utilisateur de rechercher des animes, de construire sa bibliotheque personnelle, de donner des avis, d'echanger avec d'autres utilisateurs et de participer a des groupes de discussion lies aux animes.

J'ai choisi ce sujet pour deux raisons. D'abord parce que c'est un domaine qui me parle personnellement, donc il etait plus facile de me projeter dans les besoins utilisateurs. Ensuite parce que, apres un projet DWWM oriente site web, je voulais monter en competence sur une vraie application mobile avec un backend complet, une base de donnees, de la securite et des tests.

Transition : je vais commencer par le plan de la presentation.

---

## Slide 2 - Sommaire - 30 sec

La presentation suit le cycle de vie du projet.

Je commencerai par mon contexte personnel et le besoin auquel repond AnimeTracker. Ensuite, je presenterai l'organisation du travail, les choix techniques et l'architecture generale.

Puis je passerai sur les fonctionnalites principales, les maquettes, la securite, la base de donnees et le panel d'administration. La derniere partie sera plus technique : strategie de tests, bugs rencontres, extraits de code, puis demonstration et bilan.

L'objectif n'est pas seulement de montrer une application qui fonctionne, mais aussi d'expliquer les choix de conception et les competences CDA mobilisees.

Transition : je commence donc par mon parcours et l'objectif du projet.

---

## Slide 3 - Presentation personnelle - 1 min 30

J'ai obtenu le titre DWWM en 2024, avec un projet oriente web. Pour le CDA, j'ai voulu aller plus loin sur la conception et sur l'architecture applicative.

Mon objectif avec AnimeTracker etait de passer d'un projet web classique a une application mobile native, tout en gardant une logique full-stack : une application React Native cote client, une API REST Node.js cote serveur, et une base PostgreSQL pour les donnees metier.

Ce projet m'a permis de travailler plusieurs axes importants pour le CDA : la conception de donnees, le decoupage en couches, la securisation d'une API, la gestion de l'etat cote frontend, les tests automatises et la documentation technique.

Le sujet des animes etait naturel pour moi, mais j'ai volontairement cadre le projet comme une application professionnelle : authentification, droits, donnees privees, moderation, tests et pistes d'evolution.

Transition : maintenant, je presente plus precisement le produit.

---

## Slide 4 - Contexte du projet - 2 min

AnimeTracker repond a un besoin simple : quand on regarde plusieurs series, il devient vite difficile de suivre ce qu'on a vu, ce qu'on veut voir, les notes, les avis et les discussions autour de chaque anime.

L'application permet donc de centraliser ces usages. L'utilisateur peut rechercher un anime via une API externe, l'ajouter a sa bibliotheque, lui attribuer un statut comme "en cours" ou "termine", laisser un avis, suivre d'autres utilisateurs et rejoindre un groupe de discussion par anime.

J'ai aussi ajoute une dimension administration, parce qu'une application sociale a besoin de moderation. L'administrateur peut consulter des statistiques, moderer des avis ou des messages de groupe, suspendre un utilisateur et gerer certains droits.

Le perimetre choisi est volontairement complet, mais reste realiste pour un projet CDA : il couvre l'authentification, le CRUD metier, les relations sociales, la messagerie, la moderation et les tests.

Transition : pour arriver a ce resultat, j'ai organise le travail par etapes.

---

## Slide 5 - Methode de travail - 1 min 30

J'ai suivi une demarche progressive. La premiere etape a ete l'analyse du besoin : identifier les acteurs, les cas d'utilisation et les fonctionnalites prioritaires.

Ensuite, j'ai travaille la conception : modele de donnees, diagrammes UML, maquettes et architecture technique. Cette phase etait importante pour eviter de coder trop vite une application difficile a maintenir.

Le developpement s'est ensuite fait par domaines fonctionnels : authentification, bibliotheque, avis, social, messagerie, groupes, puis administration. A chaque fois, j'ai essaye de garder le meme pattern : route, controller, service, modele, puis integration frontend.

Enfin, j'ai consacre une partie du projet aux tests, a la documentation et a la correction des bugs. Les bugs rencontres ont ete utiles, parce qu'ils ont force a stabiliser l'architecture au lieu de simplement corriger l'interface.

Transition : je passe maintenant aux choix technologiques.

---

## Slide 6 - Stack technique - 2 min

La stack est TypeScript sur presque tout le projet. C'est un choix important, car il permet de reduire les erreurs de structure entre le frontend, le backend et les donnees manipulees.

Cote frontend, j'ai utilise React Native avec Expo. Expo permet de simplifier le lancement sur emulateur Android et de se concentrer sur la logique applicative. Redux Toolkit sert a centraliser l'etat : authentification, bibliotheque, avis, messages, groupes et parametres.

Cote backend, j'ai choisi Node.js, Express et Sequelize. Express me donne une API REST claire, et Sequelize permet de modeliser les tables PostgreSQL en TypeScript.

Pour la base de donnees, PostgreSQL gere les donnees relationnelles : utilisateurs, animes, avis, follows, conversations, groupes. Redis est utilise pour la blacklist des tokens JWT a la deconnexion.

Enfin, Docker me permet de lancer PostgreSQL et Redis de maniere reproductible, sans dependre d'une installation locale fragile.

Transition : avec cette stack, l'application est organisee en couches.

---

## Slide 7 - Architecture en couches - 2 min 30

L'architecture suit une separation claire des responsabilites.

Cote mobile, les screens gerent l'affichage et les interactions. Les composants reutilisables evitent la duplication. Redux Toolkit centralise l'etat et les appels asynchrones. Axios gere la communication HTTP avec le backend.

Cote backend, les routes exposent les endpoints REST. Les controllers traduisent la requete HTTP : ils recuperent les parametres, valident les donnees et renvoient la reponse. La logique metier est dans les services. Les services manipulent les modeles Sequelize, qui font le lien avec PostgreSQL.

Cette separation est importante parce qu'elle rend le projet testable et maintenable. Par exemple, un service peut etre teste sans lancer Express, car il ne depend pas directement de la requete HTTP.

J'ai aussi garde une convention de nommage stricte : snake_case en base de donnees, camelCase dans le code TypeScript. Ce point parait simple, mais il a ete essentiel pour eviter les bugs de mapping.

Transition : je vais maintenant presenter les fonctionnalites livrees.

---

## Slide 8 - Fonctionnalites implementees - 2 min 30

Le projet contient huit grands blocs fonctionnels.

Le premier est l'authentification : inscription, connexion, deconnexion, verification du token et profil utilisateur.

Le deuxieme est la recherche d'animes, basee sur l'API Jikan. Cela permet de recuperer des donnees issues de MyAnimeList sans avoir a constituer moi-meme tout le catalogue.

Le troisieme bloc est la bibliotheque personnelle. Un utilisateur peut ajouter un anime, modifier son statut, suivre sa progression et le retirer de sa liste.

Ensuite viennent les avis. Un utilisateur peut noter un anime, ajouter un commentaire et choisir une visibilite publique ou privee. Par defaut, les avis sont prives, ce qui est un choix volontaire pour respecter la logique de confidentialite.

Les autres blocs sont la messagerie privee, les groupes de discussion par anime, le systeme de follow entre utilisateurs et le panel d'administration.

Transition : ces fonctionnalites ont ete pensees aussi cote experience utilisateur.

---

## Slide 9 - Maquettes et design - 1 min 30

Avant de developper les ecrans, j'ai travaille des maquettes pour definir les parcours principaux : connexion, accueil, recherche, detail d'un anime, bibliotheque et chat.

L'objectif etait d'avoir une interface mobile lisible, avec une identite visuelle coherente. La palette violet/cyan vient du theme de l'application, avec un mode clair et un mode sombre.

Les ecrans sont organises autour de parcours simples : rechercher un anime, l'ajouter, consulter sa fiche, ecrire un avis, rejoindre un groupe et echanger. J'ai essaye d'eviter une interface trop chargee, surtout parce qu'une application mobile doit rester rapide a lire.

Cette partie est importante pour le CDA, car la conception ne se limite pas a la base de donnees ou au code. Il faut aussi penser l'usage final et la navigation.

Transition : une fois les parcours definis, j'ai travaille la securite.

---

## Slide 10 - Securite applicative - 2 min 30

La securite est presente a plusieurs niveaux.

D'abord, les mots de passe ne sont jamais stockes en clair. Ils sont haches avec bcrypt avant l'enregistrement en base.

Ensuite, l'authentification repose sur des JWT. A chaque requete protegee, le backend verifie la signature du token, son expiration et le fait qu'il ne soit pas blacklisté dans Redis.

J'ai aussi mis en place de la validation avec Zod. Cela permet de rejeter les donnees invalides avant qu'elles arrivent dans les services ou en base. Par exemple, une note doit etre comprise entre 0 et 10, et respecter les formats attendus.

La protection passe aussi par les roles. Certaines routes sont reservees aux administrateurs, notamment la moderation et les statistiques.

Enfin, les regles metier participent a la securite : un utilisateur ne peut pas se suivre lui-meme, un avis prive ne doit pas etre expose publiquement, et un token deconnecte ne doit plus etre utilisable.

Transition : ces regles s'appuient sur un schema de base relationnel.

---

## Slide 11 - Base de donnees - 2 min 30

La base PostgreSQL contient les principales entites de l'application : utilisateurs, animes, bibliotheque utilisateur, avis, follows, conversations, messages, groupes et messages de groupe.

Le modele relationnel est adapte au projet, car les donnees sont fortement liees. Par exemple, un avis appartient a un utilisateur et a un anime. Une entree de bibliotheque relie aussi un utilisateur et un anime. Un groupe est lie a un anime, et ses messages sont lies a un groupe et a un auteur.

J'ai utilise des UUID pour les utilisateurs, ce qui evite d'exposer des identifiants incrementaux trop previsibles. Pour les animes, l'identifiant externe Jikan est conserve, ce qui facilite la synchronisation avec le catalogue.

Les contraintes SQL et les validations service se completent. Par exemple, certaines regles sont protegees en base, mais aussi verifiees cote service pour produire des erreurs plus lisibles.

Transition : je passe maintenant au schéma visuel des relations entre toutes ces tables.

---

## Slide 11b - MPD — Modèle Physique de Données - 2 min

Sur ce diagramme vous pouvez voir l'ensemble des 12 tables et comment elles sont reliées entre elles.

Au centre, la table user. C'est elle qui est au cœur de tout — presque toutes les autres tables y sont reliées d'une façon ou d'une autre.

En partant de la gauche : user_anime. C'est la table qui représente la bibliothèque personnelle. Elle fait le lien entre un utilisateur et un animé. La contrainte UNIQUE sur le couple user + anime garantit qu'un animé ne peut apparaître qu'une seule fois dans la bibliothèque d'un utilisateur.

Juste à côté : review. Même principe — un utilisateur, un animé, une seule ligne possible. Et en dessous de review, la table review_like qui enregistre les likes. Là encore contrainte d'unicité : on ne peut pas liker deux fois le même avis.

Au milieu en jaune : follow. C'est la relation sociale réflexive — la table pointe deux fois vers user, une fois pour le suiveur et une fois pour le suivi. Et il y a une contrainte CHECK qui interdit à un utilisateur de se suivre lui-même, directement au niveau SQL.

À droite en bleu : la messagerie. Un utilisateur ne participe pas directement à une conversation — il passe par conversation_participant. Ce découpage en trois tables permet d'étendre facilement les conversations à plus de deux participants si nécessaire.

Et tout à droite en vert : les groupes. Un groupe est lié à un animé — c'est le groupe officiel de discussion. Les membres et les messages sont dans des tables séparées. Les group_message ont un champ deleted_at pour la suppression logique par les modérateurs.

Ce qui est important ici c'est de voir que chaque relation répond à un besoin métier précis. Si j'avais tout mis dans une seule table, je n'aurais pas pu gérer correctement les contraintes d'intégrité, les suppressions en cascade, ou les droits différents selon les rôles.

Transition : sur cette base de données, j'ai ajouté un espace d'administration.

---

## Slide 12 - Panel d'administration - 1 min 30

Le panel d'administration est la partie qui donne une dimension plus professionnelle au projet.

Un administrateur peut consulter les statistiques globales, la liste des utilisateurs, les avis et les messages de groupe. Il peut aussi suspendre un utilisateur, changer un role, moderer un avis ou supprimer un message de groupe.

L'interet est de montrer que l'application n'est pas seulement un prototype utilisateur. Comme elle contient des interactions sociales, elle doit prevoir des outils de controle.

Techniquement, cette partie s'appuie sur des routes protegees par role. Un utilisateur classique ne peut pas acceder a ces endpoints, meme s'il connait l'URL.

Transition : avant de passer aux tests, je vais vous montrer rapidement comment j'ai organisé l'infrastructure et ce que serait le déploiement en production.

---

## Slide 12b - DevOps et Déploiement - 2 min

En développement, j'utilise Docker Compose pour lancer l'infrastructure. Trois conteneurs : PostgreSQL, Redis, et le backend Node.js.

PostgreSQL tourne sur le port 5433 plutôt que 5432, parce que j'avais déjà une installation native de PostgreSQL sur ma machine Windows qui occupait le port standard. Docker permet de gérer ça proprement avec un simple mapping de ports.

Redis tourne en mode persistant avec appendonly yes — les données sont sauvegardées sur disque et ne disparaissent pas si le conteneur redémarre.

Le backend, lui, je l'ai choisi de le lancer directement sur la machine hôte avec npm run dev plutôt qu'en conteneur. La raison : Docker Desktop sur Windows ne propage pas correctement les événements de modification de fichiers au système Linux du conteneur. Du coup nodemon — qui redémarre le serveur automatiquement quand on modifie un fichier — ne détectait aucun changement. Lancer le backend en local a réglé le problème.

Un autre avantage de Docker : la base de données est initialisée automatiquement. J'ai un fichier init.sql qui est exécuté au premier démarrage du conteneur PostgreSQL. Il crée les types ENUM, toutes les tables, les contraintes et les index. Quelqu'un qui clone le projet et fait docker compose up a une base opérationnelle en 15 secondes.

Si ce projet devait passer en production, voilà comment je l'organiserais.

Le backend serait déployé sur un VPS ou une plateforme comme Railway. L'image Docker serait construite en multi-stage : une étape qui compile TypeScript en JavaScript, puis une image finale légère sans les outils de développement. Les variables d'environnement — JWT secret, mots de passe de base — seraient injectées par la plateforme, jamais dans le code.

La base de données serait remplacée par un service managé comme Supabase, avec des sauvegardes automatiques.

Pour le frontend mobile, Expo propose un service de build appelé EAS Build qui génère directement un APK ou un AAB signé pour le Google Play Store.

Et pour le CI/CD, j'ai déjà un workflow GitHub Actions qui lance le lint, la vérification TypeScript et les 38 tests Jest à chaque push. Les tests sont entièrement mockés, donc pas besoin de base de données réelle en intégration continue.

Transition : maintenant je vais vous montrer la stratégie de tests mise en place.

---

---

## Slide 13 - Strategie de tests - 2 min 30

La suite de tests automatises contient 38 tests qui passent.

Il y a des tests unitaires sur les services d'authentification et d'utilisateur. Ils verifient les cas principaux, mais aussi les erreurs : email deja utilise, mot de passe incorrect, compte suspendu, token invalide, follow impossible sur soi-meme, etc.

Il y a aussi des tests d'integration sur les routes d'authentification. Ces tests verifient le comportement HTTP : codes de reponse, validation Zod, absence de header Authorization, token blacklisté et healthcheck.

Pour isoler les tests, les modeles Sequelize, la base et Redis sont mockes. Cela permet d'avoir une suite rapide et stable, sans dependance a une base reelle.

En complement, j'ai effectue des tests manuels sur emulateur Android pour les parcours complets : inscription, connexion, recherche, bibliotheque, avis, groupes, messagerie et administration.

Transition : les tests et les essais manuels ont aide a identifier plusieurs bugs interessants.

---

## Slide 14 - Bugs resolus - 2 min 30

Quatre bugs sont importants a presenter, parce qu'ils montrent la demarche de resolution.

Le premier concernait les avis prives. L'endpoint public ne retournait que les avis publics, donc l'utilisateur avait l'impression que son avis prive disparaissait apres navigation. La solution a ete de creer un endpoint dedie pour recuperer son propre avis, quelle que soit sa visibilite.

Le deuxieme bug concernait le bouton follow. Le selecteur Redux lisait la mauvaise liste, ce qui faisait que l'etat du bouton ne correspondait pas a la realite. J'ai corrige le selecteur et clarifie les donnees retournees par le backend.

Le troisieme bug venait de l'appartenance aux groupes. Redux etant en memoire, l'etat etait perdu au redemarrage. La solution a ete de verifier l'appartenance cote backend au montage de l'ecran groupe.

Le quatrieme bug concernait les tests Jest. L'ajout de nouveaux modeles Sequelize cassait les tests, car certains imports tentaient d'initialiser une vraie connexion. J'ai resolu le probleme en mockant explicitement les modeles.

Ce que je retiens, c'est que chaque bug venait d'une incoherence entre deux couches : frontend/backend, route publique/donnee privee, etat local/base de donnees, ou test/modele.

Transition : je vais maintenant montrer quelques choix techniques dans le code.

---

## Slide 15 - Middleware JWT - 2 min 30

Sur cette slide je montre le middleware d'authentification. C'est lui qui protège toutes les routes qui nécessitent d'être connecté. Il s'exécute avant le controller, à chaque requête.

Je vais le lire ligne par ligne.

La première chose que je fais : je lis le header Authorization de la requête et j'en extrais le token. Ce header ressemble à "Bearer eyJ...". Si ce header est absent ou mal formé, j'arrête immédiatement et je renvoie une erreur 401 — token manquant.

Ensuite — et c'est la partie importante pour la déconnexion — je demande à Redis si ce token a été blacklisté. Quand un utilisateur se déconnecte, son token est placé dans Redis avec une durée de vie égale au temps qui lui restait avant expiration. Donc si quelqu'un essaie de réutiliser un token après logout, Redis répond "oui ce token existe" et je bloque la requête avec une erreur 401.

Troisième étape : jwt.verify. C'est là que je vérifie la signature cryptographique du token et sa date d'expiration. Si le token a été falsifié ou s'il est expiré, jwt.verify lève une exception que je capture.

Enfin, si tout est valide, j'injecte les informations de l'utilisateur — son ID et son rôle — directement dans l'objet request. Comme ça, tous les controllers qui viennent après ont accès à req.user sans avoir besoin de refaire une requête en base.

Ce qui est important à retenir : la blacklist Redis permet de révoquer un token immédiatement. Sans ça, un JWT resterait valable jusqu'à son expiration même si l'utilisateur s'est déconnecté.

Transition : ce middleware s'insère dans une architecture Controller / Service que je vais vous montrer maintenant.

---

## Slide 16 - Pattern Controller / Service - 2 min 30

Sur cette slide j'ai l'exemple de la création ou mise à jour d'un avis — c'est un bon exemple parce qu'il y a une règle métier intéressante derrière.

À gauche, le controller. Son rôle est uniquement de gérer la partie HTTP.

La première ligne du controller : je valide les données qui arrivent avec Zod. Je vérifie que l'animeId dans l'URL est bien une chaîne de caractères, et que le corps de la requête contient une note valide, un commentaire éventuel, une visibilité. Si quelque chose est incorrect, Zod renvoie une erreur 400 directement — le service n'est même pas appelé.

Ensuite je convertis l'animeId en entier, parce que dans l'URL c'est toujours une chaîne de caractères.

Puis j'appelle le service en lui passant l'ID de l'utilisateur connecté — que j'ai récupéré depuis req.user, injecté par le middleware JWT — l'ID de l'animé, et les données de l'avis.

Enfin je renvoie la réponse HTTP avec un statut 201 et les données de l'avis.

À droite, le service. Lui ne connaît pas HTTP, il ne sait pas ce qu'est une requête ou une réponse. Il contient uniquement la logique métier.

Et la logique ici, c'est la suivante : je fais une requête en base pour vérifier si cet utilisateur a déjà un avis sur cet animé. La contrainte métier, c'est qu'on ne peut avoir qu'un seul avis par animé.

Si un avis existe déjà — je le mets à jour. C'est la partie update.

Si aucun avis n'existe — je le crée. Et là il y a un détail important : je force la visibilité à "PRIVÉ" par défaut. L'utilisateur doit explicitement choisir de rendre son avis public. C'est un choix de conception intentionnel pour respecter la vie privée.

Ce pattern, je l'ai appliqué sur tous les domaines : auth, bibliothèque, avis, messagerie, groupes, admin. L'avantage concret c'est que je peux tester le service sans démarrer Express — c'est exactement ce que font mes tests Jest.

Transition : Zod et bcrypt complètent cette architecture du côté de la validation et de la sécurité.

---

## Slide 17 - Zod et bcrypt - 2 min 30

Sur cette slide je montre deux outils qui protègent le backend à des niveaux différents.

À gauche, Zod. C'est le schéma de validation pour la création d'un avis.

Première chose : la note. Je déclare que ce doit être un nombre entre 0 et 10. Jusque là c'est classique. Mais j'ajoute une contrainte supplémentaire avec refine : je vérifie que la note multipliée par 2 est un entier. Ça peut paraître bizarre, mais c'est exactement ça qui me garantit que la note est un multiple de 0.5 — donc 0, 0.5, 1, 1.5, jusqu'à 10. Si quelqu'un envoie 7.3, c'est refusé. Si quelqu'un envoie la chaîne "abc", c'est aussi refusé immédiatement avec un message d'erreur clair.

Le commentaire est optionnel, mais s'il est présent je limite sa longueur à 2000 caractères.

La visibilité n'accepte que deux valeurs possibles : "PUBLIC" ou "PRIVE". Toute autre valeur est rejetée par Zod avant d'atteindre la base de données.

Ce que ça évite concrètement : des données corrompues en base, des injections sémantiques, et des erreurs silencieuses.

À droite, bcrypt. C'est la partie inscription.

Première étape : je vérifie si l'email existe déjà en base. Si c'est le cas, je lance une AppError avec le code 409 — conflit. L'utilisateur voit "Email déjà utilisé".

Si l'email est libre, je hache le mot de passe avec bcrypt, avec un coût de 12. Ce coût signifie 2 à la puissance 12 itérations de hachage. Même avec un ordinateur très puissant, tester des millions de mots de passe par force brute prendrait des années.

Ensuite je crée l'utilisateur en base avec le hash — jamais le mot de passe en clair. Et je génère un token JWT pour que l'utilisateur soit directement connecté après inscription.

Ces deux outils se complètent : Zod protège les données avant qu'elles rentrent dans le système, bcrypt protège une donnée sensible même si quelqu'un accédait directement à la base.

Transition : côté frontend, j'ai centralisé la gestion d'état et les appels API.

---

## Slide 18 - Gestion d'état frontend - 1 min 30

Sur cette slide je montre comment fonctionne le frontend du point de vue des données.

Le principe de Redux, c'est un état centralisé. Au lieu que chaque écran gère ses propres données dans son coin, tout passe par un store unique. J'ai 8 slices — auth, bibliothèque, avis, social, messagerie, groupes, et ainsi de suite. Chaque slice gère un domaine précis.

Le flux est toujours le même, et c'est ça qui rend le code prévisible.

Quand l'utilisateur fait quelque chose — par exemple appuyer sur "Ajouter à ma bibliothèque" — ça déclenche une action dans le slice correspondant. Ce slice fait l'appel API. La réponse est reçue et stockée dans le store. Et automatiquement, tous les composants qui dépendent de ces données se mettent à jour.

Ce qu'il faut retenir : l'écran n'a pas besoin de savoir comment fonctionne l'API. Il dit juste "j'ai besoin de ces données" et le store lui répond.

Pour les appels API, j'utilise Axios avec deux intercepteurs configurés une seule fois. Avant chaque requête, le JWT est injecté automatiquement dans le header — aucun écran n'a besoin d'y penser. Après chaque réponse, les erreurs sont normalisées en un message lisible pour l'utilisateur.

Et un dernier détail : la base de données utilise snake_case — id_user, created_at. Le frontend JavaScript utilise camelCase — userId, createdAt. Chaque slice possède une petite fonction de conversion pour transformer les données à la réception.

Transition : je passe maintenant à la démonstration.

---

## Slide Démo - Vidéo enregistrée - 5 min

La démonstration que je vais vous montrer a été enregistrée directement sur l'émulateur Android, sur un Pixel 10 Pro XL en API level 33. J'ai fait ce choix pour éviter tout aléa technique le jour J — connexion réseau, lancement de l'émulateur, données qui ne s'affichent pas — et pour pouvoir me concentrer sur les explications plutôt que sur la manipulation en direct.

[ Lancer la vidéo ]

Je vais commenter ce que vous voyez au fur et à mesure.

Parcours utilisateur — commenter en direct pendant la vidéo :

"Ici je me connecte avec le compte de test. Vous voyez l'écran d'accueil qui affiche les animés populaires récupérés depuis l'API Jikan en temps réel."

"Je recherche Attack on Titan. Les résultats arrivent immédiatement — c'est Jikan qui répond, pas ma base de données. J'ajoute l'animé à ma bibliothèque avec le statut En cours."

"J'ouvre la fiche de l'animé. Vous voyez la note MyAnimeList, les genres, le synopsis. Je vais maintenant écrire un avis. Je mets une note de 9.5 sur 10. Par défaut, cet avis est privé — je dois explicitement choisir de le rendre public."

"Je rejoins le groupe de discussion officiel lié à cet animé. Ce groupe a été créé automatiquement à la première demande d'adhésion. J'envoie un message."

Parcours administrateur — commenter :

"Je me connecte maintenant avec le compte administrateur. Dans l'écran profil, j'ai accès au panneau d'administration. Je peux voir les statistiques globales. Je vais modérer un message de groupe — ici c'est une suppression logique, le message n'est pas effacé de la base mais marqué comme supprimé avec un timestamp. Et je vais suspendre un utilisateur pour 7 jours."

Phrase de transition si la vidéo avance vite : "Je mets la vidéo en pause ici si vous souhaitez qu'on s'attarde sur un écran en particulier."

Transition : après cette démonstration, voici les axes d'amélioration que j'ai identifiés.

---

## Slide 20 - Axes d'amelioration - 2 min

La premiere evolution serait d'ajouter un refresh token. Aujourd'hui, l'expiration du JWT provoque une deconnexion. Un refresh token permettrait une experience plus fluide.

La deuxieme evolution concerne le temps reel. La messagerie fonctionne, mais elle pourrait etre amelioree avec Socket.IO pour afficher les messages instantanement, ajouter des notifications et des indicateurs de lecture.

Je voudrais aussi augmenter la couverture de tests, notamment sur la bibliotheque, les groupes et la messagerie, qui sont encore surtout couverts par des tests manuels.

Autre piste : remplacer Sequelize par Prisma. Prisma apporterait un typage plus fort et une meilleure gestion des migrations.

Enfin, sur une application sociale, un role moderateur serait pertinent pour deleguer une partie de la moderation sans donner tous les droits d'administration.

Transition : je termine avec le bilan personnel du projet.

---

## Slide 21 - Conclusion - 2 min 30

Pour conclure, AnimeTracker m'a permis de concevoir et developper une application mobile full-stack de bout en bout.

J'ai travaille le frontend mobile avec React Native, le backend avec Node.js et Express, la base relationnelle avec PostgreSQL, la securite avec JWT, Redis, bcrypt et Zod, et la qualite avec une suite de 38 tests automatises.

Le projet contient aujourd'hui 54 endpoints HTTP, 12 tables principales, 8 blocs fonctionnels et un panel d'administration. Au-dela des chiffres, ce que je retiens surtout, c'est la progression dans la conception : penser les couches, documenter les choix, corriger les bugs a la racine et garder une coherence entre l'interface, l'API et la base de donnees.

Ce projet m'a aussi permis de passer du web au mobile natif, ce qui etait un objectif personnel important pour ce CDA.

Merci pour votre attention. Je suis maintenant pret a repondre a vos questions.

---

## Questions jury probables

### Pourquoi React Native plutot qu'une application web ?

Parce que mon objectif CDA etait de progresser vers le mobile. React Native permet de developper une vraie application mobile avec une logique proche de React, tout en gardant TypeScript et un ecosysteme que je connais deja.

### Pourquoi Redis pour la blacklist JWT ?

Redis est adapte a des donnees temporaires et rapides. Pour un token blacklisté, j'ai besoin d'une cle avec une duree de vie. Redis gere naturellement le TTL, ce qui evite de nettoyer manuellement une table SQL.

### Pourquoi les avis sont prives par defaut ?

Parce qu'un avis est une donnee personnelle d'expression. Le rendre prive par defaut laisse le controle a l'utilisateur. Il peut choisir explicitement de le rendre public.

### Quelle est la principale difficulte technique ?

La coherence entre les couches. Beaucoup de bugs venaient d'un decalage entre backend, frontend et etat local. Les solutions ont souvent ete de clarifier les contrats API et d'ajouter des endpoints dedies plutot que de contourner le probleme cote interface.

### Que ferais-tu en premier pour une v2 ?

Je commencerais par le refresh token et l'extension des tests d'integration. Ce sont deux evolutions qui ameliorent directement la fiabilite et l'experience utilisateur.
