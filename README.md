# inCNV

## Requirement

1. Docker

Run inCNV

```
docker-compose up -d
```

## How to config

```
  incnv-backend:
    image: saowwapark/incnv-backend:latest
    container_name: incnv-backend
    restart: always
    environment:
      - NODE_ENV=development
      - PORT=3000
      - HOST=0.0.0.0
      - DB_HOST=incnv-db
      - DB_PORT=3306
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - UPDATE_BIO_DATA_SCHEDULE="0 0 * * *" // cron job
    networks:
      - incnv-network
    volumes:
      - incnv-backend-volume:/usr/src/app/src/datasource/
    depends_on:
      incnv-db:
        condition: service_healthy
```
