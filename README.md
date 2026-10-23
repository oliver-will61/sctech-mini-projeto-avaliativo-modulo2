# SC Tech - Mini Projeto Avaliativo Módulo 2

API RESTful para gerenciamento de usuários, especialidades médicas, médicos e pacientes com autenticação, construída com Node.js, TypeScript, Express e TypeORM.

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
└── utils/           # Utilitários (AppError, validação de CPF, e-mail e data)
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
- **Testes:** Jest + ts-jest
- **Containers:** Docker + Docker Compose

## Rodando com Docker

Pré-requisito: Docker com o plugin Docker Compose.

```bash
# Criar o arquivo de variáveis a partir do exemplo (e ajustar os valores)
cp .env.example .env
```

```bash
# Subir a API e o banco
docker compose up
```

Sobe a API com hot reload (`ts-node-dev`) e um PostgreSQL. O código do projeto é montado no container, então qualquer alteração em `src/` reinicia o servidor automaticamente. O Docker é usado apenas para desenvolvimento.

- API: `http://localhost:3000`
- PostgreSQL: `localhost:5433` (porta 5433 para não conflitar com um PostgreSQL local)
- Rodar os testes dentro do container: `docker compose exec api npm test`
- Parar: `docker compose down` (com `-v` também apaga os dados do banco)

> **Primeiro acesso:** a API não tem rota de cadastro público, e todas as rotas de escrita exigem um admin. O primeiro usuário admin precisa ser inserido direto no banco, com a senha em hash bcrypt.

## Rodando sem Docker

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL instalado e rodando
- npm

### Instalação

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
| DB_PASSWORD   | Senha do PostgreSQL    | Exemplo: 123456              |
| JWT_SECRET    | Chave secreta para JWT | Exemplo: chave_secreta_aqui  |
| JWT_EXPIRATION| Tempo de expiração do token | 1d                      |
| PORT          | Porta do servidor      | 3000                         |

## Scripts

```bash
# Desenvolvimento (com ts-node)
npm run dev

# Compilar para JavaScript
npm run build

# Rodar a versão compilada
npm start

# Rodar os testes unitários
npm test

# Rodar os testes com relatório de cobertura (gerado em coverage/)
npm run test:coverage
```

## Testes

Os testes unitários usam **Jest** com **ts-jest** e ficam na pasta `tests/` na raiz, espelhando a estrutura de `src/` (`controllers`, `services`, `repositories`, `middlewares`, `utils`). Cada camada é testada isoladamente, sem banco de dados: o repositório, o TypeORM, o bcrypt e os services são substituídos por mocks.

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
| 401    | Token não fornecido    |
| 401    | Token inválido ou expirado |

**Rotas públicas (não requerem token):**
- `POST /auth/login`

