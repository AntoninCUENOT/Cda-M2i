# Charte Graphique - AnimeTracker

## 1. Identité Visuelle

### Concept
AnimeTracker adopte une identité visuelle **moderne, dynamique et colorée**, inspirée de l'univers des animes tout en restant sobre et lisible.

**Mots-clés** : Moderne, Épuré, Dynamique, Vibrant, Accessible

---

## 2. Palette de Couleurs

### Couleurs Principales

#### **Primary (Violet/Pourpre)**
```
Primary 500 (Principale) : #8B5CF6
Primary 600 (Hover)      : #7C3AED
Primary 700 (Active)     : #6D28D9
Primary 400 (Light)      : #A78BFA
Primary 300 (Lighter)    : #C4B5FD
```
**Usage** : Boutons principaux, liens, éléments interactifs, badges "En cours"

#### **Secondary (Bleu Cyan)**
```
Secondary 500 : #06B6D4
Secondary 600 : #0891B2
Secondary 700 : #0E7490
```
**Usage** : Boutons secondaires, icônes, éléments d'accentuation

### Couleurs Sémantiques

#### **Success (Vert)**
```
Success 500 : #10B981
Success 600 : #059669
```
**Usage** : Messages de succès, statut "Terminé", badges positifs

#### **Warning (Orange)**
```
Warning 500 : #F59E0B
Warning 600 : #D97706
```
**Usage** : Alertes, statut "À voir"

#### **Error (Rouge)**
```
Error 500 : #EF4444
Error 600 : #DC2626
```
**Usage** : Erreurs, suppression, statut "Abandonné", badges de danger

#### **Info (Bleu)**
```
Info 500 : #3B82F6
Info 600 : #2563EB
```
**Usage** : Informations, tooltips, notifications

### Couleurs Neutres (Dark Mode Ready)

#### **Mode Clair (Light Mode)**
```
Background    : #FFFFFF
Surface       : #F9FAFB
Surface Dark  : #F3F4F6
Border        : #E5E7EB
Text Primary  : #111827
Text Secondary: #6B7280
Text Disabled : #9CA3AF
```

#### **Mode Sombre (Dark Mode - Optionnel V2)**
```
Background    : #0F172A
Surface       : #1E293B
Surface Light : #334155
Border        : #475569
Text Primary  : #F1F5F9
Text Secondary: #94A3B8
Text Disabled : #64748B
```

### Dégradés (Optionnels)

```
Gradient Hero : linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)
Gradient Card : linear-gradient(180deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.1) 100%)
```

---

## 3. Typographie

### Police Principale : **Inter** (Google Fonts)

```
Famille    : 'Inter', sans-serif
Poids      : 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
Import URL : https://fonts.google.com/specimen/Inter
```

**Raison du choix** :
- Excellente lisibilité sur mobile
- Moderne et neutre
- Optimisée pour les écrans
- Support complet des caractères

### Hiérarchie Typographique

#### **Titres**
```
H1 (Page Title)
  Font Size  : 28px
  Font Weight: 700 (Bold)
  Line Height: 36px
  Color      : Text Primary

H2 (Section Title)
  Font Size  : 24px
  Font Weight: 600 (SemiBold)
  Line Height: 32px
  Color      : Text Primary

H3 (Card Title)
  Font Size  : 18px
  Font Weight: 600 (SemiBold)
  Line Height: 24px
  Color      : Text Primary

H4 (Subtitle)
  Font Size  : 16px
  Font Weight: 600 (SemiBold)
  Line Height: 22px
  Color      : Text Primary
```

#### **Corps de texte**
```
Body Large
  Font Size  : 16px
  Font Weight: 400 (Regular)
  Line Height: 24px
  Color      : Text Primary

Body Regular (par défaut)
  Font Size  : 14px
  Font Weight: 400 (Regular)
  Line Height: 20px
  Color      : Text Primary

Body Small
  Font Size  : 12px
  Font Weight: 400 (Regular)
  Line Height: 16px
  Color      : Text Secondary

Caption
  Font Size  : 11px
  Font Weight: 400 (Regular)
  Line Height: 14px
  Color      : Text Secondary
  Text Transform: uppercase (optionnel)
```

#### **Boutons**
```
Button Large
  Font Size  : 16px
  Font Weight: 600 (SemiBold)
  Letter Spacing: 0.2px

Button Regular
  Font Size  : 14px
  Font Weight: 600 (SemiBold)
  Letter Spacing: 0.2px

Button Small
  Font Size  : 12px
  Font Weight: 600 (SemiBold)
  Letter Spacing: 0.3px
```

---

## 4. Composants UI

### Boutons

