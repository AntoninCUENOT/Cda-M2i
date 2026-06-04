# Script oral CDA - AnimeTracker

Objectif : tenir environ 45 minutes, demo comprise.  
Rythme conseille : parler calmement, laisser respirer les slides, ne pas tout lire. Le texte ci-dessous sert de conducteur : tu peux le dire presque tel quel, mais le plus important est de garder l'intention de chaque partie.

---

## Decoupage global

| Partie | Slides | Duree cible |
|---|---:|---:|
| Introduction et contexte | 1 a 4 | 5 min |
| Methode, stack, architecture | 5 a 7 | 6 min |
| Fonctionnalites, UX, securite, BDD | 8 a 12 | 10 min 30 |
| Tests, bugs, code technique | 13 a 18 | 14 min |
| Demo, ameliorations, conclusion | 19 a 21 | 9 min 30 |
| Total | 21 slides | 45 min |

Astuce timing : si tu es en retard, raccourcis les slides 15 a 18 en gardant seulement JWT, Controller/Service et Zod. Si tu es en avance, detaille les bugs resolus et la demo.

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

Transition : sur cette base, j'ai ajoute un espace d'administration.

---

## Slide 12 - Panel d'administration - 1 min 30

Le panel d'administration est la partie qui donne une dimension plus professionnelle au projet.

Un administrateur peut consulter les statistiques globales, la liste des utilisateurs, les avis et les messages de groupe. Il peut aussi suspendre un utilisateur, changer un role, moderer un avis ou supprimer un message de groupe.

L'interet est de montrer que l'application n'est pas seulement un prototype utilisateur. Comme elle contient des interactions sociales, elle doit prevoir des outils de controle.

Techniquement, cette partie s'appuie sur des routes protegees par role. Un utilisateur classique ne peut pas acceder a ces endpoints, meme s'il connait l'URL.

Transition : pour securiser le developpement, j'ai mis en place une strategie de tests.

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

Ce middleware est central, car il protege les routes authentifiees.

Son role est de lire le header Authorization, d'extraire le token Bearer, de verifier sa validite avec jwt.verify, puis de verifier dans Redis si le token a ete blacklisté.

Si le token est absent, invalide, expire ou blacklisté, la requete est rejetee avec une erreur 401. Si tout est valide, le middleware ajoute les informations utilisateur dans la requete, ce qui permet aux controllers suivants de connaitre l'utilisateur connecte.

L'interet de Redis ici est la deconnexion immediate. Un JWT est normalement stateless : tant qu'il n'est pas expire, il reste valide. En ajoutant une blacklist Redis avec TTL, je peux invalider le token au logout sans stocker tous les tokens en base.

C'est un bon compromis entre performance et controle de session.

Transition : cote backend, ce middleware s'insere dans une architecture Controller / Service.

---

## Slide 16 - Pattern Controller / Service - 2 min 30

Sur cette slide, je montre la separation entre controller et service.

Le controller gere le monde HTTP. Il recupere la requete, valide les parametres avec Zod, appelle le service et renvoie une reponse JSON avec le bon statut.

Le service, lui, contient la logique metier. Dans l'exemple de l'avis, il verifie s'il existe deja un avis pour le couple utilisateur/anime. S'il existe, il le met a jour. Sinon, il le cree avec une visibilite privee par defaut.

Cette separation apporte deux avantages. D'abord, le code est plus lisible : chacun a une responsabilite precise. Ensuite, les tests sont plus simples, car je peux tester le service sans simuler une requete Express complete.

C'est un pattern que j'ai applique sur les domaines principaux : auth, users, animes, reviews, messages, groups et admin.

Transition : la validation et le hachage completent cette architecture.

---

## Slide 17 - Zod et bcrypt - 2 min

Zod sert a valider les donnees entrantes avant la logique metier. Par exemple, pour un avis, je peux imposer une note entre 0 et 10, limiter la longueur du commentaire et contraindre la visibilite a deux valeurs possibles : PUBLIC ou PRIVE.

Cela evite d'avoir des donnees incoherentes en base et permet de retourner des erreurs claires au frontend.

bcrypt intervient au moment de l'inscription. Le mot de passe est hache avec un cout de calcul avant d'etre stocke. Le backend ne conserve donc jamais le mot de passe en clair.

Ces deux outils ont des roles differents mais complementaires : Zod protege l'entree des donnees, bcrypt protege une donnee sensible meme si la base etait compromise.

Transition : cote frontend, j'ai aussi cherche a centraliser les responsabilites.

---

## Slide 18 - Redux AsyncThunk et Axios - 2 min

Cote mobile, Redux Toolkit structure les appels API avec createAsyncThunk.

Un thunk gere les trois etats principaux : pending pour le chargement, fulfilled pour la reussite, rejected pour l'erreur. Cela rend l'interface plus predictable : je sais quand afficher un spinner, une erreur ou les donnees.

Axios est configure avec un intercepteur. Avant chaque requete, il recupere le token stocke et l'ajoute dans le header Authorization. Apres chaque reponse, il normalise les erreurs.

Sans cet intercepteur, il faudrait repeter la recuperation du token dans chaque appel API. Ici, le code est centralise et les slices restent concentrees sur leur domaine metier.

Cette partie montre aussi le lien entre les conventions backend et frontend : les donnees venant de la base sont parfois en snake_case, puis mappees en camelCase pour les composants React Native.

Transition : je passe maintenant a la demonstration.

---

## Slide 19 - Scenario de demo - 5 min

Pour la demo, je vais suivre un parcours utilisateur puis un parcours administrateur.

Je commence par creer ou connecter un utilisateur. Ensuite, je recherche un anime, par exemple Attack on Titan ou Naruto, et je l'ajoute a ma bibliotheque avec un statut.

Je vais ensuite ouvrir la fiche de l'anime, creer un avis, lui donner une note et montrer la visibilite publique ou privee. C'est un bon endroit pour rappeler que les avis sont prives par defaut.

Ensuite, je rejoins le groupe associe a l'anime et j'envoie un message. Cela montre le lien entre une donnee externe, l'anime, et une fonctionnalite sociale interne a l'application.

Si le temps le permet, je montre le follow d'un autre utilisateur et l'acces a son profil.

Pour le parcours administrateur, je me connecte avec un compte admin, j'ouvre le panneau d'administration, je montre les statistiques, puis une action de moderation : par exemple changer la visibilite d'un avis ou supprimer un message de groupe.

Phrase utile si la demo ralentit : "Je garde la demo volontairement courte, parce que l'objectif est de montrer les parcours principaux et non de parcourir tous les ecrans."

Transition : apres la version actuelle, voici les axes d'amelioration.

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
