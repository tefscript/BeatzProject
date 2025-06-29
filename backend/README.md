# BeatzProject Backend

Backend da aplicação BeatzProject, uma plataforma de streaming de música desenvolvida com Node.js, Express e Supabase.

## 🛠️ Stack Tecnológica

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: JWT + bcryptjs
- **Validação**: express-validator
- **Testes**: Jest + Supertest
- **Documentação**: Swagger/OpenAPI

### Estrutura do Projeto
```
backend/
├── src/
│   ├── config/          # Configurações (DB, Swagger)
│   ├── controllers/     # Controladores da aplicação
│   ├── middlewares/     # Middlewares (auth, validação)
│   ├── routes/          # Definição das rotas
│   ├── utils/           # Utilitários e helpers
│   └── __tests__/       # Testes automatizados
├── package.json
├── jest.config.js
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase configurada

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd BeatzProject/backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_do_supabase

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# Servidor
PORT=3000
NODE_ENV=development
```

4. **Execute o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/social-login` - Login social
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Perfil do usuário
- `PUT /auth/profile` - Atualizar perfil
- `PUT /auth/change-password` - Alterar senha

### Álbuns
- `GET /albums` - Listar todos os álbuns
- `GET /albums/:id` - Obter álbum específico
- `POST /albums` - Criar álbum
- `PUT /albums/:id` - Atualizar álbum
- `DELETE /albums/:id` - Deletar álbum
- `GET /albums/search` - Buscar álbuns
- `GET /albums/:albumId/musics` - Músicas do álbum
- `POST /albums/:albumId/musics` - Adicionar música ao álbum
- `DELETE /albums/:albumId/musics` - Remover música do álbum
- `PUT /albums/:albumId/cover` - Definir capa do álbum

### Artistas
- `GET /artists` - Listar artistas
- `GET /artists/:id` - Obter artista específico
- `POST /artists` - Criar artista
- `PUT /artists/:id` - Atualizar artista
- `DELETE /artists/:id` - Deletar artista

### Músicas
- `GET /musics` - Listar músicas
- `GET /musics/:id` - Obter música específica
- `POST /musics` - Criar música
- `PUT /musics/:id` - Atualizar música
- `DELETE /musics/:id` - Deletar música

### Playlists
- `GET /playlists` - Listar playlists
- `GET /playlists/:id` - Obter playlist específica
- `POST /playlists` - Criar playlist
- `PUT /playlists/:id` - Atualizar playlist
- `DELETE /playlists/:id` - Deletar playlist
- `POST /playlists/:id/musics` - Adicionar música à playlist
- `DELETE /playlists/:id/musics` - Remover música da playlist

### Usuários
- `GET /users` - Listar usuários
- `GET /users/:id` - Obter usuário específico
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

## 🧪 Testes

### Status Atual dos Testes

**Testes Implementados:**
- ✅ **handleError.test.js** - 9 testes (função de tratamento de erros)
- ✅ **authMiddleware.test.js** - 7 testes (middleware de autenticação)
- ✅ **validation.test.js** - 9 testes (funções de validação)
- ✅ **albumController.test.js** - 16 testes (controlador de álbuns)
- ✅ **authController.test.js** - 1 teste (controlador de autenticação)
- ✅ **authRoutes.test.js** - 15 testes (rotas de autenticação)

**Total:** 57 testes implementados

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes específicos
npm test -- --testPathPattern="handleError.test.js"
```

### Estrutura dos Testes

```
src/__tests__/
├── controllers/
│   ├── albumController.test.js
│   └── authController.test.js
├── middlewares/
│   └── authMiddleware.test.js
├── routes/
│   └── authRoutes.test.js
├── utils/
│   ├── handleError.test.js
│   └── validation.test.js
└── setup.js
```

### Problemas Identificados e Soluções

**Problemas Principais:**
1. **Mock do Supabase**: Encadeamento de métodos não funcionando corretamente
2. **Mock do express-validator**: Funções de validação não sendo aplicadas
3. **Timeout nos testes**: Testes demorando mais de 10 segundos

**Soluções Implementadas:**
1. ✅ Mock do Supabase com suporte completo a chaining
2. ✅ Mock do express-validator com todas as funções
3. ✅ Setup global de mocks no `setup.js`
4. ✅ Limpeza automática de mocks após cada teste

### Próximas Etapas para Testes

**Prioridade Alta:**
1. 🔄 **Corrigir mocks finais** - Garantir que todos os mocks funcionem corretamente
2. 🔄 **Implementar testes faltantes** - Completar cobertura de todos os controladores
3. 🔄 **Testes de integração** - Testar fluxos completos da aplicação

**Prioridade Média:**
1. 📝 **Testes de frontend** - Implementar testes para componentes React
2. 📝 **Testes de performance** - Testes de carga e performance
3. 📝 **Testes de segurança** - Validação de vulnerabilidades

**Prioridade Baixa:**
1. 📝 **Testes E2E** - Testes end-to-end completos
2. 📝 **Testes de acessibilidade** - Validação de acessibilidade
3. 📝 **Testes de internacionalização** - Suporte a múltiplos idiomas

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa em modo desenvolvimento
npm run dev:debug    # Executa com debug habilitado

# Produção
npm start            # Executa em modo produção
npm run build        # Build para produção

# Testes
npm test             # Executa todos os testes
npm run test:watch   # Executa testes em modo watch
npm run test:coverage # Executa testes com coverage

# Linting e Formatação
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas do ESLint
npm run format       # Formata código com Prettier

# Banco de Dados
npm run db:migrate   # Executa migrações
npm run db:seed      # Popula banco com dados de teste
```

## 📊 Monitoramento e Logs

### Logs
- **Desenvolvimento**: Logs detalhados no console
- **Produção**: Logs estruturados em arquivo

### Métricas
- Tempo de resposta das requisições
- Taxa de erro por endpoint
- Uso de memória e CPU

## 🔒 Segurança

### Implementado
- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Validação de entrada com express-validator
- ✅ Middleware de autenticação
- ✅ Rate limiting básico

### Recomendações
- 🔄 Implementar rate limiting avançado
- 🔄 Adicionar CORS configurável
- 🔄 Implementar helmet.js
- 🔄 Validação de tipos com TypeScript

## 🚀 Deploy

### Variáveis de Ambiente para Produção
```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=sua_url_producao
SUPABASE_KEY=sua_chave_producao
JWT_SECRET=secret_super_seguro_producao
```

### Processo de Deploy
1. Build da aplicação
2. Configuração das variáveis de ambiente
3. Deploy no servidor
4. Verificação de saúde da aplicação

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@beatzproject.com ou abra uma issue no GitHub. 