**Rotas protegidas (requerem token):**
- `GET /users/me` — retorna dados do usuário autenticado
- `GET /admin/ping` — verifica RBAC (apenas admin)
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /especialidades`
- `GET /especialidades/:id`
- `POST /especialidades`
- `PUT /especialidades/:id`
- `DELETE /especialidades/:id`
- `GET /medicos`
- `GET /medicos/:id`
- `POST /medicos`
- `PUT /medicos/:id`
- `DELETE /medicos/:id`
- `GET /pacientes`
- `GET /pacientes/:id`
- `POST /pacientes`
- `PUT /pacientes/:id`
- `DELETE /pacientes/:id`

---

## Autorização Baseada em Funções (RBAC) — RF09

O controle de acesso é feito pelo middleware `validaRole`, executado após o `validaToken`. O middleware lê o perfil (`role`) do usuário autenticado, presente no payload do token JWT, e verifica se ele está entre os perfis permitidos para a rota.

Se o perfil do usuário **não** tiver permissão, o middleware retorna o status **403 (Proibido)**.

### Perfis de Acesso

| Perfil       | Valor       | Descrição                                         |
|--------------|-------------|---------------------------------------------------|
| Administrador| `admin`     | Acesso completo às funcionalidades da API         |
| Atendente    | `atendente` | Acesso operacional, com permissões restritas      |
| Usuário      | `user`      | Perfil padrão no cadastro                         |
| Moderador    | `moderator` | Perfil intermediário                              |

### Matriz de Permissões

| Rota               | admin | atendente | user | moderator |
|--------------------|-------|-----------|------|-----------|
| `GET /users/me`    | ✔     | ✔         | ✔    | ✔         |
| `GET /admin/ping`  | ✔     | ✘         | ✘    | ✘         |
| `GET /users`       | ✔     | ✔         | ✘    | ✘         |
| `GET /users/:id`   | ✔     | ✔         | ✘    | ✘         |
| `POST /users`      | ✔     | ✘         | ✘    | ✘         |
| `PUT /users/:id`   | ✔     | ✘         | ✘    | ✘         |
| `DELETE /users/:id` | ✔     | ✘         | ✘    | ✘         |
| `GET /especialidades`        | ✔ | ✔ | ✘ | ✘ |
| `GET /especialidades/:id`    | ✔ | ✔ | ✘ | ✘ |
| `POST /especialidades`       | ✔ | ✘ | ✘ | ✘ |
| `PUT /especialidades/:id`    | ✔ | ✘ | ✘ | ✘ |
| `DELETE /especialidades/:id` | ✔ | ✘ | ✘ | ✘ |
| `GET /medicos`               | ✔ | ✔ | ✘ | ✘ |
| `GET /medicos/:id`           | ✔ | ✔ | ✘ | ✘ |
| `POST /medicos`              | ✔ | ✘ | ✘ | ✘ |
| `PUT /medicos/:id`           | ✔ | ✘ | ✘ | ✘ |
| `DELETE /medicos/:id`        | ✔ | ✘ | ✘ | ✘ |
| `GET /pacientes`             | ✔ | ✔ | ✘ | ✘ |
| `GET /pacientes/:id`         | ✔ | ✔ | ✘ | ✘ |
| `POST /pacientes`            | ✔ | ✔ | ✘ | ✘ |
| `PUT /pacientes/:id`         | ✔ | ✔ | ✘ | ✘ |
| `DELETE /pacientes/:id`      | ✔ | ✘ | ✘ | ✘ |

**Erros possíveis (acesso negado):**
| Status | Mensagem  |
|--------|-----------|
| 401    | Não autorizado |
| 403    | Proibido |

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
| 400    | E-mail e senha são obrigatórios |
| 401    | Credenciais inválidas   |

**Token JWT:**
- Contém `id` e `role` do usuário
- Expiração definida na variável `JWT_EXPIRATION` (padrão: 1 dia)
- Deve ser enviado no header `Authorization: Bearer <token>` nas rotas protegidas

---

### Verificação de Autenticação/Autorização (RF10)

#### `GET /users/me` — Retorna dados do usuário autenticado

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer autenticação (qualquer perfil)

**Response (200):**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@email.com",
  "role": "admin",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 401    | Token não fornecido    |
| 401    | Token inválido ou expirado |
| 404    | Usuário não encontrado        |

---

#### `GET /admin/ping` — Verifica funcionamento do RBAC

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

**Response (200):**
```json
{
  "message": "Pong! Admin autenticado com sucesso."
}
```

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 401    | Token não fornecido    |
| 401    | Token inválido ou expirado |
| 403    | Proibido             |

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
| 401    | Token não fornecido |
| 403    | Proibido      |

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
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Usuário não encontrado |

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
| 401    | Token não fornecido    |
| 403    | Proibido             |
| 409    | E-mail já cadastrado   |

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
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Usuário não encontrado |

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
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Usuário não encontrado |

---

### Especialidades

**Regras de negócio:**
- O nome é obrigatório e **único**. A comparação ignora maiúsculas e minúsculas ("Cardiologia" e "cardiologia" são o mesmo nome), e os espaços nas pontas são removidos antes de salvar.
- **Não é permitido remover** uma especialidade que possua médicos vinculados (uma especialidade possui N médicos). O `EspecialidadeService` conta os médicos da especialidade antes de remover, e a chave estrangeira com `ON DELETE RESTRICT` reforça a regra no banco.

#### `GET /especialidades` — Listar todas as especialidades

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

**Response (200):** lista em ordem alfabética
```json
[
  {
    "id": 1,
    "nome": "Cardiologia",
    "descricao": "Diagnóstico e tratamento de doenças do coração"
  }
]
```

**Erros possíveis:**
| Status | Mensagem       |
|--------|----------------|
| 401    | Token não fornecido |
| 403    | Proibido      |

---

#### `GET /especialidades/:id` — Buscar especialidade por ID

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
  "nome": "Cardiologia",
  "descricao": "Diagnóstico e tratamento de doenças do coração"
}
```

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Especialidade não encontrada |

---

#### `POST /especialidades` — Criar nova especialidade

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

**Request:**
```json
{
  "nome": "Cardiologia",
  "descricao": "Diagnóstico e tratamento de doenças do coração"
}
```
> `descricao` é opcional.

**Response (201):**
```json
{
  "id": 1,
  "nome": "Cardiologia",
  "descricao": "Diagnóstico e tratamento de doenças do coração"
}
```

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 400    | O nome da especialidade é obrigatório |
| 401    | Token não fornecido    |
| 403    | Proibido             |
| 409    | Já existe uma especialidade com esse nome |

---

#### `PUT /especialidades/:id` — Atualizar especialidade

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

