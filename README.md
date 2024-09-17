# CRUD Básico com NestJS e TypeORM

Este é um CRUD básico feito em NestJS com TypeORM. O projeto ainda está em andamento e necessita de algumas melhorias, mas já implementa as principais funcionalidades de um sistema CRUD com autenticação JWT.

## Como Rodar o Projeto

### Notas Gerais

- **Validação do Token:** A validação do token ainda não está completamente implementada. Atualmente, é possível usar tokens de diferentes usuários, e a requisição ainda funcionará. Esse é um problema que estou ciente e vou corrigir em breve.
- **Validação Geral:** Preciso melhorar a validação em todas as requisições. Como não tenho muita experiência com o backend, vou ajustando e corrigindo os problemas conforme eles aparecem.


Para rodar o projeto, você precisa ter o PostgreSQL instalado na sua máquina e um arquivo `.env` configurado com as seguintes variáveis de ambiente:

```plaintext
HOST_DB= nome_do_host
PORT_DB= porta_de_conexão_do_banco_de_dados
USERNAME_DB= nome_de_usuário
PASSWORD_DB= senha_do_postgres
DATABASE= nome_do_banco_de_dados
SECRET_JWT= string_aleatória_para_token_jwt

Depois disso, rode um `npm install` e `npm run dev`, esses comandos devem instalar todas as dependências e rodar o projeto criando o banco de dados e a tabela.

## Como Rodar o Projeto

#### Criação de Usuário

O fluxo de dados para a criação de um usuário começa com o envio de uma requisição `POST` para a rota `{{url}}/user/create`. No corpo (body) da requisição, devem ser passados os seguintes campos:

- `first_name`: Nome do usuário (string)
- `last_name`: Sobrenome do usuário (string)
- `email`: E-mail do usuário (string)
- `password`: Senha do usuário (string)
- `isActive`: Status ativo do usuário (boolean)

Após enviar essa requisição, o servidor processa os dados e cria um novo registro de usuário no banco de dados, retornando uma resposta de sucesso ou erro, dependendo da validação dos dados.

#### Login de Usuário

Para realizar o login de um usuário, deve-se enviar uma requisição `POST` para a rota `{{url}}/user/login`. No corpo (body) da requisição, devem ser enviados os seguintes campos:

- `email`: E-mail do usuário (string)
- `password`: Senha do usuário (string)

A resposta dessa requisição irá conter uma mensagem indicando sucesso ou erro, dependendo da validação dos dados. Caso o login seja bem-sucedido, a resposta também incluirá um JSON contendo:

- Todas as informações do usuário
- Um token JWT

Esse token JWT deverá ser utilizado como validação nas próximas requisições que exigem autenticação.

#### Obter Informações do Usuário

Para obter as informações de um usuário autenticado, envie uma requisição `GET` para a rota `{{url}}/user/my-account`. No corpo (body) da requisição, deve ser enviado o seguinte campo:

- `email`: E-mail do usuário (string)

Além disso, é necessário incluir um `Bearer token` no cabeçalho de autorização (`Authorization`), que é o token JWT gerado durante o login.

A resposta dessa requisição irá retornar todos os dados do usuário, conforme estão armazenados no banco de dados.

### Atualização de Usuário

Para atualizar as informações de um usuário, envie uma requisição `PUT` para a rota `{{url}}/user/update/:id`. No corpo (body) da requisição, deve ser enviado um JSON com os seguintes campos:

- `email`: E-mail do usuário (string)
- `toUpdate`: Um JSON contendo os campos que devem ser alterados. Por exemplo:
  ```json
  {
    "email": "novo_email@example.com",
    "first_name": "NovoNome"
  }

Além disso, é necessário incluir um Bearer token no cabeçalho de autorização (Authorization), que é o token JWT gerado durante o login.

A requisição irá atualizar os campos especificados no JSON toUpdate para o usuário com o id fornecido na rota.

#### Exclusão de Usuário

Para excluir um usuário, envie uma requisição `POST` para a rota `{{url}}/user/delete`. No corpo (body) da requisição, devem ser enviados os seguintes campos:

- `id`: ID do usuário (string)
- `email`: E-mail do usuário (string)
- `password`: Senha do usuário (string)

Além disso, é necessário incluir um `Bearer token` no cabeçalho de autorização (`Authorization`), que é o token JWT gerado durante o login.

Essa rota não exclui o usuário do banco de dados, mas apenas define o campo `isActive` como `false`, desativando o usuário.

### Tecnologias Utilizadas:

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **JWT**
