# inCNV

## Requirement

1. Docker

Run inCNV

```
docker-compose up -d
```

## How to config

```
version: '2.4'
services:
  incnv-frontend:
    image: saowwapark/incnv-frontend:latest
    container_name: incnv-frontend
    restart: always
    networks:
      - incnv-network
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
      - UPDATE_BIO_DATA_SCHEDULE="0 0 * * *" // cron job schedule
    networks:
      - incnv-network
    volumes:
      - incnv-backend-volume:/usr/src/app/src/datasource/
    depends_on:
      incnv-db:
        condition: service_healthy
  incnv-db:
    image: sakkayaphab/incnv-db:latest
    container_name: incnv-db
    restart: always
    networks:
      - incnv-network
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
    volumes:
      - incnv-volume:/var/lib/mysql
    healthcheck:
      test: mysqladmin ping -h 127.0.0.1 -u root --password=rootpassword
    ports:
      - 7004:3306
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost","-u","root","--password=rootpassword"]
      timeout: 20s
      retries: 10
  incnv-reverse-proxy:
    image: sakkayaphab/incnv-reverse-proxy:latest
    container_name: incnv-reverse-proxy
    restart: always
    ports:
      - 7000:80
    networks:
      - incnv-network
    depends_on:
      incnv-db:
        condition: service_healthy

volumes:
  incnv-volume:
  incnv-backend-volume:

networks:
  incnv-network: {}

```
