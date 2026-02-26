
# QuizIA

QuizIA est une application web complète permettant de générer, jouer et corriger des quiz personnalisés grâce à l'intelligence artificielle.

## Aperçu de l'architecture

- **Frontend** : React + TypeScript + Vite, gestion d'état avec Zustand, UI moderne avec TailwindCSS.
- **Backend** : Go (Gin), API REST, génération de quiz via OpenRouter AI, persistance MongoDB, authentification OAuth (Google).
- **Base de données** : MongoDB (Docker).

## Fonctionnalités principales

- Authentification sécurisée via Google OAuth
- Génération de quiz IA sur n'importe quel sujet, niveau et type de question
- Jouer et répondre aux quiz, correction automatique
- Tableau de bord utilisateur, suivi des scores et historique
- UI responsive et moderne

## Démarrage rapide

### Prérequis
- Go >= 1.25
- Node.js >= 18
- Docker (pour MongoDB)

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-utilisateur/QuizIA.git
cd QuizIA
```

### 2. Lancer la base de données MongoDB
```bash
make docker-run
```

### 3. Configurer les variables d'environnement
Créer un fichier `.env` à la racine avec :
```
MONGODB_URI=mongodb://<user>:<password>@localhost:<port>/<database>
MONGODB_DATABASE=quizia
GOOGLE_CLIENT_ID=...
GOOGLE_SECRET_ID=...
PORT=8080
BLUEPRINT_DB_PORT=27017
BLUEPRINT_DB_USERNAME=...
BLUEPRINT_DB_ROOT_PASSWORD=...
```

### 4. Installer les dépendances et lancer le backend
```bash
make build
make run
```

### 5. Installer les dépendances et lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

L'application frontend sera accessible sur [http://localhost:5173](http://localhost:5173)

## Scripts utiles

- `make build` : build du backend
- `make run` : lance backend + frontend
- `make test` : lance les tests Go
- `make docker-run` : démarre MongoDB via Docker
- `make docker-down` : arrête MongoDB
- `make watch` : live reload backend (air)

## Structure du projet

```
QuizIA/
├── cmd/api/main.go         # Entrée du serveur Go
├── internal/               # Backend (routes, modèles, IA, DB, auth)
├── frontend/               # Frontend React (src, composants, pages, stores)
├── docker-compose.yml      # Stack MongoDB
├── Makefile                # Commandes build/run/test
└── README.md               # Ce fichier
```

## Contribution

Les contributions sont les bienvenues ! Ouvrez une issue ou une pull request.

## Licence

MIT
