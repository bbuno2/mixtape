# 🎵 MIXTAPE

Uma plataforma moderna para músicos independentes compartilharem suas criações. Sem custos, sem monetização — apenas música.

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# 1. Entre na pasta do projeto
cd mixtape

# 2. Instale as dependências
npm install

# 3. Rode em desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🛠️ Build para produção

```bash
npm run build
npm run preview
```

---

## 🎨 Stack

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | Framework principal |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| Zustand | Gerenciamento de estado |
| Lucide React | Ícones |
| Headless UI | Modal acessível |

---

## ⚙️ Funcionalidades

- ✅ **Upload de músicas** — Drag & drop, suporte a MP3/WAV/OGG
- ✅ **Player de áudio** — Play/Pause, seek, volume, próxima/anterior
- ✅ **Biblioteca** — Grid responsivo com busca em tempo real
- ✅ **Modo Admin** — Ativar para fazer uploads e remover músicas
- ✅ **Persistência** — Dados salvos no localStorage
- ✅ **Design dark** — Tema preto + laranja com gradientes suaves

---

## 📂 Estrutura

```
src/
├── components/
│   ├── Header.tsx       # Navbar com logo, busca e botão Admin
│   ├── MusicCard.tsx    # Card de cada música na biblioteca
│   ├── AudioPlayer.tsx  # Player fixo no rodapé
│   └── UploadModal.tsx  # Modal de upload com drag & drop
├── pages/
│   └── Home.tsx         # Página principal (hero + biblioteca)
├── store/
│   └── musicStore.ts    # Estado global com Zustand
├── types/
│   └── music.ts         # Tipagem TypeScript
├── App.tsx
└── index.css
```

---

## 💡 Como usar

1. **Acesse o site** — a biblioteca começa vazia
2. **Ative o modo Admin** — clique em "Sou administrador" ou no botão "Admin" no canto superior
3. **Envie músicas** — clique em "Enviar música", preencha os dados e suba o arquivo
4. **Ouça** — clique em qualquer música para reproduzir no player do rodapé
5. **Busque** — use a barra de busca para filtrar por título ou artista
