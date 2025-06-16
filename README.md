# RAG-CHATBOT-FRONTEND

Projeto frontend em ReactJS. 

## Comunicado

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### Tecnologias:

 - ReactJS
 - TypeScript
 - Vite (para setup rápido do projeto)
 - Axios (para requisições HTTP)
 - react-dropzone (para upload de arquivos fácil com drag-and-drop)
 - CSS Modules (para estilização encapsulada)

### Acesse o diretório rag-chatbot-frontend

 - Instalar Dependências:

```
npm install
```

## No arquivo `.env` da Frontend adicione o hostname da API:

```
VITE_API_BASE_URL=#############################
```

### Estrutura de Pastas (Sugestão)

Dentro da pasta src, podemos organizar assim:

```
rag-chatbot-frontend/
├── public/
├── src/
│   ├── assets/              # Ícones, imagens (opcional)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ChatMessage/
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatMessage.module.css
│   │   └── FileUpload/
│   │       ├── FileUpload.tsx
│   │       └── FileUpload.module.css
│   ├── services/            # Lógica de API
│   │   └── api.ts
│   ├── App.tsx              # Componente principal da aplicação
│   ├── index.css            # Estilos globais
│   └── main.tsx             # Ponto de entrada React
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

 1. Certifique-se de que seu servidor Django (com CORS configurado) esteja rodando em http://127.0.0.1:8000.

 2. No terminal, na pasta rag-chatbot-frontend, execute:

```
npm run dev
```

### Funcionalidades:

 - Interface de chat.
 - Envio de perguntas de texto.
 - Exibição das respostas do bot.
 - Botão para selecionar arquivos (.txt, .pdf, .docx, .xlsx).
 - Área de drag-and-drop para os mesmos tipos de arquivo.
 - Feedback visual durante o upload (mensagem de status e barra de progresso).
 - Mensagens de sistema para status de upload e erros.
 - Indicador de carregamento enquanto o bot processa a query.
 - Design responsivo básico (limitado pela largura máxima).
