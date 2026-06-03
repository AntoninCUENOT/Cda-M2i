import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, TableOfContents, StyleLevel,
  LevelFormat, convertInchesToTwip, TabStopType, TabStopPosition,
  LeaderType, ShadingType, Table, TableRow, TableCell,
  WidthType, BorderStyle, ImageRun, PageOrientation,
} from 'docx';
import { writeFileSync, readFileSync } from 'fs';

// ─── Helpers ────────────────────────────────────────────────────────────────

const VIOLET = '8B5CF6';
const DARK   = '1E1B4B';
const GRAY   = '6B7280';

const para = (text, opts = {}) =>
  new Paragraph({ children: [new TextRun({ text, ...opts }) ], ...opts._para });

const heading1 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });

const heading2 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });

const heading3 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });

const blank = (n = 1) =>
  Array.from({ length: n }, () => new Paragraph({ text: '' }));

const bullet = (text) =>
  new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 80 },
  });

const subBullet = (text) =>
  new Paragraph({
    text,
    bullet: { level: 1 },
    spacing: { after: 60 },
  });

const centered = (text, opts = {}) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, ...opts })],
    spacing: opts.spacing,
  });

const pageBreak = () =>
  new Paragraph({ children: [new PageBreak()] });

// ─── COVER PAGE ─────────────────────────────────────────────────────────────

const coverPage = [
  ...blank(6),

  centered('DOSSIER DE PROJET', {
    bold: true,
    size: 56,
    color: DARK,
  }),

  ...blank(1),

  centered('Titre Professionnel', {
    size: 28,
    color: GRAY,
  }),

  centered('Concepteur Développeur d\'Applications — Niveau 6 RNCP', {
    size: 24,
    color: GRAY,
    spacing: { after: 400 },
  }),

  ...blank(3),

  centered('AnimeTracker', {
    bold: true,
    size: 48,
    color: VIOLET,
  }),

  ...blank(1),

  centered('Application mobile de suivi et gestion d\'animés', {
    size: 26,
    italics: true,
    color: GRAY,
  }),

  ...blank(6),

  centered('CUENOT ANTONIN', {
    bold: true,
    size: 28,
    color: DARK,
  }),

  ...blank(1),

  centered('Mai 2026', {
    size: 24,
    color: GRAY,
  }),

  pageBreak(),
];

// ─── SOMMAIRE ────────────────────────────────────────────────────────────────

const sommairePage = [
  heading1('Sommaire'),

  ...blank(1),

  // Partie 1
  new Paragraph({
    children: [
      new TextRun({ text: 'PARTIE 1 — PRÉSENTATION DU PROJET', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 240, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '1.1   Présentation du candidat et contexte de formation', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '1.2   Présentation générale du projet', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '1.3   Objectifs et périmètre fonctionnel', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '1.4   Stack technique — vue d\'ensemble', size: 22 })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),

  // Partie 2
  new Paragraph({
    children: [
      new TextRun({ text: 'PARTIE 2 — ANALYSE DES BESOINS', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 120, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '2.1   Acteurs et rôles', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '2.2   User Stories par fonctionnalité', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '2.3   Règles de gestion', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '2.4   Contraintes techniques et non-fonctionnelles', size: 22 })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),

  // Partie 3
  new Paragraph({
    children: [
      new TextRun({ text: 'PARTIE 3 — CONCEPTION', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 120, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.1   Architecture générale', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.2   Modèle Conceptuel de Données (MCD)', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.3   Modèle Logique de Données (MLD)', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.4   Modèle de classes', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.5   Diagrammes UML (cas d\'utilisation, séquences)', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.6   Maquettes et wireframes', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '3.7   Charte graphique', size: 22 })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),

  // Partie 4
  new Paragraph({
    children: [
      new TextRun({ text: 'PARTIE 4 — RÉALISATION TECHNIQUE', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 120, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '4.1   Justification des choix technologiques', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '4.2   Architecture backend', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '4.3   Architecture frontend', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '4.4   Base de données', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '4.5   Fonctionnalités clés — extraits de code commentés', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '4.6   Infrastructure Docker', size: 22 })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),

  // Partie 5
  new Paragraph({
    children: [
      new TextRun({ text: 'PARTIE 5 — TESTS ET QUALITÉ', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 120, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '5.1   Stratégie de tests', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '5.2   Tests automatisés Jest — résultats', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '5.3   Tests manuels sur émulateur Android', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '5.4   Couverture fonctionnelle', size: 22 })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),

  // Partie 6
  new Paragraph({
    children: [
      new TextRun({ text: 'PARTIE 6 — BILAN ET RÉTROSPECTIVE', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 120, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '6.1   Ce qui a bien fonctionné', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '6.2   Difficultés rencontrées et solutions apportées', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '6.3   Axes d\'amélioration', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: '6.4   Compétences acquises', size: 22 })],
    spacing: { after: 120 },
    indent: { left: 360 },
  }),

  // Annexes
  new Paragraph({
    children: [
      new TextRun({ text: 'ANNEXES', bold: true, size: 24, color: DARK }),
    ],
    spacing: { before: 120, after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'A   Liste complète des endpoints API', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'B   Schéma de base de données complet', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'C   Captures d\'écran de l\'application', size: 22 })],
    spacing: { after: 50 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'D   Résultats Jest complets', size: 22 })],
    spacing: { after: 300 },
    indent: { left: 360 },
  }),

  pageBreak(),
];

// ─── PARTIE 1 — PRÉSENTATION ─────────────────────────────────────────────────

const partie1 = [
  heading1('Partie 1 — Présentation du projet'),

  ...blank(1),

  heading2('1.1  Présentation du candidat'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Je m\'appelle Antonin Cuenot. Ce dossier est réalisé dans le cadre de la validation du titre professionnel Concepteur Développeur d\'Applications (CDA), enregistré au RNCP de niveau 6.',
        size: 22,
      }),
    ],
    spacing: { after: 160 },
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: 'J\'enchaîne ce titre directement après l\'obtention du titre professionnel Développeur Web et Web Mobile (DWWM, niveau 5 RNCP), validé en 2024. Le CDA représente la suite naturelle de cette progression : là où le DWWM couvrait le développement web, le CDA monte en exigence sur la conception logicielle, l\'architecture des applications et la rigueur de la modélisation.',
        size: 22,
      }),
    ],
    spacing: { after: 160 },
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Le projet présenté ici, AnimeTracker, est une application mobile développée de bout en bout : de la base de données jusqu\'à l\'interface utilisateur sur Android. Lors du DWWM, j\'avais présenté un site web — pour ce CDA, j\'avais comme objectif de travailler sur quelque chose de différent et d\'explorer le développement mobile, une compétence que je n\'avais pas encore eu l\'occasion de pratiquer. Le choix du thème des animés n\'est pas anodin non plus : c\'est un univers que je connais bien, ce qui m\'a permis de me concentrer sur les défis techniques sans avoir à chercher les règles métier.',
        size: 22,
      }),
    ],
    spacing: { after: 300 },
  }),

  heading2('1.2  Présentation du projet'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'AnimeTracker est une application mobile destinée aux fans d\'animés. Elle permet de gérer sa bibliothèque personnelle de séries, d\'échanger des avis, de discuter dans des groupes par animé, et de suivre l\'activité d\'autres utilisateurs.',
        size: 22,
      }),
    ],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [
      new TextRun({
        text: 'L\'idée est simple : au lieu de jongler entre plusieurs sites pour noter ses animés, voir les avis des autres ou chercher des gens avec les mêmes goûts, tout se passe dans une seule application. Les données des animés (titres, synopsis, affiches, notes) viennent de l\'API publique Jikan, qui agrège les informations de MyAnimeList.',
        size: 22,
      }),
    ],
    spacing: { after: 300 },
  }),

  heading2('1.3  Objectifs et périmètre fonctionnel'),

  new Paragraph({
    children: [new TextRun({ text: 'L\'application couvre les fonctionnalités suivantes :', size: 22 })],
    spacing: { after: 100 },
  }),

  bullet('Authentification sécurisée (inscription, connexion, déconnexion avec invalidation de token)'),
  bullet('Bibliothèque personnelle — ajouter un animé, suivre son avancement épisode par épisode, définir un statut (en cours, terminé, abandonné...), marquer en favori'),
  bullet('Avis — rédiger une critique publique ou privée, noter de 1 à 10, liker les avis des autres'),
  bullet('Messagerie privée — conversations directes entre utilisateurs'),
  bullet('Groupes de discussion — un groupe par animé, rejoint librement'),
  bullet('Social — s\'abonner à d\'autres utilisateurs, consulter leurs profils et bibliothèques'),
  bullet('Profil utilisateur — modifier son pseudo, sa bio, son mot de passe, voir ses statistiques'),

  ...blank(1),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Ce qui est volontairement hors périmètre : la modération de contenu, les notifications push en temps réel, l\'upload d\'avatar personnalisé, et la version iOS (développée uniquement sur émulateur Android pour ce projet).',
        size: 22,
        italics: true,
        color: GRAY,
      }),
    ],
    spacing: { after: 300 },
  }),

  heading2('1.4  Stack technique — vue d\'ensemble'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'L\'application est construite sur une architecture client-serveur classique, avec une séparation nette entre l\'application mobile et l\'API backend.',
        size: 22,
      }),
    ],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'Frontend mobile', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  subBullet('React Native + Expo — application multiplateforme (Android/iOS)'),
  subBullet('TypeScript — typage statique sur l\'ensemble du frontend'),
  subBullet('Redux Toolkit — gestion de l\'état global de l\'application'),
  subBullet('React Navigation — navigation entre écrans (Stack + Bottom Tabs)'),
  subBullet('Axios — client HTTP avec gestion automatique des tokens JWT'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Backend API REST', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  subBullet('Node.js + Express — serveur HTTP léger et rapide'),
  subBullet('TypeScript — typage statique côté serveur'),
  subBullet('Sequelize — ORM pour interagir avec PostgreSQL'),
  subBullet('Zod — validation des données entrantes'),
  subBullet('JSON Web Token (JWT) — authentification sans état'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Infrastructure', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  subBullet('PostgreSQL — base de données relationnelle principale'),
  subBullet('Redis — cache pour la blacklist des tokens invalidés'),
  subBullet('Docker + docker-compose — environnement de développement reproductible'),

  ...blank(2),

  pageBreak(),
];

// ─── HELPERS TABLEAU ─────────────────────────────────────────────────────────

const makeTable = (headers, rows, colWidths) => {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill: '1E1B4B', type: ShadingType.CLEAR, color: '1E1B4B' },
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })],
          spacing: { before: 60, after: 60 },
        })],
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? 'F5F3FF' : 'FFFFFF', type: ShadingType.CLEAR },
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 18, font: 'Calibri' })],
            spacing: { before: 60, after: 60 },
          })],
        })
      ),
    })
  );

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
  });
};

// ─── VEILLE TECHNOLOGIQUE ────────────────────────────────────────────────────

