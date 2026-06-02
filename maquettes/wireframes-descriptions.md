# Wireframes & Descriptions des Écrans - AnimeTracker

## Navigation Principale

### Structure de navigation : Bottom Tab Bar

```
┌─────────────────────────────────────┐
│                                     │
│        Contenu de l'écran           │
│                                     │
├─────────────────────────────────────┤
│  [Home]  [Search]  [+]  [Lib]  [Me]│ Bottom Tab Bar
└─────────────────────────────────────┘
```

**5 onglets principaux** :
1. **Home** - Accueil / Feed
2. **Search** - Recherche d'animes
3. **Add** (bouton central) - Ajout rapide
4. **Library** - Ma bibliothèque
5. **Profile** - Mon profil

---

## 1. ÉCRAN : SPLASH & ONBOARDING

### 1.1 Splash Screen (Écran de chargement)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│            [LOGO]                   │
│          AnimeTracker               │
│                                     │
│         [Loading...]                │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Éléments** :
- Logo centré (icône + nom)
- Indicateur de chargement (spinner)
- Fond dégradé (Gradient Hero)

**Durée** : 1-2 secondes max

---

### 1.2 Onboarding (Première ouverture)

**3 slides avec swipe horizontal** :

#### Slide 1
```
┌─────────────────────────────────────┐
│          [Skip]                     │
│                                     │
│      [Illustration Anime 1]         │
│                                     │
│    Suivez vos animes                │
│    Ne ratez plus aucun épisode      │
│                                     │
│       • • ○                         │
│      [Suivant →]                    │
└─────────────────────────────────────┘
```

#### Slide 2
```
┌─────────────────────────────────────┐
│          [Skip]                     │
│                                     │
│      [Illustration Anime 2]         │
│                                     │
│    Partagez vos avis                │
│    Notez et commentez               │
│                                     │
│       • ○ •                         │
│      [Suivant →]                    │
└─────────────────────────────────────┘
```

#### Slide 3
```
┌─────────────────────────────────────┐
│                                     │
│      [Illustration Anime 3]         │
│                                     │
│    Rejoignez la communauté          │
│    Discutez avec d'autres fans      │
│                                     │
│       ○ • •                         │
│      [Commencer]                    │
└─────────────────────────────────────┘
```

---

## 2. ÉCRAN : AUTHENTIFICATION

### 2.1 Écran de Connexion (Login)

```
┌─────────────────────────────────────┐
│           [← Retour]                │
│                                     │
│          [Logo]                     │
│       Bienvenue !                   │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Email                   │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Mot de passe       [👁] │     │
│    └─────────────────────────┘     │
│                                     │
│         [Mot de passe oublié?]     │
│                                     │
│    ┌─────────────────────────┐     │
│    │    Se connecter         │     │
│    └─────────────────────────┘     │
│                                     │
│    Pas encore de compte ?           │
│         [S'inscrire]                │
│                                     │
└─────────────────────────────────────┘
```

**Éléments** :
- Logo en haut
- 2 champs : Email, Mot de passe (avec toggle show/hide)
- Lien "Mot de passe oublié"
- Bouton primary "Se connecter"
- Lien vers inscription

**Validations** :
- Email : format valide
- Mot de passe : min 8 caractères
- Messages d'erreur sous les champs

---

### 2.2 Écran d'Inscription (Register)

```
┌─────────────────────────────────────┐
│           [← Retour]                │
│                                     │
│       Créer un compte               │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Pseudo                  │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Email                   │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Mot de passe       [👁] │     │
│    └─────────────────────────┘     │
│                                     │
│    ┌─────────────────────────┐     │
│    │ Confirmer mot de passe  │     │
│    └─────────────────────────┘     │
│                                     │
│    ☑ J'accepte les CGU              │
│                                     │
│    ┌─────────────────────────┐     │
│    │    S'inscrire           │     │
│    └─────────────────────────┘     │
│                                     │
│    Déjà un compte ?                 │
│         [Se connecter]              │
│                                     │
└─────────────────────────────────────┘
```