#### **Bouton Primary (Principal)**
```
Background    : Primary 500 (#8B5CF6)
Text Color    : White
Border Radius : 8px
Padding       : 12px 24px (vertical horizontal)
Font Weight   : 600 (SemiBold)
Box Shadow    : 0 2px 4px rgba(139, 92, 246, 0.2)

Hover:
  Background  : Primary 600 (#7C3AED)
  Box Shadow  : 0 4px 8px rgba(139, 92, 246, 0.3)

Active (pressed):
  Background  : Primary 700 (#6D28D9)
  Box Shadow  : 0 1px 2px rgba(139, 92, 246, 0.2)

Disabled:
  Background  : #E5E7EB
  Text Color  : #9CA3AF
  Box Shadow  : none
```

#### **Bouton Secondary (Secondaire)**
```
Background    : Transparent
Text Color    : Primary 500
Border        : 2px solid Primary 500
Border Radius : 8px
Padding       : 10px 22px

Hover:
  Background  : Primary 50 (rgba(139, 92, 246, 0.05))
  Border Color: Primary 600
```

#### **Bouton Ghost (Tertiary)**
```
Background    : Transparent
Text Color    : Primary 500
Border        : none
Padding       : 8px 16px

Hover:
  Background  : rgba(139, 92, 246, 0.08)
```

#### **Bouton Icon (Icône seule)**
```
Size          : 40x40px
Background    : Transparent
Icon Color    : Text Secondary
Border Radius : 8px

Hover:
  Background  : Surface Dark (#F3F4F6)
  Icon Color  : Primary 500
```

### Cartes (Cards)

#### **Anime Card (Carte anime)**
```
Width         : 160px
Height        : Auto
Background    : White
Border        : 1px solid Border (#E5E7EB)
Border Radius : 12px
Box Shadow    : 0 2px 8px rgba(0, 0, 0, 0.04)
Padding       : 0

Structure:
  ┌─────────────────┐
  │   Image 160px   │ Ratio 3:4 (Cover anime)
  │   Height 213px  │
  ├─────────────────┤
  │ Title (2 lines) │ Padding: 12px
  │ Rating ★ 8.5    │
  │ 24 épisodes     │
  └─────────────────┘

Hover:
  Box Shadow    : 0 4px 16px rgba(139, 92, 246, 0.15)
  Transform     : translateY(-4px)
  Border Color  : Primary 300
```

#### **Review Card (Carte review)**
```
Background    : White
Border        : 1px solid Border
Border Radius : 12px
Padding       : 16px
Box Shadow    : 0 1px 4px rgba(0, 0, 0, 0.04)

Structure:
  ┌─────────────────────────────┐
  │ [Avatar] Username           │ Header
  │          ★★★★★ 9.5/10       │
  │                             │
  │ Commentaire texte...        │ Body
  │ Lorem ipsum dolor sit...    │
  │                             │
  │ [Like 15] [Répondre]        │ Footer
  └─────────────────────────────┘
```

#### **Message Bubble (Bulle message)**
```
Envoyé (par moi):
  Background    : Primary 500
  Text Color    : White
  Border Radius : 16px 16px 4px 16px
  Padding       : 12px 16px
  Align         : Right
  Max Width     : 75%

Reçu:
  Background    : Surface (#F9FAFB)
  Text Color    : Text Primary
  Border Radius : 16px 16px 16px 4px
  Padding       : 12px 16px
  Align         : Left
  Max Width     : 75%
```

### Inputs (Champs de saisie)

#### **Text Input**
```
Height        : 48px
Background    : White
Border        : 1px solid Border (#E5E7EB)
Border Radius : 8px
Padding       : 12px 16px
Font Size     : 14px

Focus:
  Border Color  : Primary 500
  Box Shadow    : 0 0 0 3px rgba(139, 92, 246, 0.1)

Error:
  Border Color  : Error 500
  Box Shadow    : 0 0 0 3px rgba(239, 68, 68, 0.1)
```

#### **Search Bar**
```
Height        : 44px
Background    : Surface (#F9FAFB)
Border        : 1px solid transparent
Border Radius : 22px (full rounded)
Padding       : 12px 16px 12px 44px (left padding pour icône)
Icon          : Search icon 20px, position left 12px

Focus:
  Background    : White
  Border Color  : Primary 300
  Box Shadow    : 0 2px 8px rgba(139, 92, 246, 0.1)
```

### Badges (Étiquettes)

