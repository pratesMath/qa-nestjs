# Instalar NVM (Node Version Manager) no Ubuntu:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Instalar e configurar o Docker:

# Instalar a CLI do Nest.JS:
npm i -g @nestjs/cli

# Criar o projeto:
nest new qa-nestjs

# Configurar Docker com PostgreSQL (arquivo: "docker-compose.yml") e executar o comando abaixo:
docker compose up -d

# Se tiver o PostgreSQL instalado, desligue antes:
sudo systemctl stop postgresql

# Instalar TypeORM na API:
npm i typeorm pg @nestjs/typeorm @nestjs/config

# Instalar libs para validação dos dados:
npm i class-validator class-transformer

# Instalar Swagger para documentação da API:
npm i @nestjs/swagger swagger-ui-express