**Request:** atualização parcial. Envie `nome`, `descricao` ou os dois.
```json
{
  "descricao": "Nova descrição"
}
```

**Response (200):**
```json
{
  "id": 1,
  "nome": "Cardiologia",
  "descricao": "Nova descrição"
}
```

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 400    | Nenhum campo para atualizar |
| 400    | O nome da especialidade é obrigatório |
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Especialidade não encontrada |
| 409    | Já existe uma especialidade com esse nome |

---

#### `DELETE /especialidades/:id` — Remover especialidade

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
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Especialidade não encontrada |
| 409    | Não é possível remover uma especialidade com médicos vinculados |

---

### Médicos

**Regras de negócio:**
- Todos os campos são obrigatórios: `nome`, `crm`, `email`, `telefone` e `especialidadeId`. Os espaços nas pontas dos textos são removidos antes de salvar.
- O **CRM é único**. A comparação ignora maiúsculas e minúsculas ("12345/SC" e "12345/sc" são o mesmo CRM).
- Todo médico deve estar vinculado a uma **especialidade existente** (`especialidadeId`).
- As respostas trazem o objeto `especialidade` junto com o médico.

#### `GET /medicos` — Listar todos os médicos

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

**Response (200):** lista em ordem alfabética
```json
[
  {
    "id": 1,
    "nome": "Dra. Ana Souza",
    "crm": "12345/SC",
    "email": "ana@clinica.com",
    "telefone": "(48) 99999-0000",
    "especialidadeId": 1,
    "especialidade": {
      "id": 1,
      "nome": "Cardiologia",
      "descricao": "Diagnóstico e tratamento de doenças do coração"
    }
  }
]
```

**Erros possíveis:**
| Status | Mensagem       |
|--------|----------------|
| 401    | Token não fornecido |
| 403    | Proibido      |

---

#### `GET /medicos/:id` — Buscar médico por ID

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
  "nome": "Dra. Ana Souza",
  "crm": "12345/SC",
  "email": "ana@clinica.com",
  "telefone": "(48) 99999-0000",
  "especialidadeId": 1,
  "especialidade": {
    "id": 1,
    "nome": "Cardiologia",
    "descricao": "Diagnóstico e tratamento de doenças do coração"
  }
}
```

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Médico não encontrado |

---

#### `POST /medicos` — Cadastrar novo médico

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

**Request:**
```json
{
  "nome": "Dra. Ana Souza",
  "crm": "12345/SC",
  "email": "ana@clinica.com",
  "telefone": "(48) 99999-0000",
  "especialidadeId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "nome": "Dra. Ana Souza",
  "crm": "12345/SC",
  "email": "ana@clinica.com",
  "telefone": "(48) 99999-0000",
  "especialidadeId": 1,
  "especialidade": {
    "id": 1,
    "nome": "Cardiologia",
    "descricao": "Diagnóstico e tratamento de doenças do coração"
  }
}
```

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 400    | O campo `<campo>` é obrigatório |
| 400    | Informe uma especialidade válida (especialidadeId) |
| 400    | A especialidade informada não existe |
| 401    | Token não fornecido    |
| 403    | Proibido             |
| 409    | Já existe um médico com esse CRM |

---

#### `PUT /medicos/:id` — Atualizar médico

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin**

**Request:** atualização parcial. Envie apenas os campos que deseja alterar.
```json
{
  "telefone": "(48) 3333-0000",
  "especialidadeId": 2
}
```

**Response (200):** o médico atualizado, no mesmo formato do `GET /medicos/:id`.

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 400    | Nenhum campo para atualizar |
| 400    | O campo `<campo>` é obrigatório (campo enviado vazio) |
| 400    | Informe uma especialidade válida (especialidadeId) |
| 400    | A especialidade informada não existe |
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Médico não encontrado |
| 409    | Já existe um médico com esse CRM |

---

#### `DELETE /medicos/:id` — Remover médico

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
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Médico não encontrado |

---

### Pacientes

**Regras de negócio:**
- Todos os campos são obrigatórios: `nome`, `cpf`, `email` e `dataNascimento`. Os espaços nas pontas são removidos antes de salvar.
- **CPF:** aceito com máscara (`529.982.247-25`) ou só com os números (`52998224725`). O formato e os **dígitos verificadores** são validados; CPFs com todos os dígitos iguais, como `111.111.111-11`, são rejeitados. O CPF é salvo e retornado **só com os números**.
- O **CPF é único**. `529.982.247-25` e `52998224725` são considerados o mesmo CPF.
- **E-mail:** precisa estar no formato `usuario@dominio.extensao` e é salvo em minúsculas.
- **Data de nascimento:** formato `AAAA-MM-DD`, precisa ser uma data real (rejeita `2023-02-29`, por exemplo) e não pode ser no futuro.
- **Permissões:** admin e atendente podem listar, cadastrar e editar pacientes; remover é exclusivo do admin.

#### `GET /pacientes` — Listar todos os pacientes

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

**Response (200):** lista em ordem alfabética
```json
[
  {
    "id": 1,
    "nome": "João da Silva",
    "cpf": "52998224725",
    "email": "joao@email.com",
    "dataNascimento": "1990-05-20"
  }
]
```

**Erros possíveis:**
| Status | Mensagem       |
|--------|----------------|
| 401    | Token não fornecido |
| 403    | Proibido      |

---

#### `GET /pacientes/:id` — Buscar paciente por ID

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
  "nome": "João da Silva",
  "cpf": "52998224725",
  "email": "joao@email.com",
  "dataNascimento": "1990-05-20"
}
```

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Paciente não encontrado |

