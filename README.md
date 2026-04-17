# UNO ERP — Site Institucional

Site institucional do UNO ERP com painel administrativo para gerenciar blog, integrações e plugins.

## Stack

- **Backend:** Node.js + Express
- **Database:** SQLite + Prisma ORM
- **Frontend:** React (standalone HTML)
- **Admin:** React SPA com auth JWT
- **Auth:** bcrypt + JWT

## Setup Rápido

```bash
# 1. Instalar dependências, gerar Prisma, rodar migrations e seed
npm run setup

# 2. Iniciar servidor
npm run dev
```

O servidor roda em `http://localhost:3000`

## Rotas

| Rota | Descrição |
|------|-----------|
| `http://localhost:3000` | Site institucional |
| `http://localhost:3000/admin` | Painel administrativo |

### Admin Login
- **E-mail:** admin@unoerp.com.br
- **Senha:** admin123

## API Endpoints

### Públicos (sem auth)
- `GET /api/blog` — Posts publicados
- `GET /api/blog/:slug` — Post por slug
- `GET /api/integrations` — Integrações ativas
- `GET /api/integrations/categories` — Categorias
- `GET /api/plugins` — Plugins ativos
- `GET /api/plugins/modules` — Módulos

### Admin (requer Bearer token)
- `GET /api/blog/admin/all` — Todos os posts
- `POST /api/blog/admin` — Criar post
- `PUT /api/blog/admin/:id` — Editar post
- `DELETE /api/blog/admin/:id` — Excluir post
- `GET /api/integrations/admin/all` — Todas integrações
- `POST /api/integrations/admin` — Criar integração
- `PUT /api/integrations/admin/:id` — Editar integração
- `DELETE /api/integrations/admin/:id` — Excluir integração
- `GET /api/plugins/admin/all` — Todos plugins
- `POST /api/plugins/admin` — Criar plugin
- `PUT /api/plugins/admin/:id` — Editar plugin
- `DELETE /api/plugins/admin/:id` — Excluir plugin

## Estrutura

```
uno-erp-project/
├── admin/
│   └── index.html          # Painel admin (React SPA)
├── prisma/
│   ├── schema.prisma       # Modelos do banco
│   └── seed.js             # Dados iniciais
├── public/
│   └── index.html          # Site institucional
├── src/
│   ├── server.js           # Express server
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   └── routes/
│       ├── auth.js          # Login e autenticação
│       ├── blog.js          # CRUD blog
│       ├── integrations.js  # CRUD integrações
│       └── plugins.js       # CRUD plugins
├── uploads/                 # Uploads de imagens
├── .env                     # Variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

## Deploy

Para deploy em VPS (ex: com Docker/Portainer):

1. Clone o repositório
2. Configure `.env` com `JWT_SECRET` forte
3. `npm run setup`
4. `npm start` (ou use PM2: `pm2 start src/server.js --name uno-erp`)

Para SQLite → PostgreSQL, basta trocar o provider no `schema.prisma` e a `DATABASE_URL`.
