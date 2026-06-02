# Documentation de Conception - AnimeTracker

## Structure du projet

```
conception/
├── uml/                    # Diagrammes UML
│   └── diagramme-cas-utilisation.puml
├── mcd/                    # Modèles de données (MCD, MLD, MPD)
└── README.md              # Ce fichier

documentation/              # Documentation technique et fonctionnelle
```

## Comment générer les diagrammes UML

### Option 1 : Utiliser PlantUML en ligne (le plus simple)
1. Aller sur https://www.plantuml.com/plantuml/uml/
2. Copier le contenu du fichier `.puml`
3. Coller dans l'éditeur en ligne
4. Le diagramme se génère automatiquement
5. Télécharger en PNG ou SVG

### Option 2 : Extension VSCode (recommandé)
1. Installer l'extension "PlantUML" dans VSCode
2. Installer Java (requis pour PlantUML)
3. Ouvrir le fichier `.puml`
4. Appuyer sur `Alt+D` pour prévisualiser
5. Clic droit > "Export Current Diagram" pour sauvegarder en image

### Option 3 : CLI PlantUML
```bash
# Installer PlantUML
npm install -g node-plantuml

# Générer le diagramme
puml generate conception/uml/diagramme-cas-utilisation.puml -o conception/uml/
```

## Diagrammes à créer

- [x] Diagramme de cas d'utilisation
- [ ] Diagramme de classes
- [ ] Diagrammes de séquence (principaux scénarios)
- [ ] Diagramme d'activité (workflows complexes)
- [ ] Diagramme de composants (architecture)

## Modélisation des données

- [ ] MCD (Modèle Conceptuel de Données)
- [ ] MLD (Modèle Logique de Données)
- [ ] MPD (Modèle Physique de Données)
- [ ] Scripts SQL de création de base de données