---

#### `POST /pacientes` — Cadastrar novo paciente

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

**Request:**
```json
{
  "nome": "João da Silva",
  "cpf": "529.982.247-25",
  "email": "joao@email.com",
  "dataNascimento": "1990-05-20"
}
```

**Response (201):**
```json
{
  "id": 1,
  "nome": "João da Silva",
  "cpf": "52998224725",
  "email": "joao@email.com",
  "dataNascimento": "1990-05-20"
}
```

**Erros possíveis:**
| Status | Mensagem              |
|--------|-----------------------|
| 400    | O campo `<campo>` é obrigatório |
| 400    | CPF inválido |
| 400    | E-mail inválido |
| 400    | Data de nascimento inválida (use o formato AAAA-MM-DD) |
| 400    | A data de nascimento não pode ser no futuro |
| 401    | Token não fornecido    |
| 403    | Proibido             |
| 409    | Já existe um paciente com esse CPF |

---

#### `PUT /pacientes/:id` — Atualizar paciente

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```
> Requer perfil: **admin** ou **atendente**

**Request:** atualização parcial. Envie apenas os campos que deseja alterar; eles passam pelas mesmas validações do cadastro.
```json
{
  "email": "joao.silva@email.com"
}
```

**Response (200):** o paciente atualizado, no mesmo formato do `GET /pacientes/:id`.

**Erros possíveis:**
| Status | Mensagem      |
|--------|---------------|
| 400    | Nenhum campo para atualizar |
| 400    | O campo `<campo>` é obrigatório (campo enviado vazio) |
| 400    | CPF inválido |
| 400    | E-mail inválido |
| 400    | Data de nascimento inválida (use o formato AAAA-MM-DD) |
| 400    | A data de nascimento não pode ser no futuro |
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Paciente não encontrado |
| 409    | Já existe um paciente com esse CPF |

---

#### `DELETE /pacientes/:id` — Remover paciente

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
| 401    | Token não fornecido |
| 403    | Proibido     |
| 404    | Paciente não encontrado |

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

Tabela `especialidades`:

| Coluna      | Tipo         | Restrições       | Descrição                         |
|-------------|--------------|------------------|-----------------------------------|
| id          | SERIAL       | PK, auto-gerado  | Identificador único               |
| nome        | VARCHAR(100) | NOT NULL, UNIQUE | Nome da especialidade             |
| descricao   | TEXT         | NULL             | Descrição da especialidade        |

Tabela `medicos`:

| Coluna           | Tipo         | Restrições                          | Descrição                    |
|------------------|--------------|-------------------------------------|------------------------------|
| id               | SERIAL       | PK, auto-gerado                     | Identificador único          |
| nome             | VARCHAR(255) | NOT NULL                            | Nome do médico               |
| crm              | VARCHAR(20)  | NOT NULL, UNIQUE                    | CRM do médico                |
| email            | VARCHAR(255) | NOT NULL                            | E-mail de contato            |
| telefone         | VARCHAR(20)  | NOT NULL                            | Telefone de contato          |
| especialidade_id | INTEGER      | NOT NULL, FK → especialidades(id), ON DELETE RESTRICT | Especialidade do médico |

> Relacionamento: uma especialidade possui N médicos (`especialidades 1 ── N medicos`). Na API, a coluna `especialidade_id` aparece como `especialidadeId`.

Tabela `pacientes`:

| Coluna          | Tipo         | Restrições       | Descrição                                  |
|-----------------|--------------|------------------|--------------------------------------------|
| id              | SERIAL       | PK, auto-gerado  | Identificador único                        |
| nome            | VARCHAR(255) | NOT NULL         | Nome do paciente                           |
| cpf             | CHAR(11)     | NOT NULL, UNIQUE | CPF, só com os números                     |
| email           | VARCHAR(255) | NOT NULL         | E-mail, em minúsculas                      |
| data_nascimento | DATE         | NOT NULL         | Data de nascimento (`dataNascimento` na API) |

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
