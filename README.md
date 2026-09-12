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

| Variável      | Descrição              | Padrão                       |
|---------------|------------------------|------------------------------|
| DB_HOST       | Host do PostgreSQL     | localhost                    |
| DB_PORT       | Porta do PostgreSQL    | 5432                         |
| DB_NAME       | Nome do banco de dados | sctech-mini-projeto-avaliativo-modulo2 |
| DB_USER       | Usuário do PostgreSQL  | postgres                     |
| DB_PASSWORD   | Senha do PostgreSQL    | 123456                       |
| JWT_SECRET    | Chave secreta para JWT | sua_chave_secreta_aqui       |
| JWT_EXPIRATION| Tempo de expiração do token | 1d                       |
| PORT          | Porta do servidor      | 3000                         |

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

## Autenticação

### Middleware `validaToken`

As rotas protegidas requerem um token JWT válido no header da requisição.

**Header obrigatório para rotas protegidas:**
```
Authorization: Bearer <token>
```

**Fluxo de validação:**
1. Verifica se o header `Authorization` existe e começa com `Bearer `
2. Extrai o token do header
3. Valida o token usando o `JWT_SECRET`
4. Se válido: decodifica o payload (`id`, `role`) e adiciona ao `req.user`
5. Se inválido/ausente: retorna erro 401

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 401    | Token not provided    |
| 401    | Invalid or expired token |

**Rotas públicas (não requerem token):**
- `POST /auth/login`

**Rotas protegidas (requerem token):**
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

---

## Autorização Baseada em Funções (RBAC) — RF09

O controle de acesso é feito pelo middleware `validaRole`, executado após o `validaToken`. O middleware lê o perfil (`role`) do usuário autenticado, presente no payload do token JWT, e verifica se ele está entre os perfis permitidos para a rota.

Se o perfil do usuário **não** tiver permissão, o middleware retorna o status **403 (Forbidden)**.

### Perfis de Acesso

| Perfil       | Valor       | Descrição                                         |
|--------------|-------------|---------------------------------------------------|
| Administrador| `admin`     | Acesso completo às funcionalidades da API         |
| Atendente    | `atendente` | Acesso operacional, com permissões restritas      |
| Usuário      | `user`      | Perfil padrão no cadastro                         |
| Moderador    | `moderator` | Perfil intermediário                              |

### Matriz de Permissões

| Rota             | admin | atendente | user | moderator |
|------------------|-------|-----------|------|-----------|
| `GET /users`     | ✔     | ✔         | ✘    | ✘         |
| `GET /users/:id` | ✔     | ✔         | ✘    | ✘         |
| `POST /users`    | ✔     | ✘         | ✘    | ✘         |
| `PUT /users/:id` | ✔     | ✘         | ✘    | ✘         |
| `DELETE /users/:id` | ✔  | ✘         | ✘    | ✘         |

**Erros possíveis (acesso negado):**
| Status | Mensagem  |
|--------|-----------|
| 401    | Unauthorized |
| 403    | Forbidden |

---

## Endpoints

### Autenticação

#### `POST /auth/login` — Autenticar usuário e retornar token JWT

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validações:**
- Campos `email` e `password` são obrigatórios
- E-mail deve estar cadastrado no sistema
- Senha deve corresponder ao hash armazenado

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 400    | Email and password are required |
| 401    | Invalid credentials   |

**Token JWT:**
- Contém `id` e `role` do usuário
- Expiração definida na variável `JWT_EXPIRATION` (padrão: 1 dia)
- Deve ser enviado no header `Authorization: Bearer <token>` nas rotas protegidas

---

### Usuários

#### `GET /users` — Listar todos os usuários

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

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

**Erros possíveis:**
| Status | Mensagem       |
|--------|----------------|
| 401    | Token not provided |
| 403    | Forbidden      |

---

#### `GET /users/:id` — Buscar usuário por ID

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

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
| 401    | Token not provided |
| 403    | Forbidden     |
| 404    | User not found |

---

#### `POST /users` — Criar novo usuário

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

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
| 401    | Token not provided    |
| 403    | Forbidden             |
| 400    | Email already in use   |

---

#### `PUT /users/:id` — Atualizar usuário

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

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
| 401    | Token not provided |
| 403    | Forbidden     |
| 404    | User not found |

---

#### `DELETE /users/:id` — Remover usuário

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

**Response (204):** Sem conteúdo

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 401    | Token not provided |
| 403    | Forbidden     |
| 404    | User not found |

---

## Estrutura do Banco de Dados

Tabela `users`:

