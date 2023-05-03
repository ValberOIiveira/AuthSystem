Node.js Authentication API

👋 E aí, galera! Esta é uma API básica de autenticação para aplicações Node.js. Basicamente, ela permite registrar novos usuários, fazer login usando JSON Web Tokens (JWT) e acessar rotas protegidas.
Como utilizar

Para usar essa belezinha, siga as etapas abaixo:

    Clone o projeto na sua máquina 🖥️

    Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

    PORT=3000
    DB_CONNECT=<string de conexão com o MongoDB>
    SECRET=<chave secreta para geração dos JWTs>

    Rode um npm install para instalar as dependências ⚡

    Dê um npm start para iniciar o servidor 🚀

    E pronto: acesso a http://localhost:3000 tá liberado! 🎉

A partir daí, você poderá realizar as seguintes operações:

    Registrar um novo usuário enviando uma requisição POST para /auth/register 📝
    Fazer login enviando uma requisição POST para /auth/user 🔑
    Acessar informações do usuário logado enviando uma requisição GET para /user/:id 👀

Tecnologias utilizadas

Aqui vão as tecnologias que usamos para construir isso aqui:

    Node.js 🚀
    Express 🚂
    MongoDB 🍃
    bcrypt 🔒
    jsonwebtoken 🔑
    dotenv 🌳