**Validations** :
- Pseudo : 3-50 caractères, unique
- Email : format valide, unique
- Mot de passe : min 8 caractères, 1 majuscule, 1 chiffre
- Confirmation : identique au mot de passe
- CGU : acceptation obligatoire

---

## 3. ÉCRAN : HOME (Accueil)

```
┌─────────────────────────────────────┐
│  AnimeTracker        [🔔 2] [Profil]│ Header
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │ Search bar
│  │ 🔍 Rechercher un anime...     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ▼ Nouveaux épisodes                │ Section
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │ Anime │ │ Anime │ │ Anime │    │ Carrousel horizontal
│  │ Cover │ │ Cover │ │ Cover │    │
│  │ Ep 12 │ │ Ep 5  │ │ Ep 20 │    │
│  └───────┘ └───────┘ └───────┘    │
│                                     │
│  ▼ Populaires cette semaine         │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │ Anime │ │ Anime │ │ Anime │    │
│  │ ★ 9.2 │ │ ★ 8.8 │ │ ★ 8.5 │    │
│  └───────┘ └───────┘ └───────┘    │
│                                     │
│  ▼ Recommandations pour vous        │
│  ┌───────┐ ┌───────┐ ┌───────┐    │
│  │ Anime │ │ Anime │ │ Anime │    │
│  └───────┘ └───────┘ └───────┘    │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │ Bottom Nav
└─────────────────────────────────────┘
```

**Éléments** :
- **Header** : Logo + Badge notifications + Avatar
- **Search bar** : Recherche rapide
- **Sections scrollables** :
  - Nouveaux épisodes (animes en cours avec nouveaux épisodes)
  - Populaires cette semaine
  - Recommandations personnalisées (basées sur mes goûts)
- Chaque section : **scroll horizontal** de cartes anime

**Interactions** :
- Clic sur anime → Fiche détaillée
- Clic sur notification → Liste notifications
- Clic sur avatar → Mon profil

---

## 4. ÉCRAN : SEARCH (Recherche)

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │ 🔍 One Piece         [X]    │   │ Search input actif
│  └─────────────────────────────┘   │
│                                     │
│  [Filtres ▼]                        │ Bouton filtres
│                                     │
│  ─── Résultats (124) ───            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] One Piece            │   │ Résultat 1
│  │         ★ 8.9 | 1050 ep      │   │
│  │         Shonen, Adventure    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] One Piece Film: Red │   │ Résultat 2
│  │         ★ 8.2 | Film         │   │
│  │         Shonen, Adventure    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] One Punch Man       │   │ Résultat 3
│  │         ★ 8.7 | 24 ep        │   │
│  │         Action, Comedy       │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │
└─────────────────────────────────────┘
```

### Modal Filtres

```
┌─────────────────────────────────────┐
│  Filtres          [Fermer] [Reset]  │
├─────────────────────────────────────┤
│                                     │
│  Genres                             │
│  ☑ Action    ☑ Adventure            │
│  ☐ Comedy    ☐ Drama                │
│  ☐ Fantasy   ☐ Horror               │
│  [Voir plus...]                     │
│                                     │
│  Année                              │
│  [2020] ────────●──── [2026]        │
│                                     │
│  Score                              │
│  [5.0] ────────●────── [10.0]       │
│                                     │
│  Statut                             │
│  ○ Tous                             │
│  ○ En cours de diffusion            │
│  ○ Terminé                          │
│                                     │
│  Nombre d'épisodes                  │
│  ○ Tous                             │
│  ○ < 13 (Court)                     │
│  ○ 13-26 (Saison)                   │
│  ○ > 26 (Long)                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Appliquer les filtres     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Fonctionnalités** :
- Recherche en temps réel (debounce 300ms)
- Filtres avancés (genres, année, score, statut)
- Tri : Popularité, Note, Titre, Date
- Résultats paginés (20 par page, infinite scroll)

---

## 5. ÉCRAN : ANIME DETAIL (Fiche anime)

