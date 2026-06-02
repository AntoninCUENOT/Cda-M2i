# Guide des Maquettes - AnimeTracker

## 📋 Documents disponibles

### 1. [Charte Graphique](charte-graphique.md)
Définit l'identité visuelle complète :
- Palette de couleurs (primaires, sémantiques, neutres)
- Typographie (Inter, hiérarchie)
- Composants UI (boutons, cartes, inputs, badges)
- Espacements, ombres, bordures
- Variables CSS prêtes pour le développement

### 2. [Wireframes & Descriptions](wireframes-descriptions.md)
Spécifications détaillées de tous les écrans :
- 12 écrans principaux décrits en ASCII art
- Structure et agencement des éléments
- Navigation et flux utilisateur
- États (loading, empty, error)
- Composants récurrents

---

## 🎨 Création des maquettes haute fidélité avec Figma

### Étape 1 : Créer un compte Figma

1. Aller sur [figma.com](https://www.figma.com)
2. Créer un compte gratuit (Plan Starter - suffisant pour ce projet)
3. Créer un nouveau fichier : "AnimeTracker - Maquettes"

---

### Étape 2 : Configuration du fichier

#### **Frame mobile**
```
- Créer un Frame iPhone 14 Pro (393 x 852 px)
- Ou Android (360 x 800 px)
- Utiliser Auto Layout pour composants réutilisables
```

#### **Pages Figma** (organisation)
```
📄 Cover (présentation)
📄 Design System (composants réutilisables)
📄 Wireframes (basse fidélité - optionnel)
📄 Maquettes (haute fidélité)
📄 Prototypes (avec interactions)
```

---

### Étape 3 : Créer le Design System

#### **1. Couleurs (Styles)**

Créer les styles de couleur dans Figma :

**Menu** : Right Panel > Fill > Style Icon > "+"

```
Primaires:
- Primary/500 → #8B5CF6
- Primary/600 → #7C3AED
- Primary/700 → #6D28D9
- Primary/400 → #A78BFA
- Primary/300 → #C4B5FD

Secondaires:
- Secondary/500 → #06B6D4
- Secondary/600 → #0891B2

Sémantiques:
- Success/500 → #10B981
- Warning/500 → #F59E0B
- Error/500 → #EF4444
- Info/500 → #3B82F6

Neutres:
- Background → #FFFFFF
- Surface → #F9FAFB
- Border → #E5E7EB
- Text/Primary → #111827
- Text/Secondary → #6B7280
```

#### **2. Typographie (Text Styles)**

**Menu** : Text > Style Icon > "+"

```
Titres:
- H1/Bold → Inter, 28px, Bold, 36px line height
- H2/SemiBold → Inter, 24px, SemiBold, 32px
- H3/SemiBold → Inter, 18px, SemiBold, 24px

Corps:
- Body/Large → Inter, 16px, Regular, 24px
- Body/Regular → Inter, 14px, Regular, 20px
- Body/Small → Inter, 12px, Regular, 16px
- Caption → Inter, 11px, Regular, 14px

Boutons:
- Button/Large → Inter, 16px, SemiBold
- Button/Regular → Inter, 14px, SemiBold
- Button/Small → Inter, 12px, SemiBold
```

#### **3. Effets (Effects)**

**Menu** : Effects > Style Icon > "+"

```
Ombres:
- shadow-sm → Blur 2px, Y 1px, rgba(0,0,0,0.04)
- shadow-md → Blur 8px, Y 2px, rgba(0,0,0,0.08)
- shadow-lg → Blur 16px, Y 4px, rgba(0,0,0,0.12)
- shadow-xl → Blur 32px, Y 8px, rgba(0,0,0,0.16)
```

#### **4. Composants (Components)**

Créer des composants réutilisables avec **variants** :

##### **Bouton Primary**
```
Variants:
- Default
- Hover
- Active
- Disabled

Props:
- Size: Large, Regular, Small
- Icon: None, Left, Right
```

##### **Input Field**
```
Variants:
- Default
- Focus
- Error
- Disabled

Props:
- Type: Text, Email, Password, Search
- Icon: None, Left, Right
```

##### **Anime Card**
```
Variants:
- Default
- Hover

Props:
- Badge: None, "En cours", "À voir", etc.
```

##### **Bottom Tab Bar**
```
Variants:
- Tab active/inactive

Props:
- Icon + Label
```

---

### Étape 4 : Créer les maquettes écran par écran

#### **Ordre recommandé :**

1. **Authentification**
   - Splash Screen
   - Onboarding (3 slides)
   - Login
   - Register

2. **Navigation principale**
   - Home
   - Search
   - Library
   - Profile

3. **Détails**
   - Anime Detail (3 tabs)
   - Review Modal
   - Add to Library Modal

4. **Social**
   - Conversations
   - Chat
   - Group Chat

5. **Autres**
   - Notifications
   - Settings

#### **Conseils pratiques :**

- **Utiliser Auto Layout** pour tous les containers (padding, spacing automatiques)
- **Créer des instances** des composants (ne pas dupliquer)
- **Utiliser des plugins** :
  - "Unsplash" pour images d'animes (placeholder)
  - "Iconify" pour les icônes Lucide
  - "Content Reel" pour textes de remplissage
- **Nommer correctement** les layers : "Home/Header", "Card/AnimeCard"

---

### Étape 5 : Créer le prototype interactif

#### **Connexions entre écrans :**

```
Splash → Onboarding → Login → Home

Home:
- Tap anime card → Anime Detail
- Tap search bar → Search
- Tap notification icon → Notifications
- Bottom tab navigation

Anime Detail:
- Tap "Ajouter" → Modal Add to Library
- Tap "Écrire review" → Review Modal
- Tap groupe → Group Chat

Search:
- Tap result → Anime Detail

Library:
- Tap anime → Modal progression
- Swipe left → Delete

Profile:
- Tap settings icon → Settings
```

#### **Interactions** :

Dans Figma, sélectionne un élément cliquable :
1. Mode Prototype (raccourci Shift + E)
2. Créer une connexion (drag depuis le cercle bleu)
3. Choisir la destination
4. Animation : "Smart Animate" ou "Move In"
5. Durée : 200-300ms

---

### Étape 6 : Présentation & Export

#### **Mode Présentation**

Figma génère automatiquement un lien de présentation :
```
Share > Get Link > Can view prototype
```

Tu peux présenter en mode "Phone Frame" pour simuler un vrai téléphone.

#### **Export pour développement**

**Images & Assets :**
```
Sélectionner un élément > Export > PNG/SVG
```

**Spécifications CSS :**
```
Sélectionner un élément > Inspect (right panel)
Copier les specs (padding, margin, colors)
```

**Export de composants :**
- Exporter les icônes en SVG
- Exporter les images en @2x et @3x (Retina)

---

## 📱 Checklist des écrans à créer

### ✅ MVP (Version 1.0 - Prioritaire)

- [ ] Splash Screen
- [ ] Onboarding (3 slides)
- [ ] Login
- [ ] Register
- [ ] Home
- [ ] Search
- [ ] Search Results
- [ ] Anime Detail
- [ ] Add to Library Modal
- [ ] Library (4 tabs : À voir, En cours, Terminés, Abandonnés)
- [ ] Profile
- [ ] Edit Profile
- [ ] Write Review Modal
- [ ] Notifications
- [ ] Settings

**Total : 15 écrans MVP**

### 📋 Version 1.5 (Social)

- [ ] Conversations List
- [ ] Chat (1-to-1)
- [ ] User Profile (autre utilisateur)
- [ ] Followers/Following List
- [ ] Reviews List (d'un anime)

**Total : +5 écrans**

### 🎯 Version 2.0 (Groupes)

- [ ] Group Detail
- [ ] Group Chat
- [ ] Create Group Modal
- [ ] Group Members
- [ ] Group Settings

**Total : +5 écrans**

---

## 🎨 Assets nécessaires

### Images

1. **Logo AnimeTracker** : À créer ou utiliser une icône + texte
2. **Illustrations Onboarding** : 3 illustrations anime (Unsplash ou Freepik)
3. **Covers d'animes** : Utiliser plugin Unsplash avec query "anime"
4. **Avatar placeholder** : Icône user générique

### Icônes

Toutes disponibles sur [Lucide.dev](https://lucide.dev) :
- home, search, plus, bookmark, user
- bell, message-circle, settings, star, heart
- play-circle, calendar, filter, menu, arrow-left, x, check

**Installation Figma** :
- Plugin "Iconify" → Rechercher "Lucide" → Insérer icônes

---

## 🚀 Alternatives à Figma

Si tu préfères un autre outil :

### **Adobe XD**
- Gratuit, similaire à Figma
- Auto-animate puissant
- Moins collaboratif

### **Sketch** (Mac uniquement)
- Référence du design UI/UX
- Payant (99$/an)
- Très complet

### **Penpot** (Open source)
- Alternative gratuite à Figma
- Interface similaire
- Auto-hébergeable

### **Justinmind** / **Balsamiq**
- Outils de wireframing rapide
- Moins adapté pour haute fidélité

---

## 📚 Ressources complémentaires

### **Inspiration design**

- [Dribbble](https://dribbble.com) : Recherche "anime app", "mobile app"
- [Behance](https://behance.net) : Projets de design mobile
- [Mobbin](https://mobbin.com) : Screenshots d'apps mobiles réelles
- [UI8](https://ui8.net) : Templates et kits UI

### **UI Kits Figma gratuits**

- [Material Design 3](https://www.figma.com/community) (Google)
- [iOS 17 UI Kit](https://www.figma.com/community)
- [Ant Design Mobile](https://www.figma.com/community)

Tu peux t'en inspirer pour les composants de base.

### **Tutoriels Figma**

- [Figma Learn](https://help.figma.com/hc/en-us) : Tutoriels officiels
- [Figma for Beginners](https://www.youtube.com/watch?v=Cx2dkpBxst8) (YouTube)
- [Mobile App Design](https://www.youtube.com/results?search_query=figma+mobile+app+design)

---

## ⏱️ Estimation de temps

### Figma (débutant)

| Tâche | Durée estimée |
|-------|---------------|
| Setup Design System | 2-3 heures |
| Création composants | 2-3 heures |
| Maquettes MVP (15 écrans) | 8-12 heures |
| Prototype interactif | 2-3 heures |
| **Total** | **14-21 heures** |

### Figma (expérimenté)

| Tâche | Durée estimée |
|-------|---------------|
| Setup + Composants | 2-3 heures |
| Maquettes MVP | 4-6 heures |
| Prototype | 1-2 heures |
| **Total** | **7-11 heures** |

**Conseil** : Fais d'abord les 5-6 écrans principaux, puis complète progressivement.

---

## 📤 Livrables pour le dossier CDA

### **Pour la soutenance :**

1. **Lien Figma** (view-only) : Jury peut naviguer dans le prototype
2. **PDF des maquettes** : Export de tous les écrans en PDF
3. **Vidéo prototype** : Enregistrement du parcours utilisateur (2-3 min)

### **Export Figma vers PDF** :

```
File > Export Frames to PDF
- Sélectionner tous les écrans
- Export in 2x (pour meilleure qualité)
```

### **Enregistrer une vidéo** :

```
Présenter en mode Prototype
Utiliser OBS Studio ou QuickTime pour capturer l'écran
Simuler le parcours utilisateur complet
```

---

## ✅ Validation des maquettes

Avant de passer au développement, vérifie :

- [ ] Tous les écrans MVP sont créés
- [ ] Design System complet (couleurs, typo, composants)
- [ ] Prototype interactif fonctionnel
- [ ] Navigation logique et fluide
- [ ] Cohérence visuelle entre écrans
- [ ] Accessibilité (contraste, tailles tactiles)
- [ ] Feedback visuel sur actions (hover, active, disabled)
- [ ] États (loading, empty, error) définis
- [ ] Responsive (optionnel : vérifier sur différentes tailles)

---

## 🎯 Prochaine étape : Développement

Une fois les maquettes validées :

1. **Export des assets** (icônes SVG, images)
2. **Extraction des specs CSS** (depuis Figma Inspect)
3. **Création du projet React Native** avec structure de fichiers
4. **Implémentation écran par écran** en suivant les maquettes

Les maquettes servent de **référence unique** pour tout le développement frontend.

---

**Document créé le** : Janvier 2026
**Version** : 1.0
**Auteur** : Concepteur Développeur d'Applications (CDA)
