# Guide d'Installation - AnimeTracker React Native

## Prérequis

Avant de commencer, tu dois installer :

### 1. Node.js (obligatoire)

**Téléchargement** : https://nodejs.org/

- Version recommandée : **Node.js 18 LTS** ou supérieur
- Inclut npm automatiquement

**Vérification de l'installation** :
```bash
node --version    # Devrait afficher v18.x.x ou supérieur
npm --version     # Devrait afficher 9.x.x ou supérieur
```

### 2. Git (recommandé)

**Téléchargement** : https://git-scm.com/downloads

### 3. Expo Go (pour tester sur mobile)

**Sur ton smartphone** :
- iOS : https://apps.apple.com/app/expo-go/id982107779
- Android : https://play.google.com/store/apps/details?id=host.exp.exponent

---

## Installation du projet

### Étape 1 : Créer le projet Expo

Ouvre un terminal dans `C:\Users\acw80\Documents\VS CODE\Projet CDA\` et exécute :

```bash
npx create-expo-app@latest AnimeTracker --template blank-typescript
```

Attends que l'installation se termine (2-3 minutes).

### Étape 2 : Accéder au projet

```bash
cd AnimeTracker
```

### Étape 3 : Installer les dépendances principales

```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux
npm install axios
npm install @expo/vector-icons
npm install react-native-reanimated react-native-gesture-handler
```

### Étape 4 : Installer les dépendances de développement

```bash
npm install --save-dev @types/react @types/react-native
```

---

## Lancer l'application

### Option 1 : Sur ton smartphone (Recommandé)

1. **Démarrer le serveur de développement** :
```bash
npm start
```

2. **Scanner le QR code** :
   - Ouvre l'app **Expo Go** sur ton smartphone
   - Scanne le QR code qui apparaît dans le terminal
   - L'app se charge automatiquement

### Option 2 : Sur émulateur Android (si installé)

```bash
npm run android
```

### Option 3 : Sur simulateur iOS (Mac uniquement)

```bash
npm run ios
```

### Option 4 : Sur le web (pour tester rapidement)

```bash
npm run web
```

---

## Structure du projet (que je vais créer)

```
AnimeTracker/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── AnimeCard.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── screens/          # Écrans de l'application
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── search/
│   │   │   └── SearchScreen.tsx
│   │   ├── library/
│   │   │   └── LibraryScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── navigation/       # Configuration de navigation
│   │   ├── AppNavigator.tsx
│   │   └── BottomTabNavigator.tsx
│   ├── store/           # Redux store
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── animesSlice.ts
│   │   │   └── ...
│   ├── services/        # API services
│   │   ├── api.ts
│   │   ├── jikanApi.ts
│   │   └── authService.ts
│   ├── types/           # TypeScript types
│   │   ├── anime.ts
│   │   ├── user.ts
│   │   └── ...
│   ├── utils/           # Utilitaires
│   │   ├── constants.ts
│   │   ├── colors.ts
│   │   └── ...
│   └── hooks/           # Custom hooks
│       └── useAuth.ts
├── assets/              # Images, fonts, etc.
├── App.tsx              # Point d'entrée
├── app.json             # Configuration Expo
├── package.json
└── tsconfig.json
```

---

## Commandes utiles

```bash
npm start              # Démarrer le serveur de développement
npm run android        # Lancer sur Android
npm run ios            # Lancer sur iOS (Mac uniquement)
npm run web            # Lancer sur le web
npm install [package]  # Installer une dépendance
npm run lint           # Linter le code (si configuré)
```

---

## Prochaines étapes

Une fois le projet initialisé, je vais créer :

1. ✅ Structure de dossiers complète
2. ✅ Configuration de navigation (Bottom Tabs + Stack)
3. ✅ Thème et constantes (couleurs, typographie)
4. ✅ Composants de base (Button, Input, Card)
5. ✅ Écrans principaux (Login, Home, Search, Library, Profile)
6. ✅ Intégration Jikan API
7. ✅ State management avec Redux

---

**Une fois Node.js installé et le projet créé, reviens me voir et on continuera avec le code ! 🚀**