const partieVeille = [
  heading1('Veille technologique'),

  new Paragraph({
    children: [new TextRun({
      text: 'Avant de démarrer le développement d\'AnimeTracker, j\'ai effectué une veille technologique pour identifier les outils et frameworks les mieux adaptés au projet. Cette veille couvre les choix clés : le framework mobile, le backend, la base de données, l\'authentification, la gestion d\'état et l\'ORM.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 1. Framework mobile ──
  heading2('1.  Développement mobile — React Native vs les alternatives'),

  new Paragraph({
    children: [new TextRun({
      text: 'L\'objectif étant de produire une application mobile Android (avec portabilité iOS possible), plusieurs approches ont été comparées.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Framework', 'Langage', 'Avantages', 'Inconvénients'],
    [
      ['React Native', 'JavaScript / TypeScript', 'Code unique Android + iOS, large communauté, écosystème npm, composants natifs réels', 'Performances légèrement inférieures au 100% natif, modules natifs parfois complexes'],
      ['Flutter', 'Dart', 'Performances excellentes, rendu cohérent, widgets personnalisés', 'Langage Dart peu répandu, taille des APK plus lourde, écosystème plus jeune'],
      ['Ionic / Capacitor', 'HTML/CSS/JS', 'Réutilise les compétences web, rapide à démarrer', 'Rendu WebView (pas natif), performances limitées, look moins natif'],
      ['Développement natif', 'Kotlin (Android) Swift (iOS)', 'Performances maximales, accès total aux APIs', 'Deux bases de code distinctes à maintenir, temps de développement doublé'],
      ['Progressive Web App', 'HTML/CSS/JS', 'Pas d\'installation requise, simple à déployer', 'Accès limité aux APIs natives, pas distribué via les stores'],
    ],
    [1800, 1600, 2800, 2800]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : React Native + Expo', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'React Native s\'impose comme le choix le plus cohérent : une seule base de code TypeScript pour Android et iOS, un écosystème mature (Meta, Microsoft, Shopify l\'utilisent en production), et surtout une continuité directe avec mes compétences JavaScript acquises pendant le DWWM. Expo ajoute un outillage qui accélère considérablement le démarrage sans sacrifier la flexibilité.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 2. Backend ──
  heading2('2.  Backend — Node.js/Express vs les alternatives'),

  makeTable(
    ['Framework', 'Langage', 'Avantages', 'Inconvénients'],
    [
      ['Node.js + Express', 'JavaScript / TypeScript', 'Même langage que le frontend, event-loop non bloquant, écosystème npm immense, minimaliste', 'Peu structuré (liberté = responsabilité d\'organisation)'],
      ['NestJS', 'TypeScript', 'Architecture très structurée (modules, décorateurs), inspiré d\'Angular', 'Verbeux, complexe pour un projet de taille moyenne, courbe d\'apprentissage élevée'],
      ['Django / FastAPI', 'Python', 'Rapide à développer, Django très complet out-of-the-box', 'Langage différent du frontend, perd la cohérence full-JS'],
      ['Spring Boot', 'Java', 'Robuste, très utilisé en entreprise, typage fort', 'Verbeux, démarrage lent, lourd pour une API REST simple'],
      ['Laravel', 'PHP', 'Complet, bonnes conventions, écosystème riche', 'PHP peu valorisé en mobile, langage différent du frontend'],
    ],
    [1900, 1400, 3000, 2700]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : Node.js + Express + TypeScript', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Le principal avantage de Node.js est la cohérence full-stack : TypeScript des deux côtés, interfaces partagées, une seule compétence de langage couvre le projet entier. Express a été préféré à NestJS car sa simplicité correspond à la taille du projet — NestJS aurait introduit de la complexité architecturale sans valeur ajoutée à ce stade.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 3. Base de données ──
  heading2('3.  Base de données — PostgreSQL vs les alternatives'),

  makeTable(
    ['SGBD', 'Type', 'Avantages', 'Inconvénients'],
    [
      ['PostgreSQL', 'Relationnel (SQL)', 'ACID, relations complexes, UUID natif, types ENUM, performances excellentes, open source', 'Schéma rigide (mais c\'est un avantage ici)'],
      ['MySQL / MariaDB', 'Relationnel (SQL)', 'Très répandu, performances solides, grande communauté', 'Moins de types natifs avancés, ENUM moins flexible'],
      ['MongoDB', 'NoSQL (documents)', 'Flexibilité du schéma, facile à démarrer, JSON natif', 'Jointures complexes coûteuses, cohérence ACID limitée, mauvais choix si les données sont relationnelles'],
      ['SQLite', 'Relationnel embarqué', 'Zéro configuration, idéal pour mobile en local', 'Non adapté à un backend multi-utilisateurs'],
      ['Supabase', 'PostgreSQL managé', 'BaaS complet, auth intégrée, réaltime', 'Dépendance à un service tiers, moins de contrôle'],
    ],
    [1700, 1500, 3000, 2800]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : PostgreSQL', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Le modèle de données d\'AnimeTracker est fortement relationnel — utilisateurs, animés, avis, abonnements, messages : tout est lié par des clés étrangères et des contraintes d\'intégrité. MongoDB aurait été un mauvais choix ici car la flexibilité des documents ne compense pas la perte des jointures et des contraintes. PostgreSQL est aussi le standard recommandé pour les projets CDA, et son support natif des UUID et des types ENUM renforce l\'intégrité des données directement au niveau base.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 4. Authentification ──
  heading2('4.  Authentification — JWT vs les alternatives'),

  makeTable(
    ['Mécanisme', 'Principe', 'Avantages', 'Inconvénients'],
    [
      ['JWT (JSON Web Token)', 'Token signé, stocké côté client', 'Stateless, scalable, idéal pour mobile, vérification sans BDD', 'Révocation complexe (nécessite une blacklist)'],
      ['Sessions serveur', 'ID de session côté serveur (Redis/BDD)', 'Révocation immédiate simple, contrôle total', 'Stateful, nécessite un stockage partagé entre serveurs'],
      ['OAuth 2.0 (Google, GitHub...)', 'Délégation à un fournisseur tiers', 'UX simplifiée (pas de mot de passe), sécurité déléguée', 'Dépendance à un service externe, implémentation complexe'],
      ['Passport.js', 'Middleware d\'authentification Node', 'Compatible JWT + OAuth, nombreuses stratégies disponibles', 'Surcouche supplémentaire, complexité accrue'],
    ],
    [2000, 1800, 2800, 2400]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : JWT + blacklist Redis', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'JWT est la solution la plus adaptée aux applications mobiles : le token est stocké localement (SecureStore d\'Expo), chaque requête est auto-suffisante sans aller-retour en base pour vérifier la session. Le seul inconvénient de JWT — la difficulté à révoquer un token — est résolu par la blacklist Redis : à la déconnexion, le token est invalide immédiatement et reste en mémoire Redis jusqu\'à son expiration naturelle.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 5. Gestion d'état ──
  heading2('5.  Gestion d\'état frontend — Redux vs les alternatives'),

  makeTable(
    ['Solution', 'Avantages', 'Inconvénients', 'Adapté si...'],
    [
      ['Redux Toolkit', 'Standard de l\'industrie, DevTools puissants, optimisation fine des re-renders, AsyncThunk intégré', 'Boilerplate plus important, courbe d\'apprentissage', 'Application complexe avec beaucoup d\'états partagés'],
      ['Zustand', 'Minimaliste, API simple, peu de boilerplate', 'Moins structuré, DevTools limités', 'Petite application, état simple'],
      ['MobX', 'Réactivité automatique, moins de code', 'Magie implicite, debug parfois difficile', 'Préférence pour le style orienté-objet'],
      ['Context API (React)', 'Natif React, aucune dépendance', 'Re-renders en cascade, pas optimisé pour gros état', 'État simple, peu de composants concernés'],
      ['React Query / TanStack', 'Gestion cache serveur excellente', 'Ne gère pas l\'état UI local, dépendance supplémentaire', 'Applications data-fetching intensif'],
    ],
    [1600, 2600, 2200, 2600]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : Redux Toolkit', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'AnimeTracker gère plusieurs domaines d\'état interdépendants (auth, bibliothèque, avis, social, messagerie, groupes). Redux Toolkit est la solution la plus adaptée à cette complexité : les slices organisent l\'état par domaine, les AsyncThunk standardisent les appels API, et Redux DevTools permettent d\'inspecter chaque action en développement. Zustand aurait été insuffisant pour gérer les interactions entre slices.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 6. ORM ──
  heading2('6.  ORM — Sequelize vs les alternatives'),

  makeTable(
    ['ORM', 'Avantages', 'Inconvénients'],
    [
      ['Sequelize', 'Mature, supporte PostgreSQL/MySQL/SQLite, migrations, associations, bonne documentation', 'API parfois verbeuse, typage TypeScript à configurer manuellement'],
      ['Prisma', 'DX excellente, schéma déclaratif, typage TypeScript automatique et précis', 'Génération de client nécessaire, moins flexible sur les requêtes complexes'],
      ['TypeORM', 'Decorateurs TypeScript, familier si Angular, migrations', 'Bugs connus, maintenance ralentie, moins stable que Sequelize'],
      ['Knex.js (query builder)', 'Contrôle SQL total, performances maximales', 'Pas d\'abstraction objet, plus de code SQL à écrire manuellement'],
      ['SQL brut (pg)', 'Performances maximales, contrôle absolu', 'Pas de protection injection automatique, verbeux, risqué'],
    ],
    [1800, 3400, 3800]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : Sequelize', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Sequelize est l\'ORM le plus établi de l\'écosystème Node.js. Malgré une syntaxe parfois plus verbale que Prisma, il offre une maturité et une stabilité éprouvées. Son système d\'associations (hasMany, belongsTo, belongsToMany) mappe parfaitement le modèle relationnel d\'AnimeTracker. Les requêtes paramétrées automatiques protègent contre les injections SQL sans effort supplémentaire.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 7. Infrastructure ──
  heading2('7.  Infrastructure — Docker vs les alternatives'),

  makeTable(
    ['Approche', 'Avantages', 'Inconvénients'],
    [
      ['Docker + docker-compose', 'Environnement reproductible, isolation des services, version des dépendances fixée, proche de la production', 'Overhead mémoire, complexité initiale, problème inotify sur Windows'],
      ['Installation locale native', 'Simple, performances natives, pas de surcharge VM', '"Ça marche sur ma machine" — non reproductible entre développeurs'],
      ['Services cloud (Supabase, Railway)', 'Zéro configuration serveur, scalabilité automatique', 'Dépendance externe, coûts potentiels, moins de contrôle'],
      ['Machines virtuelles', 'Isolation complète, proche production', 'Lentes à démarrer, consommatrices de ressources'],
    ],
    [2200, 3400, 3400]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({ text: 'Choix retenu : Docker + docker-compose', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Docker garantit que l\'environnement est identique quelle que soit la machine. PostgreSQL 15-alpine et Redis 7-alpine dans des conteneurs versionnés évitent les conflits avec des installations locales. Le docker-compose.yml devient à lui seul la documentation de l\'infrastructure — un développeur qui rejoint le projet n\'a besoin que de Docker et d\'un fichier .env pour démarrer.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── Synthèse ──
  heading2('Synthèse des choix technologiques'),

  makeTable(
    ['Domaine', 'Technologie retenue', 'Principale raison du choix'],
    [
      ['Application mobile', 'React Native + Expo', 'Code unique Android/iOS, cohérence TypeScript avec le backend'],
      ['Backend API', 'Node.js + Express', 'Même langage que le frontend, event-loop adapté aux APIs REST'],
      ['Base de données', 'PostgreSQL', 'Données relationnelles, contraintes d\'intégrité, UUID natifs'],
      ['Cache / blacklist', 'Redis', 'Vérification JWT ultra-rapide en mémoire'],
      ['Authentification', 'JWT + blacklist Redis', 'Stateless, idéal pour mobile, révocation possible'],
      ['Gestion d\'état', 'Redux Toolkit', 'Complexité multi-domaine, DevTools, AsyncThunk'],
      ['ORM', 'Sequelize', 'Maturité, associations, protection injection SQL'],
      ['Infrastructure', 'Docker + docker-compose', 'Reproductibilité, isolation des services'],
      ['Typage', 'TypeScript (full-stack)', 'Détection d\'erreurs à la compilation, documentation vivante'],
    ],
    [2000, 2500, 4500]
  ),

  ...blank(2),

  pageBreak(),
];

// ─── PARTIE 2 — ANALYSE DES BESOINS ──────────────────────────────────────────

const partie2 = [
  heading1('Partie 2 — Analyse des besoins'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Avant d\'écrire la moindre ligne de code, il était nécessaire de bien définir ce que l\'application devait faire — et pour qui. Cette partie décrit les acteurs impliqués, les fonctionnalités attendues sous forme de user stories, les règles qui régissent les données, et les contraintes à respecter.',
        size: 22,
      }),
    ],
    spacing: { after: 300 },
  }),

  heading2('2.1  Acteurs et rôles'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'L\'application distingue plusieurs types d\'utilisateurs, chacun avec des droits et des usages différents.',
        size: 22,
      }),
    ],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Acteur', 'Description', 'Accès'],
    [
      ['Visiteur', 'Utilisateur non connecté', 'Consultation du catalogue uniquement'],
      ['Utilisateur', 'Compte créé et connecté', 'Toutes les fonctionnalités de l\'application'],
      ['Modérateur', 'Utilisateur avec droits élargis', 'Gestion des groupes de discussion'],
      ['Administrateur', 'Gestion complète', 'Modération, suspension de comptes, signalements'],
      ['Jikan API', 'Système externe (MyAnimeList)', 'Fournisseur des données animés (lecture seule)'],
    ],
    [2000, 3500, 3500]
  ),

  ...blank(2),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Le rôle ADMIN dispose d\'un panneau d\'administration complet (stats globales, gestion des utilisateurs, modération des avis et des messages de groupe). L\'accès est sécurisé par le middleware requireRole(\'ADMIN\') — toute tentative d\'accès par un non-admin retourne une erreur 403.',
        size: 22,
        italics: true,
        color: GRAY,
      }),
    ],
    spacing: { after: 300 },
  }),

  heading2('2.2  User Stories par fonctionnalité'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Les user stories sont organisées par domaine fonctionnel. Chaque story suit le format : "En tant que [acteur], je veux [action] afin de [objectif]". La colonne Priorité indique si la fonctionnalité fait partie du MVP (Haute), de la v1.5 (Moyenne) ou d\'une version future (Basse).',
        size: 22,
      }),
    ],
    spacing: { after: 200 },
  }),

  heading3('A. Authentification et profil'),

  makeTable(
    ['ID', 'Priorité', 'En tant que', 'Je veux', 'Critères clés'],
    [
      ['US01', 'Haute', 'Visiteur', 'Créer un compte', 'Email unique, mot de passe min. 8 caractères'],
      ['US02', 'Haute', 'Utilisateur', 'Me connecter', 'JWT, session persistante, message d\'erreur clair'],
      ['US03', 'Haute', 'Utilisateur', 'Me déconnecter', 'Token invalidé immédiatement (blacklist Redis)'],
      ['US04', 'Moyenne', 'Utilisateur', 'Modifier mon profil', 'Pseudo unique, bio max 500 caractères'],
      ['US06', 'Moyenne', 'Utilisateur', 'Voir le profil d\'un autre', 'Pseudo, bio, stats, avis publics uniquement'],
    ],
    [700, 900, 1400, 2200, 3800]
  ),

  ...blank(2),

  heading3('B. Bibliothèque personnelle'),

  makeTable(
    ['ID', 'Priorité', 'En tant que', 'Je veux', 'Critères clés'],
    [
      ['US11', 'Haute', 'Utilisateur', 'Ajouter un animé à ma liste', 'Ajout en 1 clic, statut "À voir" par défaut'],
      ['US12', 'Haute', 'Utilisateur', 'Marquer "En cours"', 'Activation du suivi épisode par épisode'],
      ['US13', 'Haute', 'Utilisateur', 'Marquer "Terminé"', 'Date de fin enregistrée, historique conservé'],
      ['US14', 'Moyenne', 'Utilisateur', 'Marquer "Abandonné"', 'Possibilité de reprendre plus tard'],
      ['US15', 'Haute', 'Utilisateur', 'Suivre ma progression', 'Compteur épisodes vus / total, mis à jour manuellement'],
      ['US16', 'Moyenne', 'Utilisateur', 'Voir mes statistiques', 'Temps total, nombre d\'animés, note moyenne'],
    ],
    [700, 900, 1400, 2200, 3800]
  ),

  ...blank(2),

  heading3('C. Avis et évaluations'),

  makeTable(
    ['ID', 'Priorité', 'En tant que', 'Je veux', 'Critères clés'],
    [
      ['US17', 'Haute', 'Utilisateur', 'Noter un animé (sur 10)', 'Note de 1 à 10, modifiable'],
      ['US18', 'Haute', 'Utilisateur', 'Écrire un avis', 'Texte libre, max 2000 caractères'],
      ['US19', 'Haute', 'Utilisateur', 'Choisir la visibilité', 'Public ou privé, privé par défaut'],
      ['US20', 'Moyenne', 'Utilisateur', 'Modifier ou supprimer mon avis', 'Édition libre, suppression avec confirmation'],
      ['US21', 'Moyenne', 'Utilisateur', 'Liker un avis public', '1 like max par utilisateur, compteur visible'],
    ],
    [700, 900, 1400, 2200, 3800]
  ),

  ...blank(2),

  heading3('D. Messagerie privée'),

  makeTable(
    ['ID', 'Priorité', 'En tant que', 'Je veux', 'Critères clés'],
    [
      ['US25', 'Moyenne', 'Utilisateur', 'Envoyer un message privé', 'Texte uniquement, horodatage'],
      ['US26', 'Moyenne', 'Utilisateur', 'Lire mes conversations', 'Liste des conversations, historique complet'],
      ['US27', 'Basse', 'Utilisateur', 'Supprimer une conversation', 'Suppression côté utilisateur, confirmation obligatoire'],
    ],
    [700, 900, 1400, 2200, 3800]
  ),

  ...blank(2),

  heading3('E. Groupes de discussion'),

  makeTable(
    ['ID', 'Priorité', 'En tant que', 'Je veux', 'Critères clés'],
    [
      ['US28', 'Moyenne', 'Utilisateur', 'Rejoindre le groupe d\'un animé', '1 groupe officiel par animé, rejoint en 1 clic'],
      ['US32', 'Moyenne', 'Utilisateur', 'Publier un message dans le groupe', 'Max 1000 caractères, horodatage, auteur visible'],
      ['US33', 'Moyenne', 'Utilisateur', 'Lire les messages du groupe', 'Affichage chronologique, scroll infini'],
      ['US34', 'Basse', 'Utilisateur', 'Quitter un groupe', 'Possibilité de rejoindre à nouveau'],
    ],
    [700, 900, 1400, 2200, 3800]
  ),

  ...blank(2),

  heading3('F. Social — abonnements'),

  makeTable(
    ['ID', 'Priorité', 'En tant que', 'Je veux', 'Critères clés'],
    [
      ['US22', 'Moyenne', 'Utilisateur', 'Suivre un autre utilisateur', 'Bouton "S\'abonner" sur son profil'],
      ['US23', 'Moyenne', 'Utilisateur', 'Ne plus suivre un utilisateur', 'Bouton "Se désabonner", pas de notification'],
      ['US24', 'Basse', 'Utilisateur', 'Voir mes abonnés / abonnements', 'Deux listes séparées, liens vers profils'],
    ],
    [700, 900, 1400, 2200, 3800]
  ),

  ...blank(2),

  heading2('2.3  Règles de gestion'),

  new Paragraph({
    children: [
      new TextRun({
        text: 'Ces règles définissent les contraintes métier appliquées dans l\'ensemble de l\'application. Elles ont guidé les choix d\'implémentation côté backend.',
        size: 22,
      }),
    ],
    spacing: { after: 200 },
  }),

  bullet('Les avis sont privés par défaut — un utilisateur doit explicitement choisir de rendre son avis public. Cela évite la publication accidentelle de données personnelles.'),
  bullet('Un seul avis par utilisateur et par animé — si l\'utilisateur rédige un nouvel avis, il remplace le précédent (upsert).'),
  bullet('Un seul groupe officiel par animé — créé automatiquement à la première demande d\'adhésion. Il ne peut pas être supprimé.'),
  bullet('Les données des animés (titre, synopsis, affiches, note) ne sont jamais stockées localement de façon permanente — elles sont toujours récupérées depuis l\'API Jikan au moment de l\'affichage.'),
  bullet('Un utilisateur ne peut pas se suivre lui-même — cette action retourne une erreur 400.'),
  bullet('Un token JWT invalidé (déconnexion) est placé en blacklist Redis jusqu\'à sa date d\'expiration naturelle — cela garantit qu\'un token volé après déconnexion ne peut plus être utilisé.'),
  bullet('Les mots de passe sont hachés avec bcrypt (coût 10) avant tout stockage — le mot de passe en clair n\'est jamais conservé.'),
  bullet('Toutes les routes de l\'API (sauf /auth/register et /auth/login) nécessitent un token JWT valide dans l\'en-tête Authorization.'),

  ...blank(1),

  heading2('2.4  Contraintes techniques et non-fonctionnelles'),

  heading3('Sécurité'),
  bullet('Rate limiting sur les routes d\'authentification (max 20 requêtes / 15 minutes par IP) — protection contre les attaques par force brute.'),
  bullet('Validation stricte de toutes les données entrantes avec Zod — aucune donnée non validée ne passe dans la base.'),
  bullet('En-têtes de sécurité HTTP gérés par Helmet (Express).'),
  bullet('CORS configuré pour n\'accepter que les origines autorisées.'),

  heading3('Performance'),
  bullet('Redis utilisé comme cache pour la blacklist JWT — la vérification d\'un token ne génère pas de requête SQL.'),
  bullet('Les appels à l\'API Jikan sont faits directement depuis le client mobile — le backend n\'est pas un proxy inutile pour ces données.'),

  heading3('Maintenabilité'),
  bullet('TypeScript sur l\'ensemble du projet (frontend et backend) — les erreurs de type sont détectées à la compilation, pas en production.'),
  bullet('Pattern Controllers / Services côté backend — la logique métier est isolée des routes HTTP, ce qui facilite les tests unitaires.'),
  bullet('Tous les modèles Sequelize sont mockés dans les tests — aucune connexion réelle à la base de données n\'est nécessaire pour faire tourner la suite Jest.'),

  heading3('Environnement de développement'),
  bullet('L\'ensemble de l\'infrastructure (PostgreSQL + Redis + backend) est conteneurisé avec Docker — un seul "docker compose up" suffit à démarrer l\'environnement complet.'),
  bullet('L\'émulateur Android utilise l\'adresse 10.0.2.2 pour accéder au backend sur la machine hôte (équivalent de localhost depuis l\'émulateur).'),

  ...blank(2),

  pageBreak(),
];

// ─── PARTIE 3 — CONCEPTION ───────────────────────────────────────────────────

const imgPara = (file, w, h) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 160 },
    children: [
      new ImageRun({
        data: readFileSync(file),
        transformation: { width: w, height: h },
      }),
    ],
  });

