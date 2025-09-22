# ts-cqrs-demo

Um projeto simples em **TypeScript** para demonstrar a aplicação do padrão **CQRS (Command Query Responsibility Segregation)**.

## 📌 Objetivo

Este repositório serve como exemplo prático de como estruturar uma aplicação separando **Commands** (escrita) e **Queries** (leitura), utilizando boas práticas de arquitetura em TypeScript.

## 🏗️ Arquitetura

A aplicação segue o padrão CQRS, separando responsabilidades:

## 📌 Exemplo em Typescript
src/
 ├── domain/          # Núcleo do domínio (regras de negócio)
 │   ├── user/
 │   │   ├── entities/
 │   │   │   └── User.ts
 │   │   ├── commands/
 │   │   │   └── RegisterUserCommand.ts
 │   │   ├── repositories/
 │   │   │   └── UserRepository.ts    # contrato (interface)
 │   │   └── services/
 │   │       └── UserDomainService.ts
 │   └── shared/
 │       └── enums/
 │       └── errors/
 │
 ├── application/                # Casos de uso / Orquestração
 │   ├── user/
 │   │   ├── command-handlers/
 │   │   │   └── RegisterUserCommandHandler.ts
 │   └── services/
 │       └── AuthApplicationService.ts
 │
 ├── infrastructure/                # Adaptações ao mundo externo
 │   ├── persistence/
 │   │   └── UserRepositoryImpl.ts  # implementação concreta do UserRepository
 │   ├── email/
 │   │   └── NodeMailerEmailService.ts
 │   └── config/
 │       └── database.ts
 │
 ├── interfaces/             # Pontas do sistema (UI, APIs, CLI…)
 │   └── http/
 │       ├── controllers/
 │       │   └── UserController.ts
 │       └── routes.ts
 ├── modules/      # Módulos do NestJS (composition root de cada domínio)
 │   ├── user/
 │   │   └── user.module.ts
 │   └── auth/
 │       └── auth.module.ts
 │
 ├── shared/       # SharedModule e serviços reutilizáveis
 │   ├── shared.module.ts
 │   └── services/
 │       └── logger.service.ts
 │

 ├── bootstrap/   # Composition Root / configuração da aplicação
 │   └── app.ts   # instancia Dispatcher, registra EventHandlers, CommandHandlers, Controllers
 │
 └── main.ts # Ponto de entrada da aplicação (chama bootstrap/app.ts)

 ## 📌 Base do CQRS
 - **Commands:** Alteram o estado da aplicação (ex: criar ou atualizar um usuário).
- **Queries:** Apenas leem informações (ex: buscar um usuário).
- **Handlers:** Implementam a lógica de execução de cada comando ou consulta.
- **Domain:** Entidades e regras de negócio.
- **Infrastructure:** Implementações de persistência.

## 📌 O que vai em cada camada
# 1. Domain (coração do sistema)
Entities → objetos do domínio (ex: User).
Value Objects → tipos imutáveis com significado (ex: Email, CPF).
Domain Services → lógica que não cabe em uma única entidade.
Events → fatos consumados do domínio (ex: UserRegisteredEvent).
Commands → intenções de negócio (ex: RegisterUserCommand).
Repositories (interfaces) → contratos de persistência, sem implementação.

⚠️ Aqui não entra nada de framework ou infraestrutura.

# 2. Application (casos de uso)
CommandHandlers → recebem Command, usam domínio para executar, emitem Events.
EventHandlers → reagem a Events (ex: enviar email).
Application Services → orquestram casos de uso mais amplos (ex: autenticação, pagamentos).
⚠️ Aqui não há regra de negócio "pura", apenas orquestração.

# 3. Infrastructure
Implementações concretas dos contratos do domain (ex: UserRepositoryImpl com TypeORM, Prisma ou Sequelize).
Integrações externas (ex: serviços de e-mail, cache, mensageria).
Configuração de banco, RabbitMQ, Kafka, etc.

# 4. Interfaces
Camada mais externa: controllers HTTP, CLI, GraphQL, WebSocket, etc.
Essa camada converte entrada/saída para objetos do application/domain.

# 5. Modules
Modulos do NestJS separados por contexto (user, auth, etc).
Cada módulo do NestJS funciona como composition root de um contexto do domínio.
O restante da aplicação (domain, application, infrastructure, interfaces) continua organizado segundo DDD e Arquitetura Gritante.

# 6. Shared
Camada com serviços e componentes utilizados em vários módulos
SharedModule centraliza providers reutilizáveis.

# 7. Bootstrap
Responsável pela inicialização dos componentes do sistema
Instancia EventDispatcher (singleton), registra todos os EventHandlers (ex: SendWelcomeEmailHandler), cria os CommandHandlers, passando repositórios e dispatcher, cria Controllers e quaisquer outros serviços da aplicação, retorna um objeto com os controllers ou serviços prontos para uso.

## 📌 Exemplo de fluxo na prática
POST /users (controller na interfaces/http) recebe payload.

Cria RegisterUserCommand.

Passa para o RegisterUserCommandHandler (application/user/command-handlers).

O handler usa UserRepository (contrato do domain) → instância concreta vem da infrastructure.

Ao persistir o usuário, dispara UserRegisteredEvent (domain/user/events).

O EventDispatcher (domain/shared/events) publica.

SendWelcomeEmailHandler (application/user/event-handlers) reage e envia o e-mail usando NodeMailerEmailService (infrastructure/email).

## 🚀 Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/ts-cqrs-demo.git
   cd ts-cqrs-demo
   docker compose up -d
   npm ci
   npm run start:dev
   npm test
   ```
