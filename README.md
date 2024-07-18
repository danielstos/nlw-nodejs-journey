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


