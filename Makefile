.PHONY: help dev build prod down clean logs

help:
	@echo "Available commands:"
	@echo "  make dev    - Start development container (hot reload)"
	@echo "  make build  - Build production image"
	@echo "  make prod   - Start production container"
	@echo "  make down   - Stop all containers"
	@echo "  make clean  - Remove containers, images and volumes"
	@echo "  make logs   - Show container logs"

# Desarrollo - hot reload
dev:
	docker compose up dev

# Build de producción
build:
	docker compose build prod

# Producción
prod:
	docker compose up --build prod

# Detener contenedores
down:
	docker compose down

# Destruir todo (contenedores + imágenes + volúmenes)
clean:
	docker compose down --rmi all -v

# Ver logs
logs:
	docker compose logs -f

# Dev en background
dev-bg:
	docker compose up -d dev

# Prod en background
prod-bg:
	docker compose up -d prod