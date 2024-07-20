#  plann.er  API

[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#planner-app-api)

Backend do plann.er, uma aplicação de gerenciamento de viagens.

## Tecnologias Utilizadas

[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#Tecnologias Utilizadas)

- NodeJs
- Fastify
- Prisma
- Zod
- Typescript
- Dayjs
- Nodemailer

  
## Aprendizados importantes
[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#aprendizados-importantes)


- Criação de uma REST API utilizando Node e Fastify
- Conexão com envio de emails utilizando Nodemailer
- Conexão com banco de dados utilizando Prisma
- Validações utilizando Zod


## Como usar
[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#como-usar)


### Pré-requisitos
[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#pr%C3%A9-requisitos)


- Node.js
- npm

### Instalação
[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#instala%C3%A7%C3%A3o)

1. Clone o repositório:

```shell
git clone https://github.com/danielstos/nlw-nodejs-journey.git
cd nlw-nodejs-journey
```

2. Instale as dependências:

```shell
npm install
```

3. Inicie a aplicação:

```shell
npm run dev
```

A API estará disponível em [http://localhost:3333](http://localhost:3333/).

#### Comandos
[](https://github.com/danielstos/nlw-nodejs-journey?tab=readme-ov-file#comandos)

```shell
# Abre uma aba para manipular o banco de dados em http://localhost:5555
npx prisma studio
```

```shell
# Preenche o banco com dados fictícios
npx prisma db seed
```

```shell
# Apaga o banco atual e refaz o seed
npx prisma migrate reset
```
# Estrutura do Projeto

A estrutura do projeto é a seguinte:

# Estrutura do Projeto

A estrutura do projeto é a seguinte:

```plaintext
project-root/
├── node_modules/
├── prisma/
│   ├── migrations/
│   │   ├── 20240709193200_create_trips_table/
│   │   ├── 20240710144300_create_participants_table/
│   │   └── 20240714173900_create_activities_and_links_tables/
│   ├── dev.db
│   └── schema.prisma
├── src/
│   ├── errors/
│   │   └── client-error.ts
│   ├── lib/
│   │   ├── dayjs.ts
│   │   ├── mail.ts
│   │   └── prisma.ts
│   ├── routes/
│   │   ├── confirm-participant.ts
│   │   ├── confirm-trip.ts
│   │   ├── create-activity.ts
│   │   ├── create-invite.ts
│   │   ├── create-link.ts
│   │   ├── create-trip.ts
│   │   ├── get-activities.ts
│   │   ├── get-links.ts
│   │   ├── get-participant.ts
│   │   ├── get-participants.ts
│   │   ├── get-trip-details.ts
│   │   └── update-trip.ts
│   ├── error-handler.ts
│   └── server.ts
├── .env
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json

```

```mermaid
flowchart TD
    style A fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style B fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style C fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style D fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style E fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style F fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style G fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style H fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style I fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style J fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style K fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style L fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style M fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style N fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style O fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style P fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style Q fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style R fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style S fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style T fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style U fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF
    style V fill:#333,stroke:#FFF,stroke-width:2px,color:#FFF

    %% Solicitação de Viagem
    A[Início] --> B[Usuário solicita viagem]
    B --> C[API recebe a solicitação]
    C --> D[API envia e-mail de confirmação]
    D --> E[Usuário confirma a viagem via e-mail]
    E --> F[API atualiza o status da viagem no banco de dados]

    %% Detalhes da Viagem
    subgraph Detalhes da Viagem
        C --> I[Destino: Curitiba]
        C --> J[Data de Início: 01/08/2024]
        C --> K[Data de Fim: 10/08/2024]
        C --> L[Atividades: Passeios às 09:00, Workshops às 14:00]
    end

    %% Notificação dos Participantes
    F --> G[API envia e-mails de confirmação para os participantes]
    G --> H[Participantes confirmam a viagem via e-mail]
    H --> M[API atualiza o status dos participantes no banco de dados]

    %% Verificação de Confirmação
    M --> N[Usuário checa participantes]
    N --> O[Participante 1: Confirmado]
    N --> P[Participante 2: Confirmado]
    N --> Q[Participante 3: Confirmado]
    N --> R[Participante 4: Confirmado]

    %% Inclusão de Novos Participantes e Atividades
    subgraph Gerenciamento Adicional
        S[Usuário inclui novo participante e atividades] --> C
    end

    %% Checar e Alterar Atividades
    T[Usuário ou Participante checa atividades] --> U[API retorna atividades]
    T --> V[Usuário ou Participante altera atividades] --> W[API atualiza atividades no banco de dados]

    %% Checar Detalhes da Viagem
    N --> X[Usuário ou Participante checa detalhes da viagem] --> Y[API retorna detalhes da viagem]

    %% Fim
    X --> Z[Fim]

