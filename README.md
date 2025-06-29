# MoodDy# MoodDy - Diário de Sentimentos Inteligente

## 📝 Visão Geral do Projeto

**MoodDy** é um diário de sentimentos inteligente que vai além do simples registro. Ele permite aos usuários documentar suas emoções e, com a ajuda de inteligência artificial avançada, oferece sugestões personalizadas de atividades *fora do computador* para ajudar a melhorar, extravasar ou incentivar o humor do usuário.

Desenvolvido com um backend robusto em **Node.js, Express e TypeScript**, e utilizando **Prisma** para gerenciamento de banco de dados, o MoodDy integra a poderosa **Google Gemini API** para análise de sentimentos em português e geração de recomendações contextualizadas.

---

## ✨ Funcionalidades Principais

### 📓 Diário de Sentimentos
- **POST /create-diary:** Registre seu texto e seu humor (opcional). A IA analisará o texto e sugerirá atividades.
- **GET /viewalldiary:** Visualize todas as suas entradas de diário, ordenadas cronologicamente.
- **GET /viewdiarybyid/:id:** Acesse uma entrada específica do diário pelo seu ID.

### 🤖 Inteligência Artificial com Google Gemini
- **Análise de Sentimentos em Português:** O Gemini detecta a emoção predominante com nuance e precisão.
- **Sugestões Personalizadas:** Baseado na emoção detectada e preferências do usuário, a IA sugere 3 atividades fora do ambiente digital (com contexto local de **Sorocaba, SP, Brasil**).
  
---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma**
- **dotenv**
- **ts-node-dev**

### Inteligência Artificial
- **Google Gemini API (gemini-1.5-flash)**  
  Processamento de linguagem natural e sugestões de atividades.

### Banco de Dados
- **PostgreSQL** (configurado por padrão com Prisma)

---

## 🚀 Como Começar (Setup Local)

### ✅ Pré-requisitos
- Node.js v18+
- PostgreSQL
- Conta Google Cloud com API do Gemini ativada

### 🔧 Passos de Instalação

1. **Clonar o Repositório**
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd MoodDy
```

2. **Instalar Dependências**
```bash
npm install
```

3. **Criar o Arquivo `.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name?schema=public"
GEMINI_API_KEY="SUA_CHAVE_DE_API_DO_GEMINI_AQUI"
```

4. **Configurar o Banco de Dados**
```bash
npx prisma generate
npx prisma migrate dev --name init_database
```

5. **Iniciar o Servidor**
```bash
npm start
```

O servidor rodará em `http://localhost:3000`.

---

## ⚙️ Configuração da Google Gemini API

1. Acesse o [Google AI Studio](https://makersuite.google.com/) e entre com sua conta Google.
2. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/).
3. Gere uma chave de API na seção “Credenciais”.
4. Copie a chave e coloque no `.env`:
```env
GEMINI_API_KEY="sua_chave_aqui"
```

> O modelo padrão utilizado é `gemini-1.5-flash`.

---

## 🧪 Endpoints da API

### 📓 Diário de Sentimentos
- `POST /api/create-diary`  
  Corpo:
  ```json
  {
    "text": "Seu texto do diário aqui",
    "userMood": "feliz"
  }
  ```

  Exemplo de resposta:
  ```json
  {
    "message": "Diário registrado com sucesso!",
    "diaryEntry": {
      "aiInferredEmotion": "alegria",
      "suggestedActivities": [
        "Fazer um passeio no parque",
        "Ligar para um amigo",
        "Assistir a um filme engraçado"
      ]
    }
  }
  ```

- `GET /api/viewalldiary`
- `GET /api/viewdiarybyid/:id`


---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Você pode:
- Abrir uma **Issue** com bugs ou sugestões.
- Criar um **Pull Request** com melhorias ou novas funcionalidades.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.  
Veja o arquivo `LICENSE` para mais detalhes.