```
┌─────────────────────────────────────┐
│  [←]                    [⋮ Menu]    │ Header transparent
│                                     │
│         [Cover Image]               │ Cover full width
│                                     │
├─────────────────────────────────────┤
│  One Piece                          │ Title
│  ★★★★★ 8.9/10  (1250 avis)         │ Rating
│                                     │
│  Shonen • Adventure • Fantasy       │ Genres (chips)
│  1997 • 1050 épisodes • En cours    │ Info
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ➕ Ajouter à ma liste      │   │ Action button
│  └─────────────────────────────┘   │
│                                     │
│  Synopsis                           │
│  Monkey D. Luffy rêve de devenir    │
│  le roi des pirates en trouvant...  │
│  [Lire la suite]                    │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │ Tabs
│  [Infos] [Reviews] [Groupes]        │
│                                     │
│  Studio: Toei Animation             │ Tab Infos actif
│  Diffusion: Oct 1999 - Actuel       │
│  Source: Manga                      │
│                                     │
│  ▼ Trailer                          │
│  [Video Thumbnail Play]             │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │
└─────────────────────────────────────┘
```

### Tab "Reviews"

```
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│  [Infos] [Reviews] [Groupes]        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Écrire une review            │ │ CTA button
│  └───────────────────────────────┘ │
│                                     │
│  ─── Reviews (1250) ───             │
│  Trier: [Les plus aimées ▼]        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [@Alice] ★★★★★ 10/10        │   │ Review card
│  │ Il y a 2 jours               │   │
│  │                              │   │
│  │ Chef-d'œuvre absolu ! Les    │   │
│  │ personnages sont...          │   │
│  │ [Lire plus]                  │   │
│  │                              │   │
│  │ ❤ 42   💬 5                 │   │ Actions
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [@Bob] ★★★★☆ 8.5/10         │   │
│  │ Il y a 1 semaine             │   │
│  │ Très bon anime mais...       │   │
│  │ ❤ 15   💬 2                 │   │
│  └─────────────────────────────┘   │
```

### Tab "Groupes"

```
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│  [Infos] [Reviews] [Groupes]        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏷️ Groupe Officiel          │   │ Badge
│  │                              │   │
│  │ Discussion - One Piece       │   │
│  │ 15.2k membres • Actif        │   │
│  │                              │   │
│  │ [Rejoindre] ──>              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─── Groupes personnalisés ───      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Fans Arc Wano                │   │
│  │ 842 membres • Privé          │   │
│  │ [@Créateur: Charlie]         │   │
│  │ [Rejoindre] ──>              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ➕ Créer un groupe          │   │
│  └─────────────────────────────┘   │
```

---

## 6. ÉCRAN : LIBRARY (Ma bibliothèque)

```
┌─────────────────────────────────────┐
│  Ma Bibliothèque     [⚙️ Paramètres]│
├─────────────────────────────────────┤
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │ Tabs horizontal
│  [À voir] [En cours] [Terminés]     │
│  [Abandonnés]                       │
│                                     │
│  ─── En cours (12) ───              │ Tab actif
│  Trier: [Dernière activité ▼]      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] Attack on Titan     │   │ Anime Card Extended
│  │                              │   │
│  │ ⚡ En cours | 24/25 épisodes │   │
│  │ ██████████░░ 96%             │   │ Progress bar
│  │                              │   │
│  │ [▶ Continuer]  [⋮]           │   │ Actions
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] Demon Slayer        │   │
│  │                              │   │
│  │ ⚡ En cours | 18/26 épisodes │   │
│  │ ████████░░░░ 69%             │   │
│  │                              │   │
│  │ [▶ Continuer]  [⋮]           │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │
└─────────────────────────────────────┘
```

### Options menu "⋮"

```
┌─────────────────────────┐
│ Modifier la progression │
│ Changer de statut       │
│ Noter et commenter      │
│ Voir la fiche           │
│ ───────────────────     │
│ Retirer de ma liste     │
└─────────────────────────┘
```

