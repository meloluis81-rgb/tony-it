# Tony IT — Landing Page

Landing page de suporte técnico da Tony IT (Manaus — AM). Site 100% estático (HTML + CSS + JS puro), sem etapa de build — pronto para publicar em qualquer host estático, incluindo a Vercel gratuita.

## Estrutura do projeto

```
tony-it/
├── index.html              → página única, referencia os arquivos abaixo
├── favicon.svg              → ícone da aba do navegador
├── README.md
└── src/
    ├── styles/
    │   ├── tokens.css        → variáveis de cor e glow (design system)
    │   ├── base.css          → reset, fundo, canvas, cursor custom, foco/skip-link
    │   ├── layout.css        → estrutura das seções (nav, hero, grids, footer)
    │   ├── components.css    → botões, badge de status, cabeçalhos de seção
    │   └── responsive.css    → breakpoints e prefers-reduced-motion
    └── scripts/
        ├── particles.js       → fundo de rede em Three.js (com fallback se falhar)
        ├── cursor.js          → cursor customizado (só em dispositivos com mouse)
        ├── animations.js      → entrada do hero, scroll reveal e contadores (GSAP)
        └── nav.js              → menu mobile e estado da nav ao rolar
```

O `vercel.json` na raiz define os cabeçalhos de segurança HTTP (veja seção "Segurança" abaixo) — a Vercel os aplica automaticamente no deploy, sem nenhuma configuração manual.

Não há `package.json` nem etapa de build: como o site é HTML/CSS/JS puro sem dependências para instalar, adicionar um `package.json` só acrescentaria complexidade (a Vercel tentaria rodar `npm install` à toa). Se no futuro o projeto ganhar formulário com backend ou build tooling (Vite, etc.), aí sim vale adicionar.

As bibliotecas externas (Three.js e GSAP) continuam carregadas via CDN (cdnjs) no próprio `index.html`, exatamente como antes.

## Rodar localmente

Como é só HTML/CSS/JS estático, basta abrir com um servidor simples (abrir o `index.html` direto no navegador via `file://` pode bloquear os `fetch`/paths relativos em alguns navegadores):

