# Code Source AnimeTracker - React Native Expo

Ce dossier contient tous les fichiers de code à copier dans ton projet Expo une fois initialisé.

## 📋 Instructions

### 1. Initialise d'abord le projet Expo

Suis le guide [GUIDE_INSTALLATION.md](../GUIDE_INSTALLATION.md)

```bash
npx create-expo-app@latest AnimeTracker --template blank-typescript
cd AnimeTracker
npm install [toutes les dépendances listées dans le guide]
```

### 2. Copie les fichiers de ce dossier

Une fois le projet initialisé, copie tous les fichiers de `AnimeTracker-Code/src/` vers `AnimeTracker/src/`

### 3. Remplace App.tsx

Remplace le fichier `AnimeTracker/App.tsx` par celui fourni dans `AnimeTracker-Code/App.tsx`

### 4. Lance l'application

```bash
npm start
```

---

## 📁 Structure des fichiers fournis

```
AnimeTracker-Code/
├── App.tsx                    # Point d'entrée (à copier à la racine)
├── src/
│   ├── components/            # Composants réutilisables
│   ├── screens/              # Écrans
│   ├── navigation/           # Navigation
│   ├── services/             # API services
│   ├── store/                # Redux
│   ├── types/                # TypeScript types
│   └── utils/                # Constantes et utilitaires
```

---

## 🎨 Fonctionnalités implémentées

### Phase 1 (Prêt)
- ✅ Navigation (Bottom Tabs + Stack Navigator)
- ✅ Écrans principaux (Login, Home, Search, Library, Profile)
- ✅ Intégration Jikan API
- ✅ Thème et design system
- ✅ Composants UI de base

### Phase 2 (À venir)
- ⏳ State management Redux complet
- ⏳ Authentification (avec backend)
- ⏳ Gestion de la bibliothèque locale
- ⏳ Reviews et notes

---

**Commence par initialiser le projet Expo, puis reviens ici pour copier le code ! 🚀**
