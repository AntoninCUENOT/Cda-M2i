# ==============================
# AnimeTracker — Commandes Docker
# ==============================

# Démarrer PostgreSQL + Redis uniquement (sans backend)
db-up:
	docker compose --env-file .env up postgres redis -d

# Démarrer tous les services (PostgreSQL + Redis + Backend)
up:
	docker compose --env-file .env --profile full up -d

# Arrêter tous les services
down:
	docker compose down

# Arrêter et supprimer les volumes (remet la BDD à zéro)
reset:
	docker compose down -v

# Voir les logs
logs:
	docker compose logs -f

# Logs PostgreSQL uniquement
logs-db:
	docker compose logs -f postgres

# Logs Redis uniquement
logs-redis:
	docker compose logs -f redis

# Statut des conteneurs
status:
	docker compose ps

# Accéder au shell PostgreSQL
psql:
	docker exec -it animetracker_postgres psql -U animetracker_user -d animetracker

# Accéder au shell Redis
redis-cli:
	docker exec -it animetracker_redis redis-cli