```bash
cd tony-it
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Passo a passo — publicar de graça na Vercel

Não precisa saber usar terminal/Git para isso — dá para fazer tudo pelo navegador.

### 1. Criar uma conta na Vercel
Acesse **vercel.com** → **Sign Up** → escolha **Continue with GitHub** (mais simples, porque o passo 3 já vem pronto). Se não tiver conta no GitHub, crie uma gratuita em **github.com/signup** antes.

### 2. Subir os arquivos para o GitHub (sem usar comandos de terminal)
1. Em **github.com**, clique em **New repository**.
2. Dê um nome, por exemplo `tony-it`, marque como **Public** ou **Private** (tanto faz para a Vercel) e clique em **Create repository**.
3. Na página do repositório recém-criado, clique em **uploading an existing file** (ou **Add file → Upload files**).
4. Arraste a pasta `tony-it` inteira (ou todos os arquivos e a subpasta `src/` mantendo a estrutura) para a área de upload.
5. Role até o fim e clique em **Commit changes**.

### 3. Importar o projeto na Vercel
1. No painel da Vercel, clique em **Add New → Project**.
2. Selecione o repositório `tony-it` que você acabou de criar.
3. Na tela de configuração:
   - **Framework Preset**: escolha **Other** (não é React/Next/etc.).
   - **Build Command**: deixe em branco.
   - **Output Directory**: deixe o padrão (raiz do projeto).
4. Clique em **Deploy**.

### 4. Pronto
Em cerca de 1 minuto a Vercel te dá uma URL gratuita, algo como `tony-it.vercel.app`. Qualquer novo upload de arquivo no GitHub (repetindo o passo 2.3–2.5) gera automaticamente um novo deploy.

### Alternativa mais rápida (sem GitHub)
Se quiser publicar agora mesmo sem criar repositório:
1. Instale o **Node.js** (nodejs.org) se ainda não tiver.
2. Abra um terminal dentro da pasta `tony-it` e rode:
   ```bash
   npx vercel
   ```
3. Siga as perguntas no terminal (login pelo navegador, nome do projeto, confirmar diretório). Ele já detecta que é um site estático.
4. Para publicar em produção depois de testar: `npx vercel --prod`.

Essa alternativa não fica conectada ao GitHub — para atualizar o site depois, rode `npx vercel --prod` novamente na pasta.

### Domínio próprio (opcional, também de graça)
Dentro do projeto na Vercel: **Settings → Domains** → adicione o seu domínio (ex.: `tonyit.com.br`) e siga as instruções de DNS mostradas na tela. O certificado HTTPS é gerado automaticamente.

## O que foi corrigido nesta reestruturação
- Projeto dividido em arquivos separados por responsabilidade (antes era um único HTML com CSS/JS inline).
- Bug de acessibilidade: itens do menu mobile ficavam alcançáveis por Tab mesmo com o menu fechado — corrigido com `visibility:hidden`.
- `aria-expanded`/`aria-controls` adicionados ao botão do menu mobile, e `aria-label` dinâmico ("Abrir menu" / "Fechar menu").
- Animação de partículas (Three.js) pausa quando a aba fica em segundo plano, e trata o caso de WebGL indisponível.
- Foco visível por teclado (`:focus-visible`) e skip-link adicionados.
- `meta description`, Open Graph e favicon adicionados.
- Dados atualizados: período do curso (3º) e e-mail de contato (`tonyit214@gmail.com`).

## Segurança — o que já está aplicado automaticamente
- **HTTPS grátis**: a Vercel emite e renova certificado TLS automaticamente para qualquer domínio (`.vercel.app` ou domínio próprio), sem nenhuma ação sua.
- **Content-Security-Policy**: só permite scripts do próprio site e da cdnjs (onde estão Three.js/GSAP), e bloqueia o site de ser carregado dentro de um `<iframe>` de terceiros.
- **Cabeçalhos HTTP** (`vercel.json`): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` (desativa acesso a câmera/microfone/geolocalização, que o site não usa) e `Strict-Transport-Security` (força HTTPS em todas as visitas futuras).
- Removido o único estilo inline do HTML (exigido pela política acima ser mais rígida).
- Scripts de terceiros (Three.js, GSAP) carregam com `crossorigin="anonymous"` e `referrerpolicy="no-referrer"`, evitando vazar a URL da sua página para a CDN.
- Site 100% estático: sem backend, banco de dados, formulário ou chave de API — não há onde injetar SQL, nem segredo para vazar.
- Proteção contra DDoS básica incluída de graça pela própria Vercel (Edge Network / Cloudflare por trás).

### Passo manual opcional (2 min) — Subresource Integrity
Por segurança, não fui atrás de hashes de integridade (SRI) para colar aqui sem ter certeza absoluta de que baterão com a versão exata do arquivo — um hash errado quebraria o carregamento do script. Se quiser esse reforço extra (protege contra a cdnjs ser comprometida e servir um arquivo trocado), é rápido:
1. Acesse **cdnjs.com**, busque "three.js" → versão **r128** → arquivo `three.min.js`.
2. Clique no ícone de copiar ao lado da tag `<script>` — ele já vem com o atributo `integrity="sha512-..."` correto.
3. Cole essa tag no lugar da atual em `index.html`. Repita para "gsap" versão **3.12.5** (`gsap.min.js` e `ScrollTrigger.min.js`).

## Pendências que dependem de confirmação sua
- A página ainda não tem as seções **Diferenciais**, **Prova Social** e **FAQ** previstas no escopo original — me avise se quiser que eu implemente.
- Confirme se os números "216h de formação técnica" e "680h de inglês" continuam corretos.
