# 🏋️‍♂️ FitLab Painel Administrativo

Bem-vindo ao repositório do **FitLab Painel Administrativo**, um sistema completo para gestão de academias, clientes, profissionais e operações do dia a dia, desenvolvido com React + Vite, integração REST, responsividade, gráficos interativos e experiência de uso otimizada para web!

---

## 📦 Índice

* [Demonstração](#demonstração)
* [Primeiros Passos](#primeiros-passos)
* [Scripts Disponíveis](#scripts-disponíveis)
* [Principais Tecnologias](#principais-tecnologias)
* [Funcionalidades](#funcionalidades)
* [Estrutura de Pastas](#estrutura-de-pastas)
* [Customizações e UX](#customizações-e-ux)
* [Contribuindo](#contribuindo)
* [Licença](#licença)

---

## 🚀 Demonstração

Veja o projeto rodando em: [https://gabrielsarteof.github.io/fitlab-frontend](https://gabrielsarteof.github.io/fitlab-frontend)

---

## ⚡ Primeiros Passos

Para rodar o projeto localmente, siga o passo a passo:

### 1. Clone o repositório

```sh
git clone https://github.com/gabrielsarteof/fitlab-frontend.git
cd fitlab-frontend
```

### 2. Instale as dependências

```sh
npm install
```

### 3. Crie o arquivo `.env`

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_API_URL=https://sua-api-backend.com
```

Substitua pela URL real da sua API.

### 4. Rode o projeto em modo desenvolvimento

```sh
npm run dev
```

Acesse em [http://localhost:5173](http://localhost:5173) (ou o endereço indicado no terminal).

---

## 🧰 Scripts Disponíveis

* `npm run dev` — Inicia o servidor de desenvolvimento.
* `npm run build` — Gera a versão de produção (build).
* `npm run preview` — Visualiza o build localmente.
* `npm run lint` — Executa o linter para checar qualidade do código.
* `npm run deploy` — Faz deploy no GitHub Pages.

---

## 🛠️ Principais Tecnologias

* **React 19** — Framework principal de UI.
* **Vite** — Bundler ultrarrápido.
* **Bootstrap 5** + Bootstrap Icons — Interface responsiva e visual moderno.
* **Axios** — Requisições HTTP.
* **React Router DOM v7** — Rotas e navegação SPA.
* **Chart.js + react-chartjs-2** — Gráficos dinâmicos.
* **react-hot-toast** — Notificações toast elegantes.
* **ESLint** — Padronização e qualidade de código.

---

## 🌟 Funcionalidades do Sistema

### 🔒 Autenticação & Segurança

* Login protegido por JWT e middleware de rota (ProtectedRoute).
* Rotas protegidas: apenas usuários autenticados acessam o painel.

### 🏠 Dashboard Interativo

* KPIs: total de clientes, assinaturas, vencendo, check-ins do dia.
* Gráficos de assinaturas (novas/renovadas por mês).
* Gráfico de ocupação horária da academia.
* Tabela de check-ins recentes.
* Receita semanal, novos clientes da semana.
* Ações rápidas: check-in, renovar assinatura, atualizar estado físico.

### 👤 Gestão de Usuários & Profissionais

* Cadastro, edição e exclusão de:

  * Clientes
  * Personal Trainers
  * Nutricionistas
  * Administradores

### 📝 Gestão de Processos

* Assinaturas (planos, pagamentos, renovação automática, filtro de vencimento).
* Check-ins com autocomplete (clientes/assinaturas).
* Planos de academia, dietas, treinos, avaliações físicas.

### 🧭 Navegação & UX

* Sidebar responsiva com agrupamento por seções (Pessoas, Operacional, Serviços, Administração).
* Topbar com pesquisa inteligente de páginas.
* Modal para cadastros/edições rápidos e sem reload de página.
* Notificações e feedback visual (react-hot-toast).
* Responsividade total (desktop, tablet, mobile).

### 🎨 Customização Visual

* Temas e ícones próprios FitLab.
* Logo customizada em SVG.
* Uso intensivo de Bootstrap para consistência visual.

---

## 📂 Estrutura de Pastas

```
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── chartjs-setup.js
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── modals/
│   ├── assets/
│   └── App.css
├── index.html
├── .env.example
├── package.json
├── eslint.config.js
├── vite.config.js
└── README.md
```

---

## 💡 Customizações & UX

* **Pesquisa Global**: O usuário pode buscar qualquer página do sistema via barra superior.
* **Autocomplete Inteligente**: Campos de seleção de clientes, planos e profissionais com busca.
* **Toasts de Feedback**: Sucesso, erro e carregamento em toda ação relevante.
* **Validações Front-end**: Campos obrigatórios e validações inteligentes nos formulários.
* **Responsividade Avançada**: Sidebar colapsa e adapta totalmente a tablets e smartphones.
* **Gráficos e Indicadores**: Análises visuais sobre o desempenho da academia.

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/sua-feature`)
3. Commit suas alterações (`git commit -m 'feat: Minha nova feature'`)
4. Push para a branch (`git push origin feature/sua-feature`)
5. Abra um Pull Request

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.

---

> Desenvolvido com ❤️ por Gabriel Sarte e Matheus Cardoso.
