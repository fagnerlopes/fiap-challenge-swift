# Swift Pro - Sistema de Gamificação JBS/Swift

## Trabalho do 1º ANO ANÁLISE E DESENVOLVIMENTO DE SISTEMAS

Sistema de gamificação para funcionários da JBS/Swift, player de varejo de carnes e embutidos.

## Como Executar o Projeto

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Opção 1: Execução Direta

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` diretamente no navegador

### Opção 2: Servidor Local (Recomendado)

#### Usando Python (se instalado):

```bash
# Python 3
python -m http.server 8000
```

#### Usando Node.js (se instalado):

```bash
# Instalar servidor simples globalmente
npm install -g http-server

# Executar na pasta do projeto
http-server
```

#### Usando PHP (se instalado):

```bash
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

## 🔐 Sistema de Login

A aplicação possui um sistema de autenticação mockado para fins acadêmicos. Use as credenciais abaixo para testar as diferentes visões:

### 👨‍💼 Gerente

- **E-mail**: `gerente@swift.com`
- **Senha**: `123456`
- **Acesso**: Todas as páginas, incluindo a **Área do Gerente**

### 👨‍💻 Vendedor

- **E-mail**: `vendedor@swift.com`
- **Senha**: `123456`
- **Acesso**: Todas as páginas, **exceto** a Área do Gerente

### 👨‍💻 Estoquista

- **E-mail**: `estoquista@swift.com`
- **Senha**: `123456`
- **Acesso**: Todas as páginas, **exceto** a Área do Gerente e a home do Vendedor

### 🔒 Controle de Acesso

- **Página `gerente.html`**: Restrita apenas a usuários com role "gerente"
- **Demais páginas**: Acessíveis por qualquer usuário logado
- **Sistema de sessão**: Suporte a "Lembrar de mim" usando localStorage
- **Logout**: Disponível em todas as páginas através do botão "Sair"

### 🚀 Como Testar

1. Acesse `login.html`
2. Use uma das credenciais acima
3. Marque "Lembrar de mim" se desejar persistir a sessão
4. Será redirecionado automaticamente baseado na sua role
5. Teste acessar `gerente.html` com diferentes usuários
