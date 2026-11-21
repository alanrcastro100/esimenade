# eSimENADE — Plataforma de Simulados ENADE

Sistema web local para carregamento de provas do ENADE em PDF, conferência/homologação de gabarito e resolução de simulados por alunos.

## Stack Tecnológico
- **Front-end**: React + TypeScript (Vite) + Tailwind CSS (Material Design 3 — branco e azul)
- **Back-end**: Python (FastAPI) + SQLAlchemy 2.x + PyJWT
- **Banco de Dados**: SQLite (gerado automaticamente em execução local)

---

## Pré-requisitos
Antes de começar, certifique-se de ter instalado na sua máquina:
- **Git**
- **Python 3.11+** (`python --version`)
- **Node.js 20+** e **npm** (`node --version`, `npm --version`)

---

## Como clonar e executar localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/alanrcastro100/esimenade.git
cd esimenade
```

### 2. Configurar e rodar o Back-end (FastAPI)
Abra um terminal na raiz do projeto:

**Windows (PowerShell):**
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

**Linux / macOS:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API disponível em: `http://localhost:8000`
- Documentação interativa (Swagger): `http://localhost:8000/docs`
- Na primeira execução, o banco SQLite (`backend/storage/esimenade.db`) é criado automaticamente já populado com os usuários padrão.

### 3. Configurar e rodar o Front-end (React + Vite)
Abra um **segundo terminal** na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

- Aplicação disponível em: `http://localhost:5173`

---

## Credenciais padrão (Seed automático)

| Perfil | E-mail | Senha | Rota inicial |
|---|---|---|---|
| **Administrador (Professor)** | `admin@esimenade.com` | `admin123` | `/admin` |
| **Aluno** | `aluno@esimenade.com` | `aluno123` | `/exams` |

> **Dica de verificação (`PB01` e `PB02`)**: tente acessar `/admin` logado como aluno para validar o bloqueio de perfil, ou informe uma senha incorreta para validar a mensagem de erro na tela de login.

---

## Testes automatizados

### Back-end (`pytest`)
**Windows (PowerShell):**
```powershell
cd backend
.\.venv\Scripts\pytest tests -v
```

**Linux / macOS:**
```bash
cd backend
source .venv/bin/activate
pytest tests -v
```

### Front-end (TypeScript + Build)
```bash
cd frontend
npm run build
```

---

## Documentação do Projeto
- [Low-Level Design (LLD)](docs/LLD.md)
- [Stack Tecnológico e Observações](docs/tech_stack_e_detalhes.md)
- [EAP e Product Backlog](docs/Equipe%201%20-%20Backlog.pdf)