const codeBlock = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 18, color: '1E1B4B' })],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  });

const codeScreen = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: 'Courier New', size: 18, color: '1E293B' })],
    spacing: { before: 40, after: 40 },
    indent: { left: 360, right: 360 },
    shading: { type: ShadingType.SOLID, color: 'F1F5F9', fill: 'F1F5F9' },
  });

const partie3 = [
  heading1('Partie 3 — Conception'),

  new Paragraph({
    children: [new TextRun({
      text: 'Cette partie couvre les choix d\'architecture et les modèles produits avant et pendant le développement : organisation des couches, structure de la base de données, modèle de classes, diagrammes UML, maquettes et charte graphique.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── 3.1 Architecture générale ──
  heading2('3.1  Architecture générale'),

  new Paragraph({
    children: [new TextRun({
      text: 'AnimeTracker repose sur une architecture client-serveur en trois couches distinctes : le client mobile, l\'API backend et la couche données. Cette séparation permet de faire évoluer chaque couche indépendamment.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Couche', 'Technologie', 'Rôle'],
    [
      ['Client mobile', 'React Native + Expo', 'Interface utilisateur, navigation, appels API'],
      ['API REST', 'Node.js + Express', 'Logique métier, authentification, validation'],
      ['Données', 'PostgreSQL + Redis', 'Persistance relationnelle + cache JWT'],
    ],
    [2200, 2800, 4000]
  ),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({ text: 'Organisation du backend — pattern en trois niveaux :', bold: true, size: 22 })],
    spacing: { after: 100 },
  }),

  bullet('Routes (Express) — reçoivent les requêtes HTTP, appliquent les middlewares, délèguent au controller'),
  bullet('Controllers — extraient les paramètres de la requête, appellent le service, formatent la réponse'),
  bullet('Services — contiennent toute la logique métier, accèdent à la base via les modèles Sequelize'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Ce découpage garantit que la logique métier est indépendante du transport HTTP, ce qui facilite les tests unitaires : les services sont testables sans démarrer le serveur.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'Flux d\'une requête authentifiée :', bold: true, size: 22 })],
    spacing: { after: 100 },
  }),

  codeBlock('Client mobile'),
  codeBlock('  → POST /auth/login  {email, password}'),
  codeBlock('  → Middleware Zod : valide le corps de la requête'),
  codeBlock('  → Middleware authenticate : vérifie le JWT (sauf /auth/*)'),
  codeBlock('  → Controller : extrait les paramètres'),
  codeBlock('  → Service : hash, compare, génère le token'),
  codeBlock('  → Réponse : { success: true, data: { token, user } }'),

  ...blank(2),

  // ── 3.2 MCD ──
  heading2('3.2  Modèle Conceptuel de Données (MCD)'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le MCD identifie les entités métier et leurs relations avant de penser à la structure SQL. AnimeTracker repose sur 9 entités principales.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Entité', 'Description', 'Relations principales'],
    [
      ['User', 'Compte utilisateur', 'Possède des UserAnime, des Review, des Follow, des Message'],
      ['Anime', 'Cache des données Jikan', 'Suivi par des UserAnime, évalué par des Review, lié à un Group'],
      ['UserAnime', 'Animé dans la bibliothèque', 'Lie User et Anime avec statut et progression'],
      ['Review', 'Avis sur un animé', 'Lie User et Anime, peut être liké via ReviewLike'],
      ['ReviewLike', 'Like d\'un avis', 'Lie User et Review (contrainte d\'unicité)'],
      ['Follow', 'Abonnement entre users', 'Lie User (suiveur) et User (suivi)'],
      ['Conversation', 'Messagerie privée', 'Contient des Message, a des ConversationParticipant'],
      ['Group', 'Groupe de discussion', 'Lié à un Anime, contient des GroupMember et GroupMessage'],
      ['Message / GroupMessage', 'Messages des conversations/groupes', 'Liés à leur conteneur respectif'],
    ],
    [1800, 2200, 5000]
  ),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({
      text: 'Relations clés :',
      bold: true,
      size: 22,
    })],
    spacing: { after: 100 },
  }),

  bullet('User ↔ Anime : relation N:N via UserAnime (un utilisateur peut avoir plusieurs animés, un animé peut être dans plusieurs bibliothèques)'),
  bullet('User ↔ User : relation N:N réflexive via Follow (un utilisateur peut suivre plusieurs autres utilisateurs)'),
  bullet('User ↔ Review : relation 1:N avec contrainte d\'unicité (un seul avis par utilisateur par animé)'),
  bullet('Anime ↔ Group : relation 1:1 pour les groupes officiels (un groupe officiel maximum par animé)'),

  ...blank(2),

  // ── 3.3 MLD ──
  heading2('3.3  Modèle Logique de Données (MLD)'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le MLD traduit le MCD en tables SQL concrètes avec leurs types, clés primaires (UUID sauf pour les animés) et contraintes de clés étrangères.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'Pourquoi des UUID et non des entiers auto-incrémentés ?', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 100 },
  }),

  new Paragraph({
    children: [new TextRun({
      text: 'Les UUID (Universally Unique Identifiers) présentent deux avantages pour ce projet : ils ne révèlent pas le volume de données (un id=42 indique qu\'il y a au moins 42 utilisateurs en base) et ils permettent de générer des identifiants côté client sans risque de collision. Les animés utilisent toutefois l\'entier fourni par Jikan/MyAnimeList, car c\'est le référentiel partagé.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Table', 'Clé primaire', 'Colonnes principales', 'Clés étrangères'],
    [
      ['users', 'id_user (UUID)', 'email, password, pseudo, bio, role, avatar, is_active', '—'],
      ['user_anime', 'id_user_anime (UUID)', 'status, episodes_watched, is_favorite, started_at, completed_at', 'id_user → users, id_anime → animes'],
      ['animes', 'id_anime (Integer)', 'title, synopsis, image_url, episodes, score, status', '—'],
      ['reviews', 'id_review (UUID)', 'rating, comment, visibility, likes_count', 'id_user → users, id_anime → animes'],
      ['review_likes', 'id_like (UUID)', 'created_at', 'id_review → reviews, id_user → users'],
      ['follows', 'id_follow (UUID)', 'created_at', 'id_follower → users, id_following → users'],
      ['conversations', 'id_conversation (UUID)', 'created_at, updated_at', '—'],
      ['conversation_participants', 'id_participant (UUID)', 'joined_at', 'id_conversation → conversations, id_user → users'],
      ['messages', 'id_message (UUID)', 'content, is_read, created_at', 'id_conversation → conversations, id_sender → users'],
      ['groups', 'id_group (UUID)', 'name, type (OFFICIEL/PERSONNALISE), is_public', 'id_anime → animes, id_creator → users'],
      ['group_members', 'id_member (UUID)', 'is_moderator, joined_at', 'id_group → groups, id_user → users'],
      ['group_messages', 'id_message (UUID)', 'content, created_at', 'id_group → groups, id_sender → users'],
    ],
    [1800, 2000, 2600, 2600]
  ),

  ...blank(2),

  // ── 3.4 Modèle de classes ──
  heading2('3.4  Modèle de classes'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le modèle de classes représente les entités du domaine avec leurs attributs, méthodes et relations. Les classes principales sont User, UserAnime, Review, Follow, Conversation, Message, Group et GroupMessage.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  imgPara('./diagrams/uml-classes.png', 520, 285),

  ...blank(1),

  heading3('Classe User'),
  new Paragraph({
    children: [new TextRun({ text: 'Attributs : ', bold: true, size: 22 })],
    spacing: { after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'id (UUID), email (unique), password (hash bcrypt), pseudo (unique), bio (max 500 car.), role (USER | MODERATEUR | ADMIN), avatar (index couleur), isActive, createdAt', size: 20, font: 'Courier New', color: '1E1B4B' })],
    spacing: { after: 100 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Méthodes : ', bold: true, size: 22 })],
    spacing: { after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'register(), login() → JWT, logout() → blacklist, updateProfile(), changePassword(), follow(userId), unfollow(userId), getStatistics()', size: 20, font: 'Courier New', color: '1E1B4B' })],
    spacing: { after: 200 },
    indent: { left: 360 },
  }),

  heading3('Classe Review'),
  new Paragraph({
    children: [new TextRun({ text: 'Attributs : ', bold: true, size: 22 })],
    spacing: { after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'id, userId, animeId, rating (1-10), comment (max 2000 car.), visibility (PUBLIC | PRIVE), likesCount, createdAt, updatedAt', size: 20, font: 'Courier New', color: '1E1B4B' })],
    spacing: { after: 100 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Contraintes : ', bold: true, size: 22 })],
    spacing: { after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Une seule review par (userId, animeId) — implémenté en UNIQUE CONSTRAINT SQL et en upsert côté service.', size: 22, italics: true, color: GRAY })],
    spacing: { after: 200 },
  }),

  heading3('Classe Group'),
  new Paragraph({
    children: [new TextRun({ text: 'Attributs : ', bold: true, size: 22 })],
    spacing: { after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'id, animeId, name, type (OFFICIEL | PERSONNALISE), isPublic, creatorId, memberCount, createdAt', size: 20, font: 'Courier New', color: '1E1B4B' })],
    spacing: { after: 100 },
    indent: { left: 360 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Contraintes : ', bold: true, size: 22 })],
    spacing: { after: 60 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Les groupes OFFICIEL ne peuvent pas être supprimés — cette règle est appliquée au niveau du service, pas de la base de données.', size: 22, italics: true, color: GRAY })],
    spacing: { after: 300 },
  }),

  // ── 3.5 Diagrammes UML ──
  heading2('3.5  Diagrammes UML'),

  heading3('Diagramme de cas d\'utilisation'),

  new Paragraph({
    children: [new TextRun({
      text: 'Ce diagramme représente l\'ensemble des fonctionnalités accessibles par chaque acteur. Le Visiteur (non connecté) peut uniquement rechercher des animés. L\'Utilisateur connecté accède à toutes les fonctionnalités. La Jikan API est un système externe sollicité pour les données des animés.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  imgPara('./diagrams/uml-cas-utilisation.png', 370, 494),

  ...blank(1),

  heading3('Diagramme de séquence — Connexion (login)'),

  new Paragraph({
    children: [new TextRun({
      text: 'Flux complet d\'une connexion : validation Zod, vérification bcrypt, génération du JWT et stockage sécurisé côté mobile.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  imgPara('./diagrams/uml-seq-login.png', 430, 494),

  ...blank(1),

  heading3('Diagramme de séquence — Ajout d\'un animé à la bibliothèque'),

  new Paragraph({
    children: [new TextRun({
      text: 'L\'app récupère d\'abord les données de l\'animé depuis Jikan, puis envoie la demande d\'ajout au backend qui effectue un UPSERT en base.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  imgPara('./diagrams/uml-seq-bibliotheque.png', 490, 442),

  ...blank(1),

  heading3('Diagramme de séquence — Envoi d\'un message privé'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le backend vérifie que l\'expéditeur est bien participant de la conversation avant d\'insérer le message en base.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  imgPara('./diagrams/uml-seq-message.png', 510, 426),

  ...blank(1),

  // ── 3.6 Maquettes ──
  heading2('3.6  Maquettes et wireframes'),

  new Paragraph({
    children: [new TextRun({
      text: 'Les maquettes ci-dessous représentent les 5 écrans principaux de l\'application. Elles ont été produites pour valider la navigation, la hiérarchie visuelle et l\'organisation des informations avant développement. La palette violette (#8B5CF6) et la barre de navigation en bas sont les éléments identitaires de l\'interface.',
      size: 22,
    })],
    spacing: { after: 240 },
  }),

  // Maquettes 2 par ligne
  // Ligne 1 : Login + Home
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({ data: readFileSync('./mockups/mockup-01-login.png'),    transformation: { width: 195, height: 422 } }),
      new TextRun({ text: '    ' }),
      new ImageRun({ data: readFileSync('./mockups/mockup-02-home.png'),     transformation: { width: 195, height: 422 } }),
    ],
    spacing: { after: 80 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: 'Connexion', size: 20, bold: true, color: DARK }),
      new TextRun({ text: '                                                              ' }),
      new TextRun({ text: 'Accueil', size: 20, bold: true, color: DARK }),
    ],
    spacing: { after: 240 },
  }),

  // Ligne 2 : Fiche animé + Bibliothèque
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({ data: readFileSync('./mockups/mockup-03-detail.png'),   transformation: { width: 195, height: 422 } }),
      new TextRun({ text: '    ' }),
      new ImageRun({ data: readFileSync('./mockups/mockup-04-library.png'),  transformation: { width: 195, height: 422 } }),
    ],
    spacing: { after: 80 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: 'Fiche animé', size: 20, bold: true, color: DARK }),
      new TextRun({ text: '                                                           ' }),
      new TextRun({ text: 'Bibliothèque', size: 20, bold: true, color: DARK }),
    ],
    spacing: { after: 240 },
  }),

  // Ligne 3 : Chat (centré)
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({ data: readFileSync('./mockups/mockup-05-chat.png'),     transformation: { width: 195, height: 422 } }),
    ],
    spacing: { after: 80 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Chat privé', size: 20, bold: true, color: DARK })],
    spacing: { after: 240 },
  }),

  new Paragraph({
    children: [new TextRun({
      text: 'Note : des captures d\'écran réelles de l\'application sur émulateur Android seront ajoutées en annexe pour illustrer le rendu final.',
      size: 20,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  // ── 3.7 Charte graphique ──
  heading2('3.7  Charte graphique'),

  heading3('Identité visuelle'),

  new Paragraph({
    children: [new TextRun({
      text: 'L\'identité visuelle d\'AnimeTracker s\'articule autour de la couleur violette (#8B5CF6), choisie pour son caractère moderne et son association avec l\'univers créatif et la culture japonaise. Les mots-clés retenus : épuré, dynamique, accessible.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Palette de couleurs'),

  makeTable(
    ['Rôle', 'Couleur', 'Code hex', 'Usage'],
    [
      ['Primary', 'Violet', '#8B5CF6', 'Boutons, liens, éléments actifs, badges "En cours"'],
      ['Success', 'Vert', '#10B981', 'Statut "Terminé", messages de succès'],
      ['Warning', 'Orange', '#F59E0B', 'Statut "À voir", alertes'],
      ['Error', 'Rouge', '#EF4444', 'Erreurs, suppression, statut "Abandonné"'],
      ['Text primaire', 'Quasi-noir', '#111827', 'Corps de texte principal'],
      ['Text secondaire', 'Gris', '#6B7280', 'Labels, métadonnées, timestamps'],
      ['Background', 'Blanc/Gris clair', '#F9FAFB', 'Fond des écrans et cartes'],
    ],
    [1500, 1200, 1500, 4800]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Le mode sombre est intégré nativement — chaque couleur a son équivalent dark (fond #0F172A, surface #1E293B), géré par un ThemeContext React qui persiste la préférence de l\'utilisateur.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 200 },
  }),

  heading3('Typographie'),

  new Paragraph({
    children: [new TextRun({
      text: 'Police principale : Inter (Google Fonts). Choisie pour son excellente lisibilité sur petits écrans et son support complet des caractères latin/accentués.',
      size: 22,
    })],
    spacing: { after: 100 },
  }),

  makeTable(
    ['Niveau', 'Taille', 'Poids', 'Usage'],
    [
      ['H1 — Titre de page', '28px', 'Bold (700)', 'Titre des écrans principaux'],
      ['H2 — Titre de section', '24px', 'SemiBold (600)', 'Sections dans les écrans'],
      ['Body Large', '16px', 'Regular (400)', 'Texte principal, synopsis'],
      ['Body Regular', '14px', 'Regular (400)', 'Corps de texte standard'],
      ['Caption', '12px', 'Regular (400)', 'Timestamps, labels secondaires'],
      ['Button', '14-16px', 'SemiBold (600)', 'Libellés de boutons'],
    ],
    [2500, 1200, 1700, 3600]
  ),

  ...blank(2),

  heading3('Composants UI'),

  bullet('Boutons primaires : fond violet #8B5CF6, texte blanc, border-radius 8px, padding 12px 24px'),
  bullet('Cartes animés : fond blanc, bordure 1px #E5E7EB, border-radius 12px, ombre légère'),
  bullet('Bulles de chat : violettes (messages envoyés) / grises (messages reçus), border-radius asymétrique'),
  bullet('Badges de statut : fond coloré semi-transparent, texte coloré assorti, border-radius plein'),
  bullet('Champs de saisie : hauteur 48px, focus = bordure violette + halo semi-transparent'),
  bullet('Barre de navigation : 64px de hauteur, icône + label, actif en violet, inactif en gris'),

  ...blank(2),

  pageBreak(),
];

// ─── PARTIE 4 — RÉALISATION TECHNIQUE ───────────────────────────────────────

const partie4 = [
  heading1('Partie 4 — Réalisation technique'),

  new Paragraph({
    children: [new TextRun({
      text: 'Cette partie détaille les choix d\'implémentation concrets : pourquoi chaque technologie a été retenue, comment le code est organisé, et des extraits commentés des points techniques les plus significatifs.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // 4.1 Choix techniques
  heading2('4.1  Justification des choix technologiques'),

  heading3('React Native + Expo — frontend mobile'),
  new Paragraph({
    children: [new TextRun({
      text: 'React Native permet d\'écrire une seule base de code TypeScript compilée en composants natifs Android et iOS. Cela évite de maintenir deux projets séparés (Swift/Kotlin), divisant le temps de développement par deux pour un rendu vraiment natif — contrairement aux solutions WebView comme Cordova.',
      size: 22,
    })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Expo ajoute une surcouche qui simplifie le démarrage : bundler préconfiguré, bibliothèques natives packagées, et l\'app Expo Go pour tester sur téléphone physique via QR code sans passer par Android Studio.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Node.js + Express — backend API REST'),
  new Paragraph({
    children: [new TextRun({
      text: 'Node.js partage le même langage que le frontend (TypeScript), ce qui élimine le changement de contexte mental. Son modèle event-loop non-bloquant est idéal pour une API à forte I/O (requêtes BDD, appels Jikan) : le serveur ne bloque pas en attendant une réponse, il traite d\'autres requêtes en parallèle.',
      size: 22,
    })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Express a été préféré à NestJS (trop verbeux pour ce projet) et Fastify (courbe d\'apprentissage plus haute). Sa philosophie minimaliste laisse le développeur choisir comment organiser son code.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('PostgreSQL — base de données relationnelle'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le schéma d\'AnimeTracker est fortement relationnel : un utilisateur possède des animés, des avis, des messages, des abonnements. PostgreSQL est conçu pour ce type de données. MongoDB aurait mal convenu car les jointures sont nombreuses et la flexibilité des documents n\'apporte aucune valeur ici.',
      size: 22,
    })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'PostgreSQL offre aussi des types ENUM natifs (statuts d\'animé, visibilité des avis), des contraintes CHECK applicables au niveau base (ex. : id_follower ≠ id_following pour interdire de se suivre soi-même), et des UUID générés nativement.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Redis — cache pour la blacklist JWT'),
  new Paragraph({
    children: [new TextRun({
      text: 'Redis est une base de données en mémoire (clé/valeur) utilisée exclusivement pour invalider les tokens JWT après déconnexion. À chaque requête authentifiée, le middleware vérifie si le token figure dans Redis. Les opérations en mémoire sont 10 à 100 fois plus rapides qu\'une requête SQL, ce qui est crucial pour cette vérification effectuée sur chaque appel API.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Docker — environnement de développement'),
  new Paragraph({
    children: [new TextRun({
      text: 'Docker isole chaque service dans un conteneur indépendant. Un seul "docker compose up" démarre PostgreSQL, Redis et le backend dans les bonnes versions, dans le bon ordre. Cela garantit que l\'environnement est identique sur tous les postes de développement.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // 4.2 Backend
  heading2('4.2  Architecture backend'),

  heading3('Structure des dossiers'),
  codeBlock('backend/src/'),
  codeBlock('├── app.ts              → Config Express, middlewares globaux, montage routes'),
  codeBlock('├── server.ts           → Point d\'entrée : connexion BDD + Redis puis HTTP'),
  codeBlock('├── config/'),
  codeBlock('│   ├── database.ts     → Instance Sequelize, connexion PostgreSQL'),
  codeBlock('│   └── redis.ts        → Instance Redis'),
  codeBlock('├── models/             → Un fichier par table SQL'),
  codeBlock('├── routes/             → Endpoints HTTP, middlewares par route'),
  codeBlock('├── controllers/        → Extraction params, appel service, formatage réponse'),
  codeBlock('├── services/           → Logique métier pure, requêtes BDD'),
  codeBlock('├── middlewares/'),
  codeBlock('│   ├── authenticate.ts → Vérification JWT + blacklist Redis'),
  codeBlock('│   └── errorHandler.ts → Handler d\'erreur centralisé'),
  codeBlock('└── schemas/            → Schémas Zod (validation données entrantes)'),

  ...blank(1),

  heading3('Pattern Controllers / Services'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le controller gère uniquement HTTP : extraire les paramètres de la requête, appeler le service, formater la réponse. Le service contient la logique métier pure et ne connaît pas HTTP. Ce découpage rend les services testables indépendamment, sans simuler HTTP.',
      size: 22,
    })],
    spacing: { after: 150 },
  }),

  codeBlock('// Controller : gestion HTTP uniquement'),
  codeBlock('export async function upsertReviewController(req, res, next) {'),
  codeBlock('  const animeId = parseInt(req.params.animeId, 10);'),
  codeBlock('  const review = await upsertReview(req.user.userId, animeId, req.body);'),
  codeBlock('  res.status(201).json({ success: true, data: review });'),
  codeBlock('}'),
  codeBlock(''),
  codeBlock('// Service : logique métier — ne connaît pas req/res'),
  codeBlock('export async function upsertReview(userId, animeId, data) {'),
  codeBlock('  const existing = await Review.findOne({'),
  codeBlock('    where: { id_user: userId, id_anime: animeId }'),
  codeBlock('  });'),
  codeBlock('  if (existing) {'),
  codeBlock('    await existing.update({ ...data, updated_at: new Date() });'),
  codeBlock('    return existing;'),
  codeBlock('  }'),
  codeBlock('  return Review.create({ id_user: userId, id_anime: animeId, ...data });'),
  codeBlock('}'),

  ...blank(2),

  heading3('Middleware d\'authentification JWT'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le middleware authenticate est appliqué sur chaque route protégée. Il effectue trois vérifications dans l\'ordre : présence du token, absence dans la blacklist Redis, validité de la signature JWT.',
      size: 22,
    })],
    spacing: { after: 150 },
  }),

  codeBlock('export async function authenticate(req, res, next) {'),
  codeBlock('  const token = req.headers.authorization?.replace(\'Bearer \', \'\');'),
  codeBlock('  if (!token) throw new AppError(401, \'Token manquant\');'),
  codeBlock(''),
  codeBlock('  // Vérification blacklist Redis (token invalidé après logout)'),
  codeBlock('  const isBlacklisted = await redis.exists(`blacklist:${token}`);'),
  codeBlock('  if (isBlacklisted) throw new AppError(401, \'Session expirée\');'),
  codeBlock(''),
  codeBlock('  // Vérification signature + expiration'),
  codeBlock('  const payload = jwt.verify(token, process.env.JWT_SECRET);'),
  codeBlock('  req.user = { userId: payload.userId, role: payload.role };'),
  codeBlock('  next();'),
  codeBlock('}'),

  ...blank(2),

  heading3('Validation des données avec Zod'),
  new Paragraph({
    children: [new TextRun({
      text: 'Zod valide la forme des données reçues avant qu\'elles n\'atteignent la base. Si un client envoie rating: "abc", Zod renvoie une erreur 400 structurée directement affichable dans le frontend, sans que Sequelize n\'ait à tenter l\'insertion.',
      size: 22,
    })],
    spacing: { after: 150 },
  }),

  codeBlock('export const upsertReviewSchema = z.object({'),
  codeBlock('  body: z.object({'),
  codeBlock('    rating: z.number().min(0).max(10)'),
  codeBlock('      .refine(v => (v * 2) % 1 === 0, \'Multiple de 0.5 requis\'),'),
  codeBlock('    comment: z.string().max(2000).optional(),'),
  codeBlock('    visibility: z.enum([\'PUBLIC\', \'PRIVE\']).optional(),'),
  codeBlock('  }),'),
  codeBlock('});'),

  ...blank(2),

  // ── 4.2 bis Sécurité applicative ──
  heading2('4.2 bis  Sécurité applicative — mesures de protection'),

  new Paragraph({
    children: [new TextRun({
      text: 'La sécurité est traitée en couches successives : headers HTTP, limitation de débit, sanitisation des entrées, validation typée, authentification JWT et contrôle d\'accès par rôle. Aucune de ces protections n\'est suffisante seule — c\'est leur combinaison qui garantit la robustesse.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('1. En-têtes HTTP de sécurité — Helmet'),
  new Paragraph({
    children: [new TextRun({
      text: 'Helmet configure automatiquement une série d\'en-têtes HTTP qui protègent contre les attaques web classiques (XSS, clickjacking, MIME sniffing, injection de contenu). Chaque directive a un rôle précis :',
      size: 22,
    })],
    spacing: { after: 120 },
  }),

  codeScreen('// app.ts — configuration Helmet'),
  codeScreen('app.use(helmet({'),
  codeScreen('  contentSecurityPolicy: {'),
  codeScreen('    directives: {'),
  codeScreen('      defaultSrc: ["\'self\'"],      // seul le domaine courant peut charger des ressources'),
  codeScreen('      scriptSrc:  ["\'self\'"],      // aucun script inline ou externe'),
  codeScreen('      imgSrc:     ["\'self\'", "data:", "https:"], // images depuis HTTPS uniquement'),
  codeScreen('      objectSrc:  ["\'none\'"],      // interdit Flash et plugins'),
  codeScreen('    },'),
  codeScreen('  },'),
  codeScreen('  frameguard:    { action: "deny" },    // X-Frame-Options: DENY → anti-clickjacking'),
  codeScreen('  noSniff:       true,                  // X-Content-Type-Options: nosniff'),
  codeScreen('  hsts:          { maxAge: 31536000, includeSubDomains: true }, // force HTTPS 1 an'),
  codeScreen('  hidePoweredBy: true,                  // masque X-Powered-By: Express'),
  codeScreen('  xssFilter:     true,                  // X-XSS-Protection: 1; mode=block'),
  codeScreen('}));'),

  ...blank(1),

  heading3('2. Rate Limiting — protection contre la force brute'),
  new Paragraph({
    children: [new TextRun({
      text: 'Un rate limiter global bloque les clients qui font trop de requêtes en peu de temps. C\'est la première ligne de défense contre les attaques par force brute sur /auth/login et les tentatives d\'énumération d\'utilisateurs.',
      size: 22,
    })],
    spacing: { after: 120 },
  }),

  codeScreen('// app.ts — rate limiting global'),
  codeScreen('app.use(rateLimit({'),
  codeScreen('  windowMs: 15 * 60 * 1000,  // fenêtre de 15 minutes'),
  codeScreen('  max:       100,             // maximum 100 requêtes par IP par fenêtre'),
  codeScreen('  standardHeaders: true,      // renvoie Retry-After dans les headers'),
  codeScreen('  message: {'),
  codeScreen('    success: false,'),
  codeScreen('    message: "Trop de requêtes, réessayez dans 15 minutes"'),
  codeScreen('  },'),
  codeScreen('}));'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Effet : un attaquant qui tente de deviner un mot de passe sera bloqué après 100 essais sur 15 minutes. Avec un mot de passe de 8+ caractères (lettres + chiffres), la probabilité de succès par force brute est négligeable.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 200 },
  }),

  heading3('3. Sanitisation XSS — nettoyage des entrées'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le middleware sanitizeBody parcourt récursivement le body de chaque requête et échappe les caractères HTML dangereux (<, >, ", \') avant qu\'ils n\'atteignent la base de données. Cela complète la validation Zod en empêchant le stockage de contenu malveillant.',
      size: 22,
    })],
    spacing: { after: 120 },
  }),

  codeScreen('// middlewares/sanitize.ts'),
  codeScreen('function sanitizeValue(value: unknown): unknown {'),
  codeScreen('  if (typeof value === "string") {'),
  codeScreen('    return value'),
  codeScreen('      .replace(/&/g,  "&amp;")'),
  codeScreen('      .replace(/</g,  "&lt;")   // empêche <script>alert()</script>'),
  codeScreen('      .replace(/>/g,  "&gt;")'),
  codeScreen('      .replace(/"/g,  "&quot;")'),
  codeScreen('      .replace(/\'/g, "&#x27;");'),
  codeScreen('  }'),
  codeScreen('  if (typeof value === "object" && value !== null) {'),
  codeScreen('    // Parcours récursif des objets et tableaux imbriqués'),
  codeScreen('    return Object.fromEntries('),
  codeScreen('      Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])'),
  codeScreen('    );'),
  codeScreen('  }'),
  codeScreen('  return value;'),
  codeScreen('}'),
  codeScreen(''),
  codeScreen('export const sanitizeBody = (req, _res, next) => {'),
  codeScreen('  if (req.body) req.body = sanitizeValue(req.body);'),
  codeScreen('  next();'),
  codeScreen('};'),

  ...blank(1),

  heading3('4. Contrôle d\'accès par rôle — RBAC avec requireRole()'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le middleware requireRole() implémente un contrôle d\'accès basé sur les rôles (Role-Based Access Control). Il s\'applique après authenticate, qui a déjà vérifié le JWT et peuplé req.user.role. Le panneau d\'administration est entièrement protégé par cette combinaison.',
      size: 22,
    })],
    spacing: { after: 120 },
  }),

  codeScreen('// middlewares/authenticate.ts'),
  codeScreen('export function requireRole(...roles: string[]) {'),
  codeScreen('  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {'),
  codeScreen('    if (!req.user) {'),
  codeScreen('      return next(new AppError(401, "Non authentifié"));'),
  codeScreen('    }'),
  codeScreen('    if (!roles.includes(req.user.role)) {'),
  codeScreen('      return next(new AppError(403, "Accès refusé")); // 403 Forbidden'),
  codeScreen('    }'),
  codeScreen('    next();'),
  codeScreen('  };'),
  codeScreen('}'),

  ...blank(1),

  codeScreen('// routes/admin.ts — toutes les routes admin protégées en une ligne'),
  codeScreen('router.use(authenticate, requireRole("ADMIN"));'),
  codeScreen(''),
  codeScreen('router.get("/stats",                   asyncHandler(getStatsController));'),
  codeScreen('router.get("/users",                   asyncHandler(listUsersController));'),
  codeScreen('router.patch("/users/:id/role",        asyncHandler(changeUserRoleController));'),
  codeScreen('router.patch("/users/:id/suspend",     asyncHandler(suspendUserController));'),
  codeScreen('router.delete("/reviews/:reviewId",    asyncHandler(deleteReviewController));'),
  codeScreen('router.delete("/group-messages/:id",   asyncHandler(deleteGroupMessageController));'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Résultat : un utilisateur avec role = "USER" qui tente d\'accéder à /api/admin/stats reçoit une réponse 403 Forbidden. Le rôle est encodé dans le JWT signé côté serveur — il ne peut pas être falsifié côté client.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 200 },
  }),

  heading3('Synthèse des couches de sécurité'),
  new Paragraph({
    children: [new TextRun({
      text: 'Chaque requête entrante traverse successivement :',
      size: 22,
    })],
    spacing: { after: 100 },
  }),
  bullet('Helmet → headers HTTP défensifs (XSS, clickjacking, MIME sniffing)'),
  bullet('Rate Limiter → blocage si > 100 req / 15 min / IP'),
  bullet('Payload limit → rejet si body > 10 ko'),
  bullet('sanitizeBody → échappement HTML de toutes les chaînes'),
  bullet('Zod → validation typée et contraintes métier (format, longueur, enum)'),
  bullet('authenticate → vérification JWT + blacklist Redis'),
  bullet('requireRole → vérification du rôle (admin, modérateur...)'),
  bullet('Sequelize → requêtes paramétrées → immunité injection SQL'),
  bullet('UUID → clés primaires non-prédictibles → pas d\'énumération'),

  ...blank(2),

  // 4.3 Frontend
  heading2('4.3  Architecture frontend'),

  heading3('Structure des dossiers'),
  codeBlock('src/'),
  codeBlock('├── navigation/          → Routes typées, Auth Stack, Main Stack + Tab Bar'),
  codeBlock('├── screens/'),
  codeBlock('│   ├── auth/            → LoginScreen, RegisterScreen'),
  codeBlock('│   └── main/            → HomeScreen, AnimeDetailScreen, ChatScreen...'),
  codeBlock('├── store/'),
  codeBlock('│   ├── index.ts         → Configuration du store Redux'),
  codeBlock('│   └── slices/          → Un slice par domaine métier'),
  codeBlock('│       ├── authSlice.ts'),
  codeBlock('│       ├── librarySlice.ts'),
  codeBlock('│       ├── reviewsSlice.ts'),
  codeBlock('│       ├── chatSlice.ts'),
  codeBlock('│       ├── groupsSlice.ts'),
  codeBlock('│       └── socialSlice.ts'),
  codeBlock('├── services/'),
  codeBlock('│   ├── apiClient.ts     → Instance Axios avec intercepteurs JWT'),
  codeBlock('│   └── jikanApi.ts      → Appels API MyAnimeList'),
  codeBlock('├── contexts/'),
  codeBlock('│   └── ThemeContext.tsx → Thème clair/sombre persisté'),
  codeBlock('└── types/index.ts       → Interfaces TypeScript partagées'),

  ...blank(1),

  heading3('Gestion d\'état — Redux Toolkit'),
  new Paragraph({
    children: [new TextRun({
      text: 'Redux centralise l\'état dans un store unique. Chaque slice gère un domaine métier avec ses thunks async (appels API) et ses reducers (comment le state change). Les sélecteurs permettent aux composants de lire l\'état sans connaître sa structure interne.',
      size: 22,
    })],
    spacing: { after: 150 },
  }),

  codeBlock('// Thunk : appel API + mise à jour du store'),
  codeBlock('export const createReview = createAsyncThunk('),
  codeBlock('  \'reviews/create\','),
  codeBlock('  async (reviewData, { rejectWithValue }) => {'),
  codeBlock('    try {'),
  codeBlock('      const { data } = await apiClient.post('),
  codeBlock('        `/animes/${reviewData.animeId}/reviews`,'),
  codeBlock('        { rating: reviewData.rating, comment: reviewData.content,'),
  codeBlock('          visibility: reviewData.isPublic ? \'PUBLIC\' : \'PRIVE\' }'),
  codeBlock('      );'),
  codeBlock('      return mapReview(data.data, reviewData); // BDD → format frontend'),
  codeBlock('    } catch (err) {'),
  codeBlock('      return rejectWithValue(err.message);'),
  codeBlock('    }'),
  codeBlock('  }'),
  codeBlock(');'),
  codeBlock(''),
  codeBlock('// Reducer : upsert — remplace si déjà existant'),
  codeBlock('.addCase(createReview.fulfilled, (state, action) => {'),
  codeBlock('  const idx = state.reviews.findIndex('),
  codeBlock('    r => r.userId === action.payload.userId'),
  codeBlock('       && r.animeId === action.payload.animeId'),
  codeBlock('  );'),
  codeBlock('  if (idx !== -1) state.reviews[idx] = action.payload;'),
  codeBlock('  else state.reviews.push(action.payload);'),
  codeBlock('})'),

  ...blank(1),

  heading3('Client HTTP — Axios avec intercepteurs'),
  new Paragraph({
    children: [new TextRun({
      text: 'L\'instance Axios est configurée une seule fois. Deux intercepteurs s\'occupent de tout : l\'un ajoute automatiquement le token JWT à chaque requête, l\'autre normalise les erreurs en messages lisibles pour l\'utilisateur.',
      size: 22,
    })],
    spacing: { after: 150 },
  }),

  codeBlock('const apiClient = axios.create({'),
  codeBlock('  baseURL: process.env.EXPO_PUBLIC_API_URL, // http://10.0.2.2:3000/api'),
  codeBlock('  timeout: 10000,'),
  codeBlock('});'),
  codeBlock(''),
  codeBlock('// Avant chaque requête : injecter le JWT'),
  codeBlock('apiClient.interceptors.request.use(async (config) => {'),
  codeBlock('  const token = await SecureStore.getItemAsync(\'auth_token\');'),
  codeBlock('  if (token) config.headers.Authorization = `Bearer ${token}`;'),
  codeBlock('  return config;'),
  codeBlock('});'),
  codeBlock(''),
  codeBlock('// Après chaque réponse : normaliser les erreurs'),
  codeBlock('apiClient.interceptors.response.use('),
  codeBlock('  response => response,'),
  codeBlock('  (error) => {'),
  codeBlock('    const message = error.response?.data?.message'),
  codeBlock('      ?? \'Erreur réseau\';'),
  codeBlock('    return Promise.reject(new Error(message));'),
  codeBlock('  }'),
  codeBlock(');'),

  ...blank(2),

  // 4.4 BDD
  heading2('4.4  Base de données'),

  heading3('Schéma des tables principales'),

  makeTable(
    ['Table', 'Colonnes clés', 'Contraintes notables'],
    [
      ['users', 'id_user (UUID PK), email, password, pseudo, role, avatar, is_active', 'UNIQUE(email), UNIQUE(pseudo)'],
      ['user_anime', 'id_user_anime, id_user, id_anime, status, current_episode, is_favorite', 'UNIQUE(id_user, id_anime) — 1 entrée max par animé et par utilisateur'],
      ['reviews', 'id_review, id_user, id_anime, rating, comment, visibility, likes_count', 'UNIQUE(id_user, id_anime) — 1 avis max par animé et par utilisateur'],
      ['review_likes', 'id_like, id_review, id_user, created_at', 'UNIQUE(id_review, id_user) — 1 like max par avis et par utilisateur'],
      ['follows', 'id_follow, id_follower, id_following, created_at', 'UNIQUE(follower, following), CHECK(follower ≠ following)'],
      ['messages', 'id_message, id_conversation, id_sender, content, is_read, created_at', 'is_deleted pour suppression logique'],
      ['groups', 'id_group, name, type, id_anime, id_creator', 'type ENUM: OFFICIEL ou PRIVE'],
      ['group_messages', 'id_message, id_group, id_sender, content, created_at, deleted_at', 'deleted_at pour suppression logique (modération)'],
    ],
    [1800, 3400, 3800]
  ),

  ...blank(2),

  heading3('Associations Sequelize'),
  new Paragraph({
    children: [new TextRun({
      text: 'Les associations sont définies dans un fichier centralisé associations.ts. Elles permettent à Sequelize de générer automatiquement les jointures SQL lors des requêtes avec include.',
      size: 22,
    })],
    spacing: { after: 150 },
  }),

  codeBlock('// models/associations.ts'),
  codeBlock('User.hasMany(Review, { foreignKey: \'id_user\', as: \'reviews\' });'),
  codeBlock('Review.belongsTo(User, { foreignKey: \'id_user\', as: \'author\' });'),
  codeBlock(''),
  codeBlock('User.belongsToMany(User, {'),
  codeBlock('  through: Follow,'),
  codeBlock('  as: \'followers\','),
  codeBlock('  foreignKey: \'id_following\','),
  codeBlock('  otherKey: \'id_follower\','),
  codeBlock('});'),

  ...blank(2),

  // 4.5 Fonctionnalités clés
  heading2('4.5  Fonctionnalités clés — points techniques'),

  heading3('Authentification — flux complet'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le mot de passe est haché avec bcrypt (coût 10 = 1024 itérations) avant tout stockage. Le JWT est signé avec un secret d\'environnement et expire après 7 jours. À la déconnexion, le token est placé en blacklist Redis avec une TTL égale à son temps de vie restant.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Bibliothèque personnelle — statuts et progression'),
  new Paragraph({
    children: [new TextRun({
      text: 'Chaque entrée user_anime stocke le statut (A_VOIR, EN_COURS, TERMINE, ABANDONNE), l\'épisode courant, le total d\'épisodes et un booléen is_favorite. La contrainte UNIQUE(id_user, id_anime) est gérée à la fois en base et côté service (upsert : si l\'entrée existe, on la met à jour).',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Avis — visibilité publique/privée'),
  new Paragraph({
    children: [new TextRun({
      text: 'Un avis est privé par défaut. L\'endpoint GET /animes/:id/reviews ne retourne que les avis PUBLIC. Pour que l\'auteur voie son propre avis privé après navigation, un endpoint dédié GET /animes/:id/my-review retourne l\'avis de l\'utilisateur connecté quelle que soit sa visibilité. Les deux sont appelés en parallèle au chargement de l\'écran détail.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Groupes — persistance de l\'appartenance'),
  new Paragraph({
    children: [new TextRun({
      text: 'Redux ne persiste pas entre les sessions. L\'appartenance à un groupe serait perdue au redémarrage. Solution : au montage d\'AnimeGroupScreen, le thunk checkAnimeGroup appelle GET /groups/anime/:animeId qui retourne { group, memberCount, isMember }. Si isMember est true, le groupe est ajouté à joinedGroupIds dans Redux — l\'appartenance est restaurée depuis la BDD.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Système social — follow/unfollow'),
  new Paragraph({
    children: [new TextRun({
      text: 'Le suivi d\'un utilisateur implique trois couches coordonnées : le backend retourne les données complètes après un follow (pas juste 200 OK), le reducer Redux met à jour la liste des abonnés en mémoire immédiatement, et le sélecteur selectIsFollowing consulte state.social.followers (chargé au montage du profil consulté) plutôt que state.social.following.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // 4.6 Docker
  heading2('4.6  Infrastructure Docker'),

  codeBlock('# docker-compose.yml (simplifié)'),
  codeBlock('services:'),
  codeBlock('  postgres:'),
  codeBlock('    image: postgres:15'),
  codeBlock('    ports: ["5433:5432"]   # 5433 hôte (5432 occupé par Postgres natif)'),
  codeBlock('    healthcheck:'),
  codeBlock('      test: ["CMD", "pg_isready"]  # le backend attend ce signal'),
  codeBlock(''),
  codeBlock('  redis:'),
  codeBlock('    image: redis:7'),
  codeBlock('    ports: ["6380:6379"]'),
  codeBlock(''),
  codeBlock('  backend:'),
  codeBlock('    build: ./backend'),
  codeBlock('    ports: ["3000:3000"]'),
  codeBlock('    depends_on:'),
  codeBlock('      postgres: { condition: service_healthy }'),
  codeBlock('      redis:    { condition: service_healthy }'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Point d\'attention rencontré : Docker Desktop sur Windows ne transmet pas les événements de modification de fichiers au système de fichiers Linux du conteneur. Nodemon ne détectait pas les changements. Solution : redémarrer manuellement le conteneur backend après chaque modification (docker restart animetracker_backend).',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  pageBreak(),
];

// ─── PARTIE 4-BIS — DÉPLOIEMENT ET INFRASTRUCTURE ────────────────────────────

const partieDeploiement = [
  heading1('Partie 4 (suite) — Infrastructure et déploiement'),

  new Paragraph({
    children: [new TextRun({
      text: 'Cette section documente l\'infrastructure mise en place pour faire tourner AnimeTracker en local, les choix d\'organisation des conteneurs Docker, la gestion des secrets et les perspectives de déploiement en production.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── Architecture Docker ──
  heading2('4.7  Architecture Docker — vue d\'ensemble'),

  new Paragraph({
    children: [new TextRun({
      text: 'L\'ensemble de l\'infrastructure backend est conteneurisée avec Docker. Trois conteneurs coopèrent via un réseau interne Docker, chacun isolé dans son propre environnement :',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Conteneur', 'Image', 'Port hôte', 'Rôle'],
    [
      ['animetracker_postgres', 'postgres:15-alpine', '5433 → 5432', 'Base de données relationnelle principale'],
      ['animetracker_redis', 'redis:7-alpine', 'variable → 6379', 'Cache en mémoire — blacklist JWT'],
      ['animetracker_backend', 'node:20-alpine (custom)', '3000 → 3000', 'API REST Express + TypeScript'],
    ],
    [2400, 2200, 1800, 3600]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Le port PostgreSQL est remappé sur 5433 côté hôte (au lieu du standard 5432) car une installation native de PostgreSQL tournait déjà sur ce port sur la machine de développement. Ce genre de conflit de port est courant en développement local et Docker le résout proprement via le mapping de ports.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  // ── docker-compose.yml ──
  heading2('4.8  Fichier docker-compose.yml commenté'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le fichier docker-compose.yml décrit l\'ensemble des services, leurs dépendances, leurs volumes et leurs variables d\'environnement. Voici le fichier utilisé dans le projet, avec les points clés expliqués.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  codeBlock('services:'),
  codeBlock(''),
  codeBlock('  # ── PostgreSQL ─────────────────────────────────────────────────'),
  codeBlock('  postgres:'),
  codeBlock('    image: postgres:15-alpine          # image légère (alpine)'),
  codeBlock('    container_name: animetracker_postgres'),
  codeBlock('    environment:'),
  codeBlock('      POSTGRES_DB:       ${POSTGRES_DB}'),
  codeBlock('      POSTGRES_USER:     ${POSTGRES_USER}'),
  codeBlock('      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}'),
  codeBlock('    ports:'),
  codeBlock('      - "5433:5432"                    # hôte:conteneur'),
  codeBlock('    volumes:'),
  codeBlock('      - postgres_data:/var/lib/postgresql/data   # données persistées'),
  codeBlock('      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/01_init.sql'),
  codeBlock('    healthcheck:'),
  codeBlock('      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]'),
  codeBlock('      interval: 10s'),
  codeBlock('      retries: 5'),
  codeBlock(''),
  codeBlock('  # ── Redis ───────────────────────────────────────────────────────'),
  codeBlock('  redis:'),
  codeBlock('    image: redis:7-alpine'),
  codeBlock('    container_name: animetracker_redis'),
  codeBlock('    ports:'),
  codeBlock('      - "${REDIS_PORT}:6379"'),
  codeBlock('    command: redis-server --appendonly yes   # persistance des données'),
  codeBlock('    healthcheck:'),
  codeBlock('      test: ["CMD", "redis-cli", "ping"]'),
  codeBlock(''),
  codeBlock('  # ── Backend Node.js ─────────────────────────────────────────────'),
  codeBlock('  backend:'),
  codeBlock('    build:'),
  codeBlock('      context: ./backend'),
  codeBlock('      dockerfile: Dockerfile'),
  codeBlock('    depends_on:'),
  codeBlock('      postgres: { condition: service_healthy }   # attend que PG soit prêt'),
  codeBlock('      redis:    { condition: service_healthy }   # attend que Redis soit prêt'),
  codeBlock('    environment:'),
  codeBlock('      POSTGRES_HOST: postgres    # nom du service = hostname interne Docker'),
  codeBlock('      REDIS_HOST:    redis'),
  codeBlock('      JWT_SECRET:    ${JWT_SECRET}'),
  codeBlock('    volumes:'),
  codeBlock('      - ./backend:/app            # montage du code source (hot-reload)'),
  codeBlock('      - /app/node_modules         # node_modules du conteneur non écrasés'),
  codeBlock('    profiles:'),
  codeBlock('      - full                      # lancé seulement avec --profile full'),
  codeBlock(''),
  codeBlock('volumes:'),
  codeBlock('  postgres_data:    # volume nommé = données conservées entre redémarrages'),
  codeBlock('  redis_data:'),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({ text: 'Points clés du docker-compose.yml :', bold: true, size: 22 })],
    spacing: { after: 100 },
  }),

  bullet('depends_on avec condition: service_healthy — le backend ne démarre pas tant que PostgreSQL et Redis n\'ont pas passé leur healthcheck. Sans ça, Node.js tenterait de se connecter avant que la base soit prête et crasherait.'),
  bullet('Volumes nommés (postgres_data, redis_data) — les données ne sont pas perdues à l\'arrêt des conteneurs. Un docker compose down simple ne détruit pas les données ; seul un docker compose down -v le ferait.'),
  bullet('Montage ./backend:/app — le code source local est monté dans le conteneur. Toute modification de fichier est immédiatement visible dans le conteneur (hot-reload via ts-node-dev).'),
  bullet('Profile "full" sur le backend — permet de lancer uniquement la BDD et Redis (docker compose up) sans le backend conteneurisé, pour développer le backend en local (npm run dev) tout en ayant les services infra dans Docker.'),

  ...blank(2),

  // ── Dockerfile ──
  heading2('4.9  Dockerfile du backend'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le Dockerfile du backend est volontairement minimaliste pour le développement. Il utilise Node.js 20 sur Alpine Linux (image légère, ~50 Mo) et lance le serveur en mode développement avec rechargement automatique.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  codeBlock('FROM node:20-alpine'),
  codeBlock(''),
  codeBlock('WORKDIR /app'),
  codeBlock(''),
  codeBlock('# Copier les fichiers de dépendances en premier'),
  codeBlock('# Docker met en cache cette couche — npm ci ne s\'exécute que si'),
  codeBlock('# package.json ou package-lock.json change'),
  codeBlock('COPY package*.json ./'),
  codeBlock('RUN npm ci --only=production=false'),
  codeBlock(''),
  codeBlock('COPY . .'),
  codeBlock(''),
  codeBlock('EXPOSE 3000'),
  codeBlock(''),
  codeBlock('CMD ["npm", "run", "dev"]   # ts-node-dev avec --respawn'),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'En production, ce Dockerfile serait en deux étapes (multi-stage build) : une étape de compilation TypeScript → JavaScript, puis une image finale sans les dépendances de développement ni le compilateur TypeScript, réduisant la taille de l\'image finale de 400 Mo à ~80 Mo.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  // ── Variables d'environnement ──
  heading2('4.10  Gestion des variables d\'environnement'),

  new Paragraph({
    children: [new TextRun({
      text: 'Les variables d\'environnement centralisent toutes les valeurs qui changent selon le contexte (développement, production) ou qui ne doivent pas être exposées dans le code source (mots de passe, clés secrètes).',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Fichiers .env — organisation'),

  makeTable(
    ['Fichier', 'Commité dans git ?', 'Rôle'],
    [
      ['.env', 'Non ❌ (.gitignore)', 'Valeurs réelles utilisées en développement local'],
      ['.env.dev', 'Oui ✅ (template)', 'Modèle avec valeurs par défaut — aucun secret réel'],
    ],
    [2000, 2200, 4800]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'Le fichier .env.dev sert de documentation vivante : tout nouveau développeur sait exactement quelles variables configurer. Les valeurs de production (JWT_SECRET fort, mots de passe sécurisés) ne figurent que dans le .env local, jamais dans git.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Contenu du .env.dev (template)'),

  codeBlock('# Frontend Expo'),
  codeBlock('EXPO_PUBLIC_API_URL=http://localhost:3000/api'),
  codeBlock('EXPO_PUBLIC_JIKAN_URL=https://api.jikan.moe/v4'),
  codeBlock(''),
  codeBlock('# PostgreSQL'),
  codeBlock('POSTGRES_HOST=localhost'),
  codeBlock('POSTGRES_PORT=5432'),
  codeBlock('POSTGRES_DB=animetracker'),
  codeBlock('POSTGRES_USER=animetracker_user'),
  codeBlock('POSTGRES_PASSWORD=animetracker_dev_password'),
  codeBlock(''),
  codeBlock('# Redis'),
  codeBlock('REDIS_HOST=localhost'),
  codeBlock('REDIS_PORT=6379'),
  codeBlock(''),
  codeBlock('# Backend'),
  codeBlock('NODE_ENV=development'),
  codeBlock('PORT=3000'),
  codeBlock('JWT_SECRET=change_this_secret_in_production_min_32_chars'),
  codeBlock('JWT_EXPIRES_IN=7d'),
  codeBlock('JIKAN_API_URL=https://api.jikan.moe/v4'),

  ...blank(2),

  // ── Initialisation BDD ──
  heading2('4.11  Initialisation automatique de la base de données'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le fichier docker/postgres/init.sql est monté dans le répertoire /docker-entrypoint-initdb.d/ du conteneur PostgreSQL. Ce mécanisme natif de l\'image officielle PostgreSQL exécute automatiquement tous les fichiers .sql présents dans ce dossier au premier démarrage du conteneur (quand le volume postgres_data est vide).',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'Le fichier init.sql crée dans l\'ordre :', bold: true, size: 22 })],
    spacing: { after: 100 },
  }),

  bullet('L\'extension uuid-ossp — active la fonction uuid_generate_v4() pour générer des UUID automatiquement'),
  bullet('Les types ENUM — user_role, anime_status, visibility_type, group_type... Ces types contraignent les valeurs acceptables directement au niveau de la base de données'),
  bullet('Toutes les tables avec leurs colonnes, types, contraintes PRIMARY KEY, UNIQUE, CHECK et FOREIGN KEY'),
  bullet('Les index de performance sur les colonnes fréquemment filtrées (id_user, id_anime, created_at...)'),

  ...blank(1),

  codeBlock('-- Extrait de init.sql'),
  codeBlock('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
  codeBlock(''),
  codeBlock('CREATE TYPE anime_status AS ENUM (\'A_VOIR\', \'EN_COURS\', \'TERMINE\', \'ABANDONNE\');'),
  codeBlock('CREATE TYPE visibility_type AS ENUM (\'PUBLIC\', \'PRIVE\');'),
  codeBlock(''),
  codeBlock('CREATE TABLE "user" ('),
  codeBlock('    id_user    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),'),
  codeBlock('    email      VARCHAR(255) UNIQUE NOT NULL,'),
  codeBlock('    pseudo     VARCHAR(50)  UNIQUE NOT NULL,'),
  codeBlock('    password   VARCHAR(255) NOT NULL,'),
  codeBlock('    role       user_role DEFAULT \'USER\' NOT NULL,'),
  codeBlock('    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,'),
  codeBlock('    CONSTRAINT chk_email_format CHECK (email ~* \'^[A-Za-z0-9._%+-]+@...$\'),'),
  codeBlock('    CONSTRAINT chk_pseudo_length CHECK (LENGTH(pseudo) >= 3)'),
  codeBlock(');'),

  ...blank(2),

  // ── Démarrage pas à pas ──
  heading2('4.12  Procédure de démarrage du projet'),

  new Paragraph({
    children: [new TextRun({
      text: 'Voici les étapes complètes pour démarrer l\'environnement de développement depuis zéro sur une nouvelle machine.',
      size: 22,
    })],
    spacing: { after: 160 },
  }),

  heading3('Prérequis'),
  bullet('Docker Desktop installé et démarré'),
  bullet('Node.js 20+ installé'),
  bullet('Expo Go installé sur le téléphone (ou émulateur Android configuré)'),

  ...blank(1),

  heading3('Étapes'),

  new Paragraph({
    children: [new TextRun({ text: '1. Cloner le dépôt et configurer l\'environnement', bold: true, size: 22 })],
    spacing: { before: 160, after: 60 },
  }),
  codeBlock('git clone <repo>'),
  codeBlock('cp .env.dev .env          # copier le template'),
  codeBlock('# éditer .env avec les vraies valeurs si nécessaire'),

  new Paragraph({
    children: [new TextRun({ text: '2. Démarrer PostgreSQL et Redis', bold: true, size: 22 })],
    spacing: { before: 160, after: 60 },
  }),
  codeBlock('docker compose up -d'),
  codeBlock('# PostgreSQL s\'initialise automatiquement (init.sql)'),
  codeBlock('# Attendre que les healthchecks passent (~15s)'),

  new Paragraph({
    children: [new TextRun({ text: '3. Démarrer le backend', bold: true, size: 22 })],
    spacing: { before: 160, after: 60 },
  }),
  codeBlock('cd backend'),
  codeBlock('npm install'),
  codeBlock('npm run dev               # ts-node-dev, port 3000'),

  new Paragraph({
    children: [new TextRun({ text: '4. Démarrer le frontend Expo', bold: true, size: 22 })],
    spacing: { before: 160, after: 60 },
  }),
  codeBlock('cd ..                     # racine du projet'),
  codeBlock('npm install'),
  codeBlock('npx expo start'),
  codeBlock('# Scanner le QR code avec Expo Go'),
  codeBlock('# ou appuyer sur "a" pour l\'émulateur Android'),

  ...blank(2),

  // ── Problème Windows ──
  heading2('4.13  Contraintes liées à Windows et Docker Desktop'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le développement sur Windows avec Docker Desktop soulève une contrainte spécifique importante : Docker Desktop sur Windows exécute les conteneurs dans une machine virtuelle Linux (WSL2). Le système de fichiers Windows n\'émet pas d\'événements inotify nativement, ce qui empêche les outils de rechargement automatique (comme ts-node-dev ou nodemon) de détecter les modifications de fichiers depuis l\'intérieur du conteneur.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Symptôme', 'Cause', 'Solution adoptée'],
    [
      ['ts-node-dev ne redémarre pas après modification d\'un fichier', 'Pas d\'événements inotify entre Windows NTFS et le conteneur Linux', 'Backend lancé en local (npm run dev) plutôt qu\'en conteneur pendant le développement'],
      ['docker compose up --profile full relance le backend en conteneur', 'Volume monté depuis Windows → pas de hot-reload fiable', 'Redémarrage manuel : docker restart animetracker_backend'],
    ],
    [2500, 3000, 3500]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'La solution pragmatique retenue : PostgreSQL et Redis tournent dans Docker (services stables qui ne changent pas), tandis que le backend Node.js tourne directement sur la machine hôte Windows pendant le développement actif. Le docker-compose.yml propose le profil "full" pour les rares cas où l\'on veut tout conteneuriser (par exemple pour simuler l\'environnement de production).',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── Perspectives production ──
  heading2('4.14  Perspectives de déploiement en production'),

  new Paragraph({
    children: [new TextRun({
      text: 'Le projet est en environnement de développement local. Un déploiement en production nécessiterait les adaptations suivantes :',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  makeTable(
    ['Élément', 'Développement (actuel)', 'Production (cible)'],
    [
      ['Backend', 'ts-node-dev (rechargement auto, lent)', 'Build TypeScript → JS, image Docker optimisée (multi-stage)'],
      ['Base de données', 'Docker local, données sur le disque hôte', 'Service managé (ex. Supabase, RDS) avec sauvegardes automatiques'],
      ['Secrets', '.env local non commité', 'Variables d\'environnement injectées par la plateforme (Railway, Render, VPS)'],
      ['URL de l\'API', 'http://10.0.2.2:3000 (émulateur)', 'https://api.mondomaine.com (HTTPS obligatoire)'],
      ['CORS', 'Ouvert ou wildcard', 'Restreint aux origines Expo/app store uniquement'],
      ['Logs', 'Console Node.js', 'Service de logs centralisé (ex. Logtail, Sentry)'],
      ['Frontend mobile', 'Expo Go (développement)', 'Build EAS (Expo Application Services) → APK/AAB Google Play'],
    ],
    [2000, 2800, 4200]
  ),

  ...blank(1),

  new Paragraph({
    children: [new TextRun({
      text: 'La conteneurisation avec Docker simplifie ce passage en production : l\'image construite en local est identique à celle qui tournerait sur un VPS ou une plateforme cloud. Il suffit de changer les variables d\'environnement et de pointer vers la bonne base de données.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  pageBreak(),
];

// ─── PARTIE 5 — TESTS ─────────────────────────────────────────────────────────

const partie5 = [
  heading1('Partie 5 — Tests et qualité'),

  new Paragraph({
    children: [new TextRun({
      text: 'La stratégie de tests d\'AnimeTracker combine des tests automatisés (Jest) pour la logique métier et les routes HTTP, et des tests manuels sur émulateur Android pour valider le comportement réel de l\'application.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  heading2('5.1  Stratégie de tests'),

  makeTable(
    ['Niveau', 'Outil', 'Objectif'],
    [
      ['Tests unitaires', 'Jest + mocks', 'Valider la logique métier de chaque service isolément, sans BDD réelle'],
      ['Tests d\'intégration', 'Jest + Supertest', 'Valider les routes HTTP complètes (requête → réponse) avec middlewares'],
      ['Tests manuels', 'Émulateur Android (API 33)', 'Valider le comportement réel de l\'application sur toutes les fonctionnalités'],
    ],
    [2200, 2200, 4600]
  ),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({ text: 'Environnement de test :', bold: true, size: 22 })],
    spacing: { after: 100 },
  }),
  bullet('Émulateur Android — Android Studio, API level 33'),
  bullet('Backend Node.js/Express en local — port 3000'),
  bullet('PostgreSQL dans Docker — port 5433'),
  bullet('Redis dans Docker — port 6380'),
  bullet('Tous les modèles Sequelize, la BDD et Redis sont mockés pendant les tests Jest — aucune connexion réelle'),

  ...blank(2),

  heading2('5.2  Tests automatisés Jest — résultats'),

  heading3('authService.test.ts — 15 tests unitaires'),

  makeTable(
    ['#', 'Cas de test', 'Résultat'],
    [
      ['1', 'Inscription avec données valides → Token JWT + objet user', '✅ PASS'],
      ['2', 'Inscription avec email déjà existant → AppError 409', '✅ PASS'],
      ['3', 'Inscription avec pseudo déjà pris → AppError 409', '✅ PASS'],
      ['4', 'Connexion avec identifiants corrects → Token JWT', '✅ PASS'],
      ['5', 'Connexion avec email inexistant → AppError 401', '✅ PASS'],
      ['6', 'Connexion avec mauvais mot de passe → AppError 401', '✅ PASS'],
      ['7', 'Déconnexion → Token ajouté dans Redis avec TTL', '✅ PASS'],
      ['8', 'Vérification token blacklisté → AppError 401', '✅ PASS'],
      ['9', 'Vérification token valide → Payload JWT retourné', '✅ PASS'],
      ['10', 'Vérification token malformé → AppError 401', '✅ PASS'],
      ['11', 'Mot de passe haché avec bcrypt → hash ≠ mot de passe clair', '✅ PASS'],
      ['12', 'Comparaison bcrypt — bon mot de passe → true', '✅ PASS'],
      ['13', 'Comparaison bcrypt — mauvais mot de passe → false', '✅ PASS'],
      ['14', 'Token JWT expiré → AppError 401', '✅ PASS'],
      ['15', 'Payload JWT contient userId et role', '✅ PASS'],
    ],
    [400, 6200, 1400]
  ),

  ...blank(2),

  heading3('userService.test.ts — 12 tests unitaires'),

  makeTable(
    ['#', 'Cas de test', 'Résultat'],
    [
      ['1', 'Récupérer profil existant → objet user sans champ password', '✅ PASS'],
      ['2', 'Récupérer profil inexistant → AppError 404', '✅ PASS'],
      ['3', 'Mettre à jour pseudo valide → mis à jour en BDD', '✅ PASS'],
      ['4', 'Mettre à jour avec pseudo déjà pris → AppError 409', '✅ PASS'],
      ['5', 'Changer mot de passe — ancien correct → nouveau hash sauvegardé', '✅ PASS'],
      ['6', 'Changer mot de passe — ancien incorrect → AppError 401', '✅ PASS'],
      ['7', 'Suivre un utilisateur → relation créée en BDD', '✅ PASS'],
      ['8', 'Suivre un utilisateur déjà suivi → AppError 409', '✅ PASS'],
      ['9', 'Se suivre soi-même → AppError 400', '✅ PASS'],
      ['10', 'Se désabonner d\'un utilisateur suivi → relation supprimée', '✅ PASS'],
      ['11', 'Se désabonner d\'un non-suivi → AppError 404', '✅ PASS'],
      ['12', 'Rechercher des utilisateurs → liste filtrée retournée', '✅ PASS'],
    ],
    [400, 6200, 1400]
  ),

  ...blank(2),

  heading3('auth.test.ts — 11 tests d\'intégration'),

  makeTable(
    ['#', 'Route', 'Cas de test', 'Code HTTP', 'Résultat'],
    [
      ['1', 'POST /auth/register', 'Inscription valide', '201', '✅ PASS'],
      ['2', 'POST /auth/register', 'Email manquant', '400', '✅ PASS'],
      ['3', 'POST /auth/register', 'Mot de passe trop court', '400', '✅ PASS'],
      ['4', 'POST /auth/register', 'Email déjà utilisé', '409', '✅ PASS'],
      ['5', 'POST /auth/login', 'Connexion valide', '200', '✅ PASS'],
      ['6', 'POST /auth/login', 'Mauvais mot de passe', '401', '✅ PASS'],
      ['7', 'POST /auth/login', 'Utilisateur inexistant', '401', '✅ PASS'],
      ['8', 'POST /auth/logout', 'Déconnexion avec token valide', '200', '✅ PASS'],
      ['9', 'POST /auth/logout', 'Sans token', '401', '✅ PASS'],
      ['10', 'GET /api/health', 'Endpoint de santé', '200', '✅ PASS'],
      ['11', '(route inconnue)', '404 Not Found', '404', '✅ PASS'],
    ],
    [400, 2000, 2800, 1000, 1800]
  ),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({ text: 'Résumé Jest', bold: true, size: 22 })],
    spacing: { after: 100 },
  }),
  codeBlock('Test Suites : 3 passed, 3 total'),
  codeBlock('Tests       : 38 passed, 38 total (0 failed)'),
  codeBlock('Snapshots   : 0'),
  codeBlock('Durée       : ~4 secondes'),

  ...blank(2),

  heading2('5.3  Tests manuels — émulateur Android'),

  makeTable(
    ['Domaine', 'Tests', 'Passés', 'Taux'],
    [
      ['Authentification (M-01 à M-07)', '7', '7', '100%'],
      ['Bibliothèque personnelle (M-08 à M-15)', '8', '8', '100%'],
      ['Avis — Reviews (M-16 à M-22)', '7', '7', '100%'],
      ['Messagerie privée (M-23 à M-28)', '6', '6', '100%'],
      ['Groupes de discussion (M-29 à M-32)', '4', '4', '100%'],
      ['Social — abonnements (M-33 à M-37)', '5', '5', '100%'],
      ['Profil utilisateur (M-38 à M-41)', '4', '4', '100%'],
      ['Total', '41', '41', '100%'],
    ],
    [4500, 1200, 1200, 2100]
  ),

  ...blank(2),

  heading2('5.4  Couverture fonctionnelle'),

  makeTable(
    ['Fonctionnalité', 'Tests automatisés', 'Tests manuels', 'Couverture'],
    [
      ['Inscription / Connexion', '✅ Oui', '✅ Oui', 'Complète'],
      ['Gestion de profil', '✅ Partiel (service)', '✅ Oui', 'Complète'],
      ['Bibliothèque animés', '❌ Non', '✅ Oui', 'Manuelle'],
      ['Avis (reviews)', '❌ Non', '✅ Oui', 'Manuelle'],
      ['Messagerie privée', '❌ Non', '✅ Oui', 'Manuelle'],
      ['Groupes de discussion', '❌ Non', '✅ Oui', 'Manuelle'],
      ['Social (follow)', '✅ Partiel (service)', '✅ Oui', 'Complète'],
      ['Sécurité JWT', '✅ Oui', '✅ Oui', 'Complète'],
      ['Validation Zod', '✅ Oui', '✅ Oui', 'Complète'],
    ],
    [3000, 1800, 1800, 2400]
  ),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({
      text: 'Les tests automatisés couvrent principalement la couche service (logique métier) et les routes d\'authentification. Les fonctionnalités métier complexes (bibliothèque, messagerie, groupes) sont validées par tests manuels sur émulateur Android. C\'est un axe d\'amélioration identifié pour une version future.',
      size: 22,
      italics: true,
      color: GRAY,
    })],
    spacing: { after: 300 },
  }),

  pageBreak(),
];

// ─── PARTIE 6 — BILAN ─────────────────────────────────────────────────────────

const partie6 = [
  heading1('Partie 6 — Bilan et rétrospective'),

  new Paragraph({
    children: [new TextRun({
      text: 'Ce bilan revient honnêtement sur ce qui a bien fonctionné, les difficultés rencontrées et la façon dont elles ont été résolues, et ce qui pourrait être amélioré dans une prochaine version.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  heading2('6.1  Ce qui a bien fonctionné'),

  new Paragraph({
    children: [new TextRun({ text: 'Architecture découplée front/back', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'La séparation claire entre l\'application mobile et l\'API REST a permis de faire évoluer les deux côtés indépendamment. Un changement de schéma en base n\'impliquait de modifier que le service backend et le slice Redux concerné — les écrans n\'étaient pas impactés.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'Redux Toolkit pour la gestion d\'état', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Le découpage en slices par domaine métier (auth, library, reviews, social, groups, chat) a rendu la base de code claire et maintenable. Les AsyncThunk standardisent tous les appels API avec leurs états pending/fulfilled/rejected.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'Docker pour l\'environnement de développement', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Dockeriser PostgreSQL et Redis a produit un environnement reproductible en une commande. Cela a évité les problèmes d\'installation locale et permis de travailler avec des versions précises des services.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({ text: 'TypeScript full-stack', bold: true, size: 22, color: VIOLET })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({
      text: 'Avoir TypeScript sur les deux couches a permis de détecter en amont des erreurs de mapping (snake_case BDD vs camelCase frontend) qui auraient été silencieuses en JavaScript. Les interfaces partagées entre services et slices servent de contrat.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  heading2('6.2  Difficultés rencontrées et solutions apportées'),

  makeTable(
    ['Difficulté', 'Cause', 'Solution apportée'],
    [
      [
        'Persistance de l\'appartenance aux groupes',
        'Redux ne persiste pas entre sessions — au redémarrage, joinedGroupIds était vide',
        'Endpoint GET /groups/anime/:animeId retournant isMember. Appelé au montage d\'AnimeGroupScreen pour restaurer l\'état depuis la BDD.'
      ],
      [
        'Avis privé qui disparaît après navigation',
        'GET /animes/:id/reviews ne retourne que les avis PUBLIC par conception',
        'Ajout de GET /animes/:id/my-review (authentifié) retournant l\'avis de l\'utilisateur quelle que soit sa visibilité. Appelé en parallèle au chargement.'
      ],
      [
        'Bouton Follow/Unfollow toujours désactivé',
        'selectIsFollowing consultait state.social.following (les gens que l\'autre suit) au lieu de state.social.followers',
        'Correction du sélecteur + le backend retourne désormais les données complètes après un follow pour mettre à jour le store immédiatement.'
      ],
      [
        'Tests Jest qui échouent après ajout de modèles',
        'Les nouveaux modèles (Conversation, Group...) initialisaient Sequelize à l\'import, mais la BDD était mockée',
        'Ajout de jest.mock() pour chaque nouveau modèle dans le fichier de setup des tests. Pratique documentée pour les futures ajouts.'
      ],
      [
        'Communication émulateur Android ↔ backend',
        'localhost ne pointe pas vers la machine hôte depuis l\'émulateur Android',
        'URL de base configurée à http://10.0.2.2:3000 (alias Android pour 127.0.0.1 de l\'hôte). Documenté dans la config.'
      ],
    ],
    [2000, 2800, 4200]
  ),

  ...blank(2),

  heading2('6.3  Axes d\'amélioration'),

  bullet('Tests automatisés des fonctionnalités métier — bibliothèque, messagerie et groupes sont uniquement couverts par des tests manuels. Des tests d\'intégration supplémentaires augmenteraient la fiabilité.'),
  bullet('Refresh token JWT — la gestion actuelle force une déconnexion à l\'expiration. Un mécanisme de refresh token éviterait les interruptions inattendues.'),
  bullet('Messagerie en temps réel — le chat est actuellement en mode "pull". Socket.IO permettrait des mises à jour instantanées avec indicateur de frappe.'),
  bullet('Pagination des listes — les endpoints retournent toutes les données. Un système limit/offset est nécessaire pour les utilisateurs avec de nombreux animés ou messages.'),
  bullet('Upload d\'avatar — le profil utilise un index de couleur prédéfini. Un vrai upload vers S3 ou Cloudinary offrirait des avatars personnalisés.'),
  bullet('Tests sur device physique et iOS — les tests manuels ont été réalisés sur émulateur Android uniquement.'),

  ...blank(2),

  heading2('6.4  Compétences acquises'),

  heading3('Architecture full-stack mobile'),
  new Paragraph({
    children: [new TextRun({
      text: 'Concevoir une application de bout en bout — de la base de données relationnelle jusqu\'à l\'interface utilisateur mobile — en maintenant la cohérence entre les couches (typage partagé, conventions de nommage, gestion des erreurs) est le défi principal de ce projet. Il a été résolu.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Gestion d\'état complexe'),
  new Paragraph({
    children: [new TextRun({
      text: 'Gérer l\'état d\'une application avec de multiples domaines interdépendants (auth, social, reviews...) a nécessité une compréhension approfondie de Redux : sélecteurs, thunks, patterns d\'optimisation pour éviter les re-renders inutiles.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Sécurité applicative'),
  new Paragraph({
    children: [new TextRun({
      text: 'L\'implémentation de l\'authentification JWT, du rate limiting, de la validation Zod et de la blacklist Redis a concrétisé les concepts de sécurité web dans un contexte réel. La compréhension des vecteurs d\'attaque (injection, force brute, token replay) guide chaque choix de conception.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  heading3('Debugging méthodique'),
  new Paragraph({
    children: [new TextRun({
      text: 'Les bugs complexes (social, persistance des groupes) ont nécessité une approche par hypothèses successives : isoler, reproduire, identifier la cause racine, corriger, vérifier. Cette méthode est applicable à tout projet.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  heading2('6.5  Conclusion'),

  new Paragraph({
    children: [new TextRun({
      text: 'AnimeTracker a été développé avec succès en respectant le périmètre fonctionnel défini. Les 7 fonctionnalités principales sont opérationnelles et testées. Les 38 tests automatisés passent à 100%, et les 41 tests manuels sur émulateur Android valident le comportement réel de l\'application.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({
      text: 'Les difficultés rencontrées — persistance d\'état, gestion de la visibilité des données, conventions de mapping — sont représentatives des défis réels du développement full-stack mobile. Chaque problème a été résolu par une approche méthodique, souvent en ajoutant une couche d\'API dédiée plutôt qu\'en contournant les contraintes côté frontend.',
      size: 22,
    })],
    spacing: { after: 200 },
  }),

  new Paragraph({
    children: [new TextRun({
      text: 'Ce projet valide la capacité à concevoir, développer et tester une application mobile professionnelle de bout en bout, en maîtrisant l\'ensemble de la chaîne technologique — de la base de données PostgreSQL jusqu\'à l\'interface React Native sur Android.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({
      text: 'AnimeTracker — Dossier CDA — Mai 2026',
      size: 18,
      italics: true,
      color: GRAY,
    })],
  }),
];

// ─── ANNEXES ─────────────────────────────────────────────────────────────────

const annexes = [

  heading1('Annexe A — Liste complète des endpoints API'),

  new Paragraph({
    children: [new TextRun({
      text: 'L\'API REST d\'AnimeTracker est accessible sous le préfixe /api. Toutes les routes marquées 🔒 nécessitent un token JWT valide dans l\'en-tête Authorization: Bearer <token>.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // ── Authentification ──
  heading2('Authentification — /api/auth'),

  makeTable(
    ['Méthode', 'Route', 'Auth', 'Description', 'Code'],
    [
      ['GET',    '/api/health',          '',   'Vérification que le serveur répond', '200'],
      ['POST',   '/api/auth/register',   '',   'Inscription — { email, password, pseudo }', '201'],
      ['POST',   '/api/auth/login',      '',   'Connexion — { email, password } → JWT', '200'],
      ['POST',   '/api/auth/logout',     '🔒', 'Déconnexion — invalide le token dans Redis', '200'],
      ['GET',    '/api/auth/me',         '🔒', 'Récupérer son propre profil depuis le token', '200'],
    ],
    [800, 2200, 600, 4200, 700]
  ),

  ...blank(2),

  // ── Utilisateurs ──
  heading2('Utilisateurs — /api/users'),

  makeTable(
    ['Méthode', 'Route', 'Auth', 'Description', 'Code'],
    [
      ['GET',    '/api/users/search?q=',          '🔒', 'Rechercher des utilisateurs par pseudo', '200'],
      ['GET',    '/api/users/me',                  '🔒', 'Récupérer son profil complet', '200'],
      ['PATCH',  '/api/users/me',                  '🔒', 'Modifier pseudo, bio, avatar', '200'],
      ['PATCH',  '/api/users/me/password',          '🔒', 'Changer son mot de passe', '200'],
      ['DELETE', '/api/users/me',                  '🔒', 'Supprimer son compte (RGPD)', '200'],
      ['GET',    '/api/users/me/data',             '🔒', 'Exporter ses données personnelles (RGPD)', '200'],
      ['GET',    '/api/users/me/animes',           '🔒', 'Récupérer sa bibliothèque complète', '200'],
      ['POST',   '/api/users/me/animes',           '🔒', 'Ajouter un animé à sa bibliothèque', '201'],
      ['PATCH',  '/api/users/me/animes/:animeId',  '🔒', 'Modifier statut, épisode, favori', '200'],
      ['DELETE', '/api/users/me/animes/:animeId',  '🔒', 'Retirer un animé de sa bibliothèque', '200'],
      ['GET',    '/api/users/me/stats',            '🔒', 'Statistiques de visionnage', '200'],
      ['DELETE', '/api/users/me/reviews/:id',      '🔒', 'Supprimer un de ses avis', '200'],
      ['POST',   '/api/users/me/reviews/:id/like', '🔒', 'Liker / unliker un avis public', '200'],
      ['GET',    '/api/users/:userId',             '',   'Profil public d\'un utilisateur', '200'],
      ['GET',    '/api/users/:userId/followers',   '',   'Liste des abonnés d\'un utilisateur', '200'],
      ['GET',    '/api/users/:userId/following',   '',   'Liste des abonnements d\'un utilisateur', '200'],
      ['POST',   '/api/users/:userId/follow',      '🔒', 'S\'abonner à un utilisateur', '201'],
      ['DELETE', '/api/users/:userId/follow',      '🔒', 'Se désabonner d\'un utilisateur', '200'],
    ],
    [800, 2500, 600, 3700, 700]
  ),

  ...blank(2),

  // ── Animés ──
  heading2('Animés — /api/animes'),

  makeTable(
    ['Méthode', 'Route', 'Auth', 'Description', 'Code'],
    [
      ['GET',    '/api/animes/search?q=',          '',   'Rechercher des animés (via Jikan API)', '200'],
      ['GET',    '/api/animes/top',                '',   'Top animés par score MyAnimeList', '200'],
      ['GET',    '/api/animes/:id',                '',   'Détail d\'un animé par son ID Jikan', '200'],
      ['GET',    '/api/animes/:id/reviews',        '',   'Avis publics d\'un animé (triés par likes)', '200'],
      ['GET',    '/api/animes/:id/my-review',      '🔒', 'Récupérer son propre avis (public ou privé)', '200'],
      ['POST',   '/api/animes/:id/reviews',        '🔒', 'Créer ou mettre à jour son avis (upsert)', '201'],
      ['DELETE', '/api/animes/:id/reviews',        '🔒', 'Supprimer son avis sur un animé', '200'],
    ],
    [800, 2500, 600, 3700, 700]
  ),

  ...blank(2),

  // ── Messagerie ──
  heading2('Messagerie privée — /api/conversations'),

  makeTable(
    ['Méthode', 'Route', 'Auth', 'Description', 'Code'],
    [
      ['GET',    '/api/conversations',                        '🔒', 'Liste de toutes ses conversations', '200'],
      ['POST',   '/api/conversations/with/:recipientId',      '🔒', 'Créer ou récupérer une conversation avec un utilisateur', '200'],
      ['GET',    '/api/conversations/:id/messages',           '🔒', 'Historique des messages d\'une conversation', '200'],
      ['POST',   '/api/conversations/:id/messages',           '🔒', 'Envoyer un message — { content }', '201'],
      ['PATCH',  '/api/conversations/:id/read',               '🔒', 'Marquer les messages comme lus', '200'],
      ['DELETE', '/api/conversations/:id',                    '🔒', 'Supprimer une conversation', '200'],
    ],
    [800, 3000, 600, 3400, 700]
  ),

  ...blank(2),

  // ── Groupes ──
  heading2('Groupes de discussion — /api/groups'),

  makeTable(
    ['Méthode', 'Route', 'Auth', 'Description', 'Code'],
    [
      ['GET',    '/api/groups/anime/:animeId',          '🔒', 'Statut du groupe officiel d\'un animé + isMember', '200'],
      ['POST',   '/api/groups/anime/:animeId',          '🔒', 'Rejoindre (ou créer) le groupe officiel d\'un animé', '200'],
      ['GET',    '/api/groups/:groupId',                '🔒', 'Informations d\'un groupe', '200'],
      ['POST',   '/api/groups/:groupId/join',           '🔒', 'Rejoindre un groupe', '200'],
      ['DELETE', '/api/groups/:groupId/leave',          '🔒', 'Quitter un groupe', '200'],
      ['GET',    '/api/groups/:groupId/messages',       '🔒', 'Messages d\'un groupe de discussion', '200'],
      ['POST',   '/api/groups/:groupId/messages',       '🔒', 'Envoyer un message dans un groupe — { content }', '201'],
    ],
    [800, 2800, 600, 3500, 700]
  ),

  ...blank(2),

  new Paragraph({
    children: [new TextRun({ text: 'Récapitulatif', bold: true, size: 22 })],
    spacing: { after: 120 },
  }),

  makeTable(
    ['Domaine', 'Nb de routes', 'Routes publiques', 'Routes authentifiées'],
    [
      ['Authentification', '5',  '2', '3'],
      ['Utilisateurs',     '18', '3', '15'],
      ['Animés',           '7',  '3', '4'],
      ['Messagerie',       '6',  '0', '6'],
      ['Groupes',          '7',  '0', '7'],
      ['Total',            '43', '8', '35'],
    ],
    [2500, 1500, 2000, 3000]
  ),

  pageBreak(),

  // ── Annexe B — Captures d'écran ──
  heading1('Annexe B — Captures d\'écran de l\'application'),

  new Paragraph({
    children: [new TextRun({
      text: 'Captures d\'écran réelles de l\'application AnimeTracker sur émulateur Android (Pixel 10 Pro XL, API level 33). Les données affichées sont des données de test.',
      size: 22,
    })],
    spacing: { after: 300 },
  }),

  // Helper inline pour une image + légende centrée
  // Format : 2 screens par ligne

  // ── Ligne 1 : Accueil + Recherche ──
  heading2('Accueil et Recherche'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-11.png'), transformation: { width: 210, height: 460 } }),
      new TextRun({ text: '          ' }),
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-07.png'), transformation: { width: 210, height: 460 } }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: 'Accueil — animés populaires et recommandations', size: 18, italics: true, color: GRAY }),
      new TextRun({ text: '          ' }),
      new TextRun({ text: '          Recherche — résultats en temps réel', size: 18, italics: true, color: GRAY }),
    ],
  }),

  // ── Ligne 2 : Fiche animé haut + bas ──
  heading2('Fiche animé'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-09.png'), transformation: { width: 210, height: 460 } }),
      new TextRun({ text: '          ' }),
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-10.png'), transformation: { width: 210, height: 460 } }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: 'Fiche animé — cover, note MAL, genres, statut', size: 18, italics: true, color: GRAY }),
      new TextRun({ text: '     ' }),
      new TextRun({ text: 'Synopsis, infos studio, avis de la communauté', size: 18, italics: true, color: GRAY }),
    ],
  }),

  // ── Ligne 3 : Bibliothèque + Messages ──
  heading2('Bibliothèque et Messagerie'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-05.png'), transformation: { width: 210, height: 460 } }),
      new TextRun({ text: '          ' }),
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-04.png'), transformation: { width: 210, height: 460 } }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: 'Bibliothèque — filtres et progression par animé', size: 18, italics: true, color: GRAY }),
      new TextRun({ text: '       ' }),
      new TextRun({ text: '     Messages — liste des conversations privées', size: 18, italics: true, color: GRAY }),
    ],
  }),

  // ── Ligne 4 : Profil perso haut + bas ──
  heading2('Profil utilisateur'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-02.png'), transformation: { width: 210, height: 460 } }),
      new TextRun({ text: '          ' }),
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-01.png'), transformation: { width: 210, height: 460 } }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: 'Profil — statistiques de bibliothèque', size: 18, italics: true, color: GRAY }),
      new TextRun({ text: '                    ' }),
      new TextRun({ text: '     Visionnage, progression et données sociales', size: 18, italics: true, color: GRAY }),
    ],
  }),

  // ── Ligne 5 : Profil public (centré) ──
  heading2('Profil public'),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new ImageRun({ data: readFileSync('../documentation/screenshots/screen-03.png'), transformation: { width: 210, height: 460 } }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: 'Profil public d\'un autre utilisateur — avis publics, abonnés, bouton S\'abonner/Ne plus suivre', size: 18, italics: true, color: GRAY }),
    ],
  }),
];

// ─── DOCUMENT FINAL ───────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Calibri',
          size: 22,
          color: '111827',
        },
        paragraph: {
          spacing: { line: 280 },
        },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          bold: true,
          size: 36,
          color: DARK,
          font: 'Calibri',
        },
        paragraph: {
          spacing: { before: 480, after: 240 },
          border: {
            bottom: {
              color: VIOLET,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          },
        },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          bold: true,
          size: 28,
          color: VIOLET,
          font: 'Calibri',
        },
        paragraph: {
          spacing: { before: 360, after: 160 },
        },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        run: {
          bold: true,
          size: 24,
          color: DARK,
          font: 'Calibri',
        },
        paragraph: {
          spacing: { before: 240, after: 120 },
        },
      },
    ],
  },
  sections: [
    // ── Section portrait — corps du dossier ──
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1.1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.3),
          },
        },
      },
      children: [
        ...coverPage,
        ...sommairePage,
        ...partie1,
        ...partieVeille,
        ...partie2,
        ...partie3,
        ...partie4,
        ...partieDeploiement,
        ...partie5,
        ...partie6,
        ...annexes,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  writeFileSync('../documentation/dossier-cda-animetracker.docx', buffer);
  console.log('✅ Fichier généré : documentation/dossier-cda-animetracker.docx');
});
