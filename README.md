# Sistema de Currículos

Este projeto é um sistema de gerenciamento de currículos desenvolvido com **Django** (backend) e **React** (frontend). Ele possibilita que recrutadores visualizem todos os currículos e que usuários comuns vejam e gerenciem seus próprios dados de currículo.

## Tabela de Conteúdos
- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [API Endpoints](#api-endpoints)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Visão Geral
O sistema foi desenvolvido para um desafio técnico e é dividido entre um backend em **Django** com API **REST** e um frontend em **React**, criado com **Vite** para gerenciar currículos de usuários.

## Arquitetura
O backend em Django fornece endpoints para operações CRUD, enquanto o frontend em React consome esses dados e exibe a interface. A autenticação é baseada em **JWT (JSON Web Tokens)**.

## Funcionalidades
- **Usuários Comuns**:
  - Cadastro de currículo.
  - Visualização de seus próprios dados (dados pessoais, contatos, experiências profissionais e formação acadêmica).
- **Recrutadores**:
  - Visualização da lista completa de currículos dos candidatos.

## Requisitos
- **Node.js** (versão recomendada: 14+)
- **Python** (versão recomendada: 3.8+)
- **Django** e **Django REST Framework**
- **PostgreSQL** ou outro banco de dados (ajustável nas configurações do Django)

## Configuração
### Backend
1. Clone o repositório e navegue até a pasta do backend.
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure o banco de dados no arquivo `settings.py` (substitua pelo banco de sua escolha).
4. Execute as migrações:
   ```bash
   python manage.py migrate
   ```
5. Inicie o servidor Django:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navegue até a pasta do frontend e instale as dependências:
   ```bash
   npm install
   ```
2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Uso
### Login e Autenticação
1. Acesse a página de login. Após a autenticação, o sistema armazena `accessToken`, `refreshToken`, `isRecrutador`, e `userId` no local storage para controlar as permissões.
2. Caso não deseje criar um novo usuário clique em cadastrar abaixo do botão de login, digite o usuário, senha e escolha a opção se é um recrutador ou não
3. O frontend envia o token de autenticação via headers em cada requisição para acessar os dados protegidos.

### Página inicial
1. A página inicial exibirá o currículo do usuário logado, caso não tenha, será exibido um link para cria-lo.
2. Se o usuário logado for um recrutador, todos os currículos criados serão exibidos.

## Estrutura do Projeto
- `backend/`: Código fonte do servidor Django, com modelos para `DadosUsuario`, `DadosPessoais`, `Contato`, `ExperienciaProfissional` e `FormacaoAcademica`.
- `frontend/`: Código fonte da aplicação React criada com **Vite**, contendo as páginas de autenticação, visualização de currículo e listagem para recrutadores.

## Autenticação
- A autenticação utiliza JWT, e o sistema checa as permissões do usuário logado para controlar o que é exibido.
- **Cookies** e **local storage** são utilizados para verificar o tipo de usuário (recrutador ou usuário comum) e exibir dados específicos na landing page.

## API Endpoints
- `GET /curr/`: Retorna todos os currículos se o usuário for recrutador; caso contrário, retorna apenas os dados do usuário logado.
- `POST /curr/`: Salva os dados do currículo do usuário logado.

## Tecnologias Utilizadas
- **Backend**: Django, Django REST Framework
- **Frontend**: React (Vite)
- **Autenticação**: JWT

---

Esse README fornece as informações principais do seu projeto, facilitando o entendimento sobre a arquitetura e funcionalidades tanto para os membros da equipe quanto para futuros desenvolvedores.