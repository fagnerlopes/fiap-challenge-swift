# Sistema de Banco de Dados Swift Pro

Este diretório contém os arquivos JSON que simulam um banco de dados para a aplicação Swift Pro.

## 📁 Estrutura dos Dados

### `users.json`

Contém informações dos usuários do sistema:

- **users**: Array com dados dos usuários (gerentes e vendedores)
- Campos: id, email, password, name, role, store_id, avatar, profile, etc.

### `stores.json`

Informações das lojas Swift:

- **stores**: Array com dados das filiais
- Campos: id, name, address, manager_id, metrics, etc.

### `rankings.json`

Sistema de gamificação e rankings:

- **levels**: Níveis disponíveis (Iniciante → Lenda Swift)
- **user_rankings**: Posição e pontos de cada usuário

### `missions.json`

Missões e objetivos gamificados:

- **missions**: Missões disponíveis no sistema
- **user_missions**: Progresso dos usuários nas missões

### `sales.json`

Vendas e produtos:

- **sales**: Histórico de vendas registradas
- **products**: Catálogo de produtos disponíveis

### `learning_tracks.json`

Trilhas de aprendizagem:

- **learning_tracks**: Cursos e módulos educacionais
- **user_progress**: Progresso dos usuários nos cursos

## 🔧 Como Usar o Sistema

### Incluir o Sistema de Dados

```html
<script src="assets/js/database.js"></script>
```

### Exemplos de Uso

#### Buscar todos os usuários

```javascript
const users = await SwiftDB.findAll("users");
console.log(users);
```

#### Buscar usuário por ID

```javascript
const user = await SwiftDB.findById("users", 1);
console.log(user);
```

#### Buscar por campo específico

```javascript
const vendedores = await SwiftDB.findBy("users", "role", "vendedor");
console.log(vendedores);
```

#### Criar novo registro

```javascript
const newUser = await SwiftDB.create("users", {
  email: "novo@swift.com",
  name: "Novo Usuário",
  role: "vendedor",
  store_id: 1,
});
```

#### Atualizar registro

```javascript
const updatedUser = await SwiftDB.update("users", 1, {
  name: "Nome Atualizado",
});
```

#### Remover registro

```javascript
const removed = await SwiftDB.remove("users", 1);
```

### Métodos Específicos do Domínio

#### Autenticação

```javascript
const result = await SwiftDB.authenticateUser("vendedor@swift.com", "123456");
if (result.success) {
  console.log("Usuário logado:", result.user);
}
```

#### Ranking do usuário

```javascript
const ranking = await SwiftDB.getUserRanking(2);
console.log("Nível atual:", ranking.level.name);
console.log("Pontos:", ranking.current_points);
```

#### Missões do usuário

```javascript
const missions = await SwiftDB.getUserMissions(2);
missions.forEach((mission) => {
  console.log(`${mission.title}: ${mission.user_progress.status}`);
});
```

#### Registrar venda

```javascript
const sale = await SwiftDB.registerSale({
  user_id: 2,
  store_id: 1,
  amount: 89.5,
  products: [
    { name: "Picanha", price: 65.9, category: "carnes_bovinas" },
    { name: "Tempero", price: 23.6, category: "temperos" },
  ],
  is_cross_sell: true,
  payment_method: "credit_card",
});
```

## 🔒 Dados de Teste

### Usuários Disponíveis:

- **Gerente**: gerente@swift.com / 123456
- **Vendedor**: vendedor@swift.com / 123456
- **Maria Silva**: maria.silva@swift.com / 123456
- **João Santos**: joao.santos@swift.com / 123456

### Lojas:

- Vila Mariana (ID: 1)
- Mooca (ID: 2)
- Liberdade (ID: 3)

## 🚀 Migração do Sistema Legacy

O sistema foi migrado de dados estáticos para este sistema de banco JSON:

### Antes (login.js):

```javascript
const MOCK_USERS = {
  "gerente@swift.com": { ... }
};
```

### Depois:

```javascript
const loginResult = await SwiftDB.authenticateUser(email, password);
```

### Vantagens:

- ✅ Dados centralizados
- ✅ CRUD padronizado
- ✅ Fácil expansão
- ✅ Estrutura escalável
- ✅ Separação de responsabilidades

## 📝 Notas Importantes

1. **Cache**: Os dados são carregados uma vez e ficam em cache durante a sessão
2. **Persistência**: Atualmente simula salvamento (console.log). Em produção, seria enviado para backend
3. **IDs**: Gerados automaticamente de forma incremental
4. **Timestamps**: Criados automaticamente nos registros
5. **Validação**: Implementada nos métodos específicos do domínio

Este sistema fornece uma base sólida para desenvolvimento e pode ser facilmente migrado para um backend real no futuro.
