## Configuração do Ambiente

### 1. Configuração do Frontend

- No diretório do frontend, crie um arquivo `.env.local` e copie os valores do `.env.example` para ele. Isso configurará as variáveis de ambiente necessárias para o frontend.

### 2. Configuração do Backend e Banco de Dados

#### Banco de Dados (pasta `db`)

1. No diretório `db`, copie `.env.example` para um novo arquivo `.env`. Esse arquivo conterá as configurações do banco de dados.
2. Execute os seguintes comandos a partir da pasta `db` para iniciar o banco de dados e os seeds:
   ```bash
   docker compose down
   docker compose -f ./docker-compose.build.yml up -d
   ```