### Modal "Modifier progression"

```
┌─────────────────────────────────────┐
│  Attack on Titan     [X] Fermer     │
├─────────────────────────────────────┤
│                                     │
│  Épisodes vus                       │
│  ┌──────────┐  / 25 épisodes       │
│  │    24    │                       │
│  └──────────┘                       │
│       [-]  [+]                      │
│                                     │
│  Statut                             │
│  ○ À voir                           │
│  ● En cours                         │
│  ○ Terminé                          │
│  ○ Abandonné                        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Enregistrer             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 7. ÉCRAN : PROFILE (Mon profil)

```
┌─────────────────────────────────────┐
│           [⚙️ Paramètres]            │
├─────────────────────────────────────┤
│                                     │
│       ┌─────────┐                   │ Avatar + info
│       │ [Photo] │                   │
│       └─────────┘                   │
│         @Alice                      │
│      Membre depuis 2024             │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │ Stats
│  │  42  │ │ 156  │ │ 1.2k │        │
│  │Suivis│ │ Vus  │ │Likes │        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Modifier le profil         │   │ Button
│  └─────────────────────────────┘   │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │ Tabs
│  [Animes] [Reviews] [Activité]     │
│                                     │
│  ─── Mes animes (156) ───           │ Tab actif
│  Filtrer: [Tous ▼]                 │
│                                     │
│  Grid 3 colonnes:                   │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │    │ │    │ │    │              │ Anime covers
│  │ 1  │ │ 2  │ │ 3  │              │
│  └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐ ┌────┐              │
│  │ 4  │ │ 5  │ │ 6  │              │
│  └────┘ └────┘ └────┘              │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │
└─────────────────────────────────────┘
```

### Tab "Reviews"

```
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│  [Animes] [Reviews] [Activité]      │
│                                     │
│  ─── Mes reviews (23) ───           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] One Piece            │   │ Review card compact
│  │         ★★★★★ 10/10          │   │
│  │                              │   │
│  │ Chef-d'œuvre absolu ! Les... │   │
│  │                              │   │
│  │ ❤ 42   💬 5   Il y a 2 jours│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Cover] Death Note           │   │
│  │         ★★★★☆ 9.0/10         │   │
│  │ Suspense incroyable mais...  │   │
│  │ ❤ 18   💬 2   Il y a 1 sem.  │   │
│  └─────────────────────────────┘   │
```

---

## 8. ÉCRAN : CONVERSATIONS (Messagerie)

```
┌─────────────────────────────────────┐
│  Messages           [✏️ Nouveau]     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🔍 Rechercher...              │ │ Search
│  └───────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [@Bob]   Il y a 5 min    [2]│   │ Conversation 1
│  │ Salut ! Tu as vu le...       │   │ (2 non lus)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [@Charlie]   Il y a 2h       │   │ Conversation 2
│  │ Oui exactement ! C'était...  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [@David]   Il y a 1 jour     │   │ Conversation 3
│  │ Tu : Merci pour l'info 👍    │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │
└─────────────────────────────────────┘
```

### Écran Conversation (Chat)

```
┌─────────────────────────────────────┐
│  [←] @Bob                    [⋮]    │ Header
├─────────────────────────────────────┤
│                                     │
│         Il y a 2 jours              │ Date separator
│                                     │
│  ┌────────────────────┐             │ Message reçu
│  │ Salut ! Tu as vu le│             │ (aligné à gauche)
│  │ dernier épisode ?  │             │
│  └────────────────────┘             │
│  10:32                              │
│                                     │
│             ┌────────────────────┐  │ Message envoyé
│             │ Oui ! C'était incroyable!│ (aligné à droite)
│             │ Le combat était épique│  │
│             └────────────────────┘  │
│                            10:35 ✓✓ │
│                                     │
│  ┌────────────────────┐             │
│  │ Carrément ! J'ai...│             │
│  └────────────────────┘             │
│  10:37                              │
│                                     │
│         Aujourd'hui                 │
│                                     │
│             ┌────────────────────┐  │
│             │ Tu recommandes quoi │  │
│             │ comme prochain anime?│  │
│             └────────────────────┘  │
│                             15:20 ✓ │
│                                     │
├─────────────────────────────────────┤
│  [📎]  ┌──────────────────┐  [😊]  │ Input zone
│        │ Écrire...         │        │
│        └──────────────────┘  [📤]  │
└─────────────────────────────────────┘
```

**Fonctionnalités** :
- Indicateur "En train d'écrire..."
- Double check ✓✓ pour "lu"
- Horodatage des messages
- Scroll infini pour historique

---

## 9. ÉCRAN : GROUPE (Discussion groupe)

```
┌─────────────────────────────────────┐
│  [←] Discussion - One Piece  [⋮]    │ Header
│      15.2k membres • Actif          │ Info
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [@Admin] a épinglé:          │   │ Message épinglé
│  │ Bienvenue ! Règles du groupe │   │
│  │ en description.              │   │
│  └─────────────────────────────┘   │
│                                     │
│         Aujourd'hui                 │
│                                     │
│  [@Alice] • 10:30                   │ Message groupe
│  Qui a préféré l'épisode 1050 ?     │
│  ❤ 12  💬 5                         │
│                                     │
│  [@Bob] • 10:45                     │
│  Moi ! Le combat de Luffy était     │
│  incroyable 🔥                      │
│  ❤ 8                                │
│                                     │
│  [@Charlie] • 11:02                 │
│  Je suis d'accord, la...            │
│  ❤ 5                                │
│                                     │
│  [@David] • Il y a 5 min            │
│  Par contre l'animation était...    │
│  ❤ 3  💬 1                          │
│                                     │
├─────────────────────────────────────┤
│  ┌──────────────────┐        [😊]  │ Input
│  │ Écrire...         │        [📤]  │
│  └──────────────────┘               │
└─────────────────────────────────────┘
```

### Menu groupe "⋮"

```
┌─────────────────────────┐
│ Voir les membres        │
│ Rechercher messages     │
│ Notifications           │
│ ───────────────────     │
│ Quitter le groupe       │
└─────────────────────────┘
```

**Si modérateur :**
```
┌─────────────────────────┐
│ Voir les membres        │
│ Gérer les modérateurs   │
│ Épingler un message     │
│ Paramètres du groupe    │
│ ───────────────────     │
│ Quitter le groupe       │
│ Supprimer le groupe     │
└─────────────────────────┘
```

---

## 10. ÉCRAN : NOTIFICATIONS

```
┌─────────────────────────────────────┐
│  Notifications      [Tout marquer lu]│
├─────────────────────────────────────┤
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│  [Toutes] [Épisodes] [Social]       │ Tabs filtres
│                                     │
│  ─── Aujourd'hui ───                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔔 Nouvel épisode            │   │ Notification 1
│  │                              │   │ (non lue - fond bleu clair)
│  │ One Piece - Épisode 1051     │   │
│  │ disponible maintenant !      │   │
│  │                              │   │
│  │ Il y a 5 minutes             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ❤️ Nouveau follower          │   │ Notification 2
│  │                              │   │
│  │ @Bob a commencé à vous       │   │
│  │ suivre                       │   │
│  │                              │   │
│  │ Il y a 2 heures              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─── Hier ───                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💬 Nouveau message           │   │ Notification 3 (lue)
│  │                              │   │
│  │ @Charlie vous a envoyé un    │   │
│  │ message                      │   │
│  │                              │   │
│  │ Hier à 18:30                 │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Search] [+] [Library] [Me]  │
└─────────────────────────────────────┘
```

**Types de notifications** :
- 🔔 Nouvel épisode (violet)
- ❤️ Nouveau follower (rouge)
- 💬 Nouveau message (bleu)
- 👍 Like sur ma review (vert)
- 💭 Réponse dans un groupe (orange)

**États** :
- Non lue : fond Primary 50, texte en gras
- Lue : fond transparent, texte normal

---

## 11. ÉCRAN : PARAMÈTRES

```
┌─────────────────────────────────────┐
│  [←] Paramètres                     │
├─────────────────────────────────────┤
│                                     │
│  ───── Compte ─────                 │
│                                     │
│  Modifier le profil          [→]   │
│  Modifier l'email            [→]   │
│  Changer le mot de passe     [→]   │
│                                     │
│  ───── Notifications ─────          │
│                                     │
│  Nouveaux followers          [●]   │ Toggle ON
│  Nouveaux épisodes           [●]   │ Toggle ON
│  Messages privés             [●]   │ Toggle ON
│  Réponses groupes            [○]   │ Toggle OFF
│                                     │
│  ───── Préférences ─────            │
│                                     │
│  Thème                       [→]   │
│  Langue                      [→]   │
│  Qualité des images          [→]   │
│                                     │
│  ───── Confidentialité ─────        │
│                                     │
│  Profil public               [●]   │
│  Afficher mes statistiques   [●]   │
│                                     │
│  ───── Légal ─────                  │
│                                     │
│  Conditions d'utilisation    [→]   │
│  Politique de confidentialité [→]  │
│                                     │
│  ───── Support ─────                │
│                                     │
│  Aide & FAQ                  [→]   │
│  Signaler un problème        [→]   │
│                                     │
│  ───── ─────                        │
│                                     │
│  Se déconnecter                     │ Button danger
│  Supprimer mon compte               │ Button danger
│                                     │
│                                     │
│  Version 1.0.0                      │ Footer
│                                     │
└─────────────────────────────────────┘
```

---

## 12. COMPOSANTS RÉCURRENTS

### Loading State (Skeleton)

```
┌─────────────────────────────────────┐
│  ▒▒▒▒▒▒▒▒▒▒▒▒                       │ Skeleton title
│                                     │
│  ┌─────┐  ▒▒▒▒▒▒▒▒▒                │ Skeleton card
│  │▒▒▒▒▒│  ▒▒▒▒▒▒▒                  │
│  └─────┘  ▒▒▒▒                     │
│                                     │
│  ┌─────┐  ▒▒▒▒▒▒▒▒▒                │
│  │▒▒▒▒▒│  ▒▒▒▒▒▒▒                  │
│  └─────┘  ▒▒▒▒                     │
└─────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│           [Illustration]            │ Image ou icône
│                                     │
│       Aucun anime pour le moment    │ Message
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Découvrir des animes      │   │ CTA
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Modal Confirmation