#### **Status Badges**
```
À voir:
  Background : Warning 100 (rgba(245, 158, 11, 0.1))
  Text Color : Warning 700
  Border     : 1px solid Warning 200

En cours:
  Background : Primary 100
  Text Color : Primary 700
  Border     : 1px solid Primary 200

Terminé:
  Background : Success 100
  Text Color : Success 700
  Border     : 1px solid Success 200

Abandonné:
  Background : Error 100
  Text Color : Error 700
  Border     : 1px solid Error 200

Style commun:
  Font Size     : 12px
  Font Weight   : 600 (SemiBold)
  Padding       : 4px 10px
  Border Radius : 12px (full rounded)
```

### Navigation

#### **Bottom Tab Bar (Barre de navigation)**
```
Height        : 64px
Background    : White
Border Top    : 1px solid Border (#E5E7EB)
Box Shadow    : 0 -2px 8px rgba(0, 0, 0, 0.04)
Padding       : 8px 0

Tab Item:
  Width       : Auto (flex 1)
  Icon Size   : 24px
  Label Size  : 11px
  Gap         : 4px

  Active:
    Icon Color  : Primary 500
    Label Color : Primary 500
    Font Weight : 600

  Inactive:
    Icon Color  : Text Secondary (#6B7280)
    Label Color : Text Secondary
    Font Weight : 400
```

#### **Header / App Bar**
```
Height        : 56px
Background    : White
Border Bottom : 1px solid Border
Padding       : 0 16px

Elements:
  - Back button (left)
  - Title (center or left)
  - Action buttons (right)
```

---

## 5. Iconographie

### Bibliothèque d'icônes : **Lucide Icons**

**URL** : https://lucide.dev/
**Style** : Outline (trait fin), moderne, cohérent

**Taille des icônes** :
- Small : 16px
- Regular : 20px
- Large : 24px
- Extra Large : 32px

### Icônes principales

```
Home         : home
Search       : search
Library      : book-marked
Profile      : user
Notification : bell
Message      : message-circle
Settings     : settings
Add          : plus
Star         : star (filled ou outline)
Heart        : heart
Comment      : message-square
Share        : share-2
Menu         : menu
Back         : arrow-left
Close        : x
Check        : check
Play         : play-circle
Calendar     : calendar
Clock        : clock
Filter       : filter
```

---

## 6. Espacements (Spacing)

Système basé sur un **multiple de 4px** :

```
spacing-1  : 4px
spacing-2  : 8px
spacing-3  : 12px
spacing-4  : 16px
spacing-5  : 20px
spacing-6  : 24px
spacing-8  : 32px
spacing-10 : 40px
spacing-12 : 48px
spacing-16 : 64px
```

**Marges internes (Padding)** :
- Screen padding : 16px
- Card padding : 16px
- Button padding : 12px 24px
- Input padding : 12px 16px

**Marges externes (Margin)** :
- Entre sections : 24px
- Entre éléments : 12px
- Entre cartes : 16px

---

## 7. Ombres (Shadows)

```
shadow-sm (Petite):
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

shadow-md (Moyenne):
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

shadow-lg (Grande):
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

shadow-xl (Extra grande):
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
```

---

## 8. Bordures (Borders)

```
Border Width  : 1px (standard)
Border Color  : #E5E7EB

Border Radius:
  Small  : 4px
  Medium : 8px
  Large  : 12px
  XLarge : 16px
  Full   : 9999px (rounded-full, pour pills et avatars)
```

---

## 9. Animations & Transitions

```css
/* Transitions standards */
transition: all 0.2s ease-in-out;

/* Hover scale */
transform: scale(1.02);

/* Slide up */
transform: translateY(-4px);

/* Fade in */
animation: fadeIn 0.3s ease-in;
```

**Durées** :
- Quick : 150ms
- Normal : 200ms
- Slow : 300ms

---

## 10. Accessibilité

### Contraste
Tous les textes respectent **WCAG AA** :
- Texte normal : ratio minimum 4.5:1
- Texte large : ratio minimum 3:1

### Tailles tactiles
- Boutons : minimum 44x44px (recommandation iOS/Android)
- Zone cliquable : minimum 48x48px

### États focus
Tous les éléments interactifs ont un état focus visible :
```
Outline : 3px solid Primary 300
Offset  : 2px
```

---

## 11. Export pour Développement

### Variables CSS (Custom Properties)

```css
:root {
  /* Colors */
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  --color-secondary-500: #06B6D4;
  --color-success-500: #10B981;
  --color-warning-500: #F59E0B;
  --color-error-500: #EF4444;

  /* Neutrals */
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 14px;
  --line-height-base: 1.5;

  /* Spacing */
  --spacing-4: 16px;
  --spacing-8: 32px;

  /* Border Radius */
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

---

**Version** : 1.0
**Date** : Janvier 2026
**Statut** : Approuvé pour développement
