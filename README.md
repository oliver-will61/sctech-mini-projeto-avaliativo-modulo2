# SC Tech - Mini Projeto Avaliativo Módulo 2

API RESTful para gerenciamento de usuários com autenticação, construída com Node.js, TypeScript, Express e TypeORM.

## Arquitetura

O projeto segue uma arquitetura em camadas:

```
src/
├── controllers/     # Recebe requisições HTTP e retorna responses
├── services/        # Lógica de negócio e validações
├── repositories/    # Acesso ao banco de dados (via TypeORM)
├── entities/        # Mapeamento das tabelas do banco
├── routes/          # Definição dos endpoints
├── middlewares/     # Middleware de tratamento de erros
├── database/        # Configuração da conexão com o banco
└── utils/           # Utilitários (AppError)
```

**Fluxo de uma requisição:**
`Route → Controller → Service → Repository → Entity → Banco de dados`

## Tecnologias

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework:** Express
- **ORM:** TypeORM
- **Banco de dados:** PostgreSQL
- **Hash de senhas:** bcrypt

## Pré-requisitos

- Node.js (v18+)
- PostgreSQL instalado e rodando
- npm

## Instalação

```bash
# Instalar dependências
npm install

# Criar o banco de dados no PostgreSQL
psql -U postgres -c "CREATE DATABASE \"sctech-mini-projeto-avaliativo-modulo2\";"

# Configurar variáveis de ambiente (editar .env se necessário)
# As variáveis padrão estão no arquivo .env
```

## Variáveis de Ambiente

Arquivo `.env`:

| Variável    | Descrição              | Padrão                       |
|-------------|------------------------|------------------------------|
| DB_HOST     | Host do PostgreSQL     | localhost                    |
| DB_PORT     | Porta do PostgreSQL    | 5432                         |
| DB_NAME     | Nome do banco de dados | sctech-mini-projeto-avaliativo-modulo2 |
| DB_USER     | Usuário do PostgreSQL  | postgres                     |
| DB_PASSWORD | Senha do PostgreSQL    | 123456                       |
| PORT        | Porta do servidor      | 3000                         |

## Scripts

```bash
# Desenvolvimento (com ts-node)
npm run dev

# Compilar para JavaScript
npm run build

# Rodar a versão compilada
npm start
```

## Headers Padrão

Todas as requisições que enviam corpo (body) devem utilizar o seguinte header:

```
Content-Type: application/json
```

## Endpoints

### Autenticação

#### `POST /auth/register` — Cadastrar novo usuário

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "user",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Validações:**
- Campos `name`, `email` e `password` são obrigatórios
- Formato de e-mail deve ser válido
- E-mail não pode estar duplicado

**Erros possíveis:**
| Status | Mensagem                      |
|--------|-------------------------------|
| 400    | Name, email and password are required |
| 400    | Invalid email format          |
| 400    | Email already in use           |

---

### Usuários

#### `GET /users` — Listar todos os usuários

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

---

#### `GET /users/:id` — Buscar usuário por ID

**Headers:**
```
Content-Type: application/json
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "user",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 404    | User not found |

---

#### `POST /users` — Criar novo usuário

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "password": "senha456",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Maria Santos",
  "email": "maria@email.com",
  "role": "admin",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 400    | Email already in use   |

---

#### `PUT /users/:id` — Atualizar usuário

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "name": "João Silva Atualizado"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva Atualizado",
  "email": "joao@email.com",
  "role": "user",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 404    | User not found |

---

#### `DELETE /users/:id` — Remover usuário

**Headers:**
```
Content-Type: application/json
```

**Response (204):** Sem conteúdo

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 404    | User not found |

---

## Estrutura do Banco de Dados

Tabela `users`:

| Coluna      | Tipo        | Restrições       | Descrição                    |
|-------------|-------------|------------------|------------------------------|
| id          | SERIAL      | PK, auto-gerado  | Identificador único          |
| name        | VARCHAR(255)| NOT NULL         | Nome do usuário              |
| email       | VARCHAR(255)| NOT NULL, UNIQUE | E-mail do usuário            |
| password    | VARCHAR(255)| NOT NULL         | Senha com hash bcrypt        |
| role        | VARCHAR(50) | DEFAULT 'user'   | Perfil: admin, user, moderator |
| created_at  | TIMESTAMP   | DEFAULT NOW()    | Data de criação do registro  |

**Schema SQL** disponível em `src/database/schema.sql`.