```
┌─────────────────────────────────────┐
│                                     │
│        Supprimer cet anime ?        │ Title
│                                     │
│  Cette action est irréversible.     │ Message
│  Toutes vos données (notes,         │
│  progression) seront perdues.       │
│                                     │
│  ┌───────────┐  ┌───────────┐      │
│  │ Annuler   │  │ Supprimer │      │ Actions
│  └───────────┘  └───────────┘      │
│                                     │
└─────────────────────────────────────┘
```

---

## Navigation Flow (Flux principal)

```
Splash
  ↓
Onboarding (première fois)
  ↓
Login / Register
  ↓
Home (Tab 1)
  ↓
┌─────┬─────┬─────┬─────┬─────┐
│Home │Search│ + │Library│Me  │
└─────┴─────┴─────┴─────┴─────┘
  │      │     │     │     │
  │      │     │     │     ├─→ Profile
  │      │     │     │     ├─→ Settings
  │      │     │     │     └─→ Notifications
  │      │     │     │
  │      │     │     └─→ Library tabs
  │      │     │
  │      │     └─→ Add Quick Action
  │      │
  │      └─→ Search → Anime Detail
  │
  └─→ Anime Detail
        ├─→ Add to Library
        ├─→ Write Review
        └─→ Join Group → Group Chat
```

---

**Document créé le** : Janvier 2026
**Version** : 1.0
**Statut** : Prêt pour maquettage haute fidélité