| Coluna      | Tipo        | Restrições       | Descrição                         |
|-------------|-------------|------------------|-----------------------------------|
| id          | SERIAL      | PK, auto-gerado  | Identificador único               |
| name        | VARCHAR(255)| NOT NULL         | Nome do usuário                   |
| email       | VARCHAR(255)| NOT NULL, UNIQUE | E-mail do usuário                 |
| password    | VARCHAR(255)| NOT NULL         | Senha com hash bcrypt             |
| role        | VARCHAR(50) | DEFAULT 'user'   | Perfil: admin, atendente, user, moderator |
| created_at  | TIMESTAMP   | DEFAULT NOW()    | Data de criação do registro       |

**Schema SQL** disponível em `src/database/schema.sql`.

## Features

### Hash de Senha com bcrypt (RF06)

A senha nunca é armazenada ou retornada em texto puro. O sistema utiliza **bcrypt** com 10 rounds de salt para gerar o hash antes de salvar no banco.

**Como funciona:**
- Ao cadastrar um usuário (`POST /users` ou `POST /auth/register`), a senha enviada no body é hasheada antes de ser salva
- Ao atualizar um usuário com nova senha (`PUT /users/:id`), a nova senha também é hasheada
- A coluna `password` possui `select: false` na entidade, impedindo que seja retornada nas queries padrão
- O método `findByEmailWithPassword` seleciona a senha explicitamente quando necessário (autenticação)

**Exemplo de fluxo:**
```
Senha enviada: "minha123"
Hash gerado:   "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
Banco armazena: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
```

---

## Fluxo dos Dados

### Cadastro de Usuário (`POST /users`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Frontend)                          │
│   POST /users                                                       │
│   Body: { name, email, password }                                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          USER ROUTES                                │
│   routes.post("/users", userController.store)                       │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       USER CONTROLLER                               │
│   Extrai dados do req.body: { name, email, password, role }         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        USER SERVICE                                 │
│   1. Verifica se o e-mail já está em uso (findByEmail)             │
│   2. Se existir → lança AppError(400)                               │
│   3. Gera hash da senha: bcrypt.hash(password, 10)                  │
│   4. Chama repository.create() com dados + senha hasheada           │
│   5. Remove password do objeto antes de retornar                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       USER REPOSITORY                               │
│   1. Cria instância da entidade: repository.create(data)            │
│   2. Salva no banco: repository.save(user)                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BANCO DE DADOS (PostgreSQL)                     │
│   INSERT INTO users (name, email, password, role)                   │
│   VALUES ('João', 'joao@email.com', '$2b$10$...', 'user')           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       RESPOSTA AO CLIENTE                           │
│   201 Created                                                       │
│   { id: 1, name: "João", email: "joao@email.com", role: "user" }   │
│   (password NÃO é retornada)                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Login (`POST /auth/login`)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Frontend)                          │
│   POST /auth/login                                                  │
│   Body: { email, password }                                         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          USER ROUTES                                │
│   routes.post("/auth/login", authController.login)                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       AUTH CONTROLLER                               │
│   Extrai dados do req.body: { email, password }                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        AUTH SERVICE                                 │
│   1. Valida campos obrigatórios (email, password)                   │
│   2. Busca usuário pelo e-mail (findByEmailWithPassword)           │
│   3. Se não encontrar → lança AppError(401)                         │
│   4. Compara senha: bcrypt.compare(password, hash)                  │
│   5. Se não bater → lança AppError(401)                             │
│   6. Gera token JWT: jwt.sign({ id, role }, secret, { expiresIn })  │
│   7. Remove password do objeto antes de retornar                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       USER REPOSITORY                               │
│   findByEmailWithPassword(email):                                   │
│   1. Usa QueryBuilder para selecionar password (select: false)      │
│   2. Retorna usuário com senha para comparação                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BANCO DE DADOS (PostgreSQL)                     │
│   SELECT id, name, email, password, role FROM users                 │
│   WHERE email = 'joao@email.com'                                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       GERAÇÃO DO TOKEN JWT                          │
│   Payload: { id: 1, role: "user" }                                  │
│   Secret: variável JWT_SECRET                                       │
│   Expiração: variável JWT_EXPIRATION (padrão: 1d)                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       RESPOSTA AO CLIENTE                           │
│   200 OK                                                            │
│   {                                                                 │
│     "user": { id: 1, name: "João", email: "joao@email.com", ... }, │
│     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."             │
│   }                                                                 │
│   (password NÃO é retornada)                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Tratamento de Erros

```
┌─────────────────────────────────────────────────────────────────────┐
│                    QUALQUER CAMADA (Service/Controller)              │
│   throw new AppError("mensagem", statusCode)                        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLER MIDDLEWARE                          │
│   1. Verifica se é AppError                                         │
│   2. Se sim → retorna { error: message } com o statusCode           │
│   3. Se não → loga erro e retorna 500 "Internal server error"       │
└─────────────────────────────────────────────────────────────────────┘
```
