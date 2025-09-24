/**
 * Sistema de Banco de Dados JSON
 * Simula operações de CRUD em arquivos JSON locais
 */

(function () {
  "use strict";

  // Cache para os dados carregados
  const dataCache = new Map();

  // URLs dos arquivos de dados
  const DATA_FILES = {
    users: "./database/users.json",
    stores: "./database/stores.json",
    rankings: "./database/rankings.json",
    missions: "./database/missions.json",
    sales: "./database/sales.json",
    learning_tracks: "./database/learning_tracks.json",
  };

  /**
   * Carrega dados de um arquivo JSON
   * @param {string} tableName - Nome da tabela/arquivo
   * @returns {Promise<Object>} Dados carregados
   */
  async function loadData(tableName) {
    if (dataCache.has(tableName)) {
      return dataCache.get(tableName);
    }

    // Primeiro verificar se há dados salvos localmente
    try {
      const localKey = `swift_db_${tableName}`;
      const localData = localStorage.getItem(localKey);
      if (localData) {
        const parsedData = JSON.parse(localData);
        dataCache.set(tableName, parsedData);
        console.log(`📂 Dados carregados do localStorage para ${tableName}`);
        return parsedData;
      }
    } catch (error) {
      console.warn(`Erro ao carregar dados locais para ${tableName}:`, error);
    }

    // Se não há dados locais, carregar do arquivo JSON
    try {
      const response = await fetch(DATA_FILES[tableName]);
      if (!response.ok) {
        throw new Error(`Erro ao carregar ${tableName}: ${response.status}`);
      }

      const data = await response.json();
      dataCache.set(tableName, data);
      console.log(`📄 Dados carregados do arquivo JSON para ${tableName}`);
      return data;
    } catch (error) {
      console.error(`Erro ao carregar dados de ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Salva dados no cache (simula persistência)
   * Em um ambiente real, isso faria uma requisição POST/PUT para o backend
   * @param {string} tableName - Nome da tabela
   * @param {Object} data - Dados para salvar
   */
  function saveData(tableName, data) {
    dataCache.set(tableName, data);

    // Salvar no localStorage para simular persistência
    try {
      const key = `swift_db_${tableName}`;
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ Dados salvos localmente para ${tableName}:`, {
        table: tableName,
        records: data[Object.keys(data)[0]]?.length || 0,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        `❌ Erro ao salvar dados localmente para ${tableName}:`,
        error
      );
    }

    // TODO: Implementar persistência real quando houver backend
  }

  /**
   * Busca todos os registros de uma tabela
   * @param {string} tableName - Nome da tabela
   * @returns {Promise<Array>} Lista de registros
   */
  async function findAll(tableName) {
    const data = await loadData(tableName);
    const mainKey = Object.keys(data)[0]; // Ex: 'users', 'stores', etc.
    return data[mainKey] || [];
  }

  /**
   * Busca um registro por ID
   * @param {string} tableName - Nome da tabela
   * @param {number} id - ID do registro
   * @returns {Promise<Object|null>} Registro encontrado ou null
   */
  async function findById(tableName, id) {
    const records = await findAll(tableName);
    return records.find((record) => record.id === id) || null;
  }

  /**
   * Busca registros por campo específico
   * @param {string} tableName - Nome da tabela
   * @param {string} field - Campo para buscar
   * @param {any} value - Valor para buscar
   * @returns {Promise<Array>} Lista de registros encontrados
   */
  async function findBy(tableName, field, value) {
    const records = await findAll(tableName);
    return records.filter((record) => record[field] === value);
  }

  /**
   * Cria um novo registro
   * @param {string} tableName - Nome da tabela
   * @param {Object} newRecord - Dados do novo registro
   * @returns {Promise<Object>} Registro criado com ID
   */
  async function create(tableName, newRecord) {
    const data = await loadData(tableName);
    const mainKey = Object.keys(data)[0];
    const records = data[mainKey] || [];

    // Gerar novo ID
    const newId =
      records.length > 0 ? Math.max(...records.map((r) => r.id)) + 1 : 1;

    const recordToCreate = {
      id: newId,
      ...newRecord,
      created_at: new Date().toISOString(),
    };

    records.push(recordToCreate);
    data[mainKey] = records;
    saveData(tableName, data);

    return recordToCreate;
  }

  /**
   * Atualiza um registro existente
   * @param {string} tableName - Nome da tabela
   * @param {number} id - ID do registro
   * @param {Object} updates - Campos para atualizar
   * @returns {Promise<Object|null>} Registro atualizado ou null se não encontrado
   */
  async function update(tableName, id, updates) {
    const data = await loadData(tableName);
    const mainKey = Object.keys(data)[0];
    const records = data[mainKey] || [];

    const recordIndex = records.findIndex((record) => record.id === id);
    if (recordIndex === -1) {
      return null;
    }

    records[recordIndex] = {
      ...records[recordIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    data[mainKey] = records;
    saveData(tableName, data);

    return records[recordIndex];
  }

  /**
   * Remove um registro
   * @param {string} tableName - Nome da tabela
   * @param {number} id - ID do registro
   * @returns {Promise<boolean>} True se removido, false se não encontrado
   */
  async function remove(tableName, id) {
    const data = await loadData(tableName);
    const mainKey = Object.keys(data)[0];
    const records = data[mainKey] || [];

    const recordIndex = records.findIndex((record) => record.id === id);
    if (recordIndex === -1) {
      return false;
    }

    records.splice(recordIndex, 1);
    data[mainKey] = records;
    saveData(tableName, data);

    return true;
  }

  // ========== MÉTODOS ESPECÍFICOS DO DOMÍNIO ==========

  /**
   * Autentica um usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Resultado da autenticação
   */
  async function authenticateUser(email, password) {
    try {
      const users = await findBy("users", "email", email.toLowerCase());
      const user = users[0];

      if (user && user.password === password && user.active) {
        // Atualizar último login
        await update("users", user.id, {
          last_login: new Date().toISOString(),
        });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            store_id: user.store_id,
          },
        };
      }

      return {
        success: false,
        message: "Credenciais inválidas",
      };
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return {
        success: false,
        message: "Erro interno do servidor",
      };
    }
  }

  /**
   * Obtém o ranking de um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object|null>} Dados do ranking do usuário
   */
  async function getUserRanking(userId) {
    try {
      const rankingData = await loadData("rankings");
      const userRanking = rankingData.rankings.user_rankings.find(
        (ranking) => ranking.user_id === userId
      );

      if (!userRanking) return null;

      const level = rankingData.rankings.levels.find(
        (level) => level.id === userRanking.level_id
      );

      return {
        ...userRanking,
        level: level,
      };
    } catch (error) {
      console.error("Erro ao obter ranking do usuário:", error);
      return null;
    }
  }

  /**
   * Obtém missões ativas para um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<Array>} Lista de missões ativas
   */
  async function getUserMissions(userId) {
    try {
      const missionData = await loadData("missions");
      const userMissions = missionData.user_missions.filter(
        (um) => um.user_id === userId
      );

      return userMissions.map((userMission) => {
        const mission = missionData.missions.find(
          (m) => m.id === userMission.mission_id
        );
        return {
          ...mission,
          user_progress: userMission,
        };
      });
    } catch (error) {
      console.error("Erro ao obter missões do usuário:", error);
      return [];
    }
  }

  /**
   * Registra uma nova venda
   * @param {Object} saleData - Dados da venda
   * @returns {Promise<Object>} Venda registrada
   */
  async function registerSale(saleData) {
    try {
      // Calcular pontos baseado no valor e cross-sell
      const basePoints = Math.floor(saleData.amount / 10); // 1 ponto a cada R$ 10
      const points = saleData.is_cross_sell ? basePoints * 2 : basePoints;

      const sale = await create("sales", {
        ...saleData,
        points_earned: points,
        created_at: new Date().toISOString(),
      });

      // Atualizar pontos do usuário no ranking
      await updateUserPoints(saleData.user_id, points);

      return sale;
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      throw error;
    }
  }

  /**
   * Atualiza pontos de um usuário no ranking
   * @param {number} userId - ID do usuário
   * @param {number} pointsToAdd - Pontos para adicionar
   * @returns {Promise<void>}
   */
  async function updateUserPoints(userId, pointsToAdd) {
    try {
      const rankingData = await loadData("rankings");
      const userRankingIndex = rankingData.rankings.user_rankings.findIndex(
        (ranking) => ranking.user_id === userId
      );

      if (userRankingIndex !== -1) {
        const userRanking =
          rankingData.rankings.user_rankings[userRankingIndex];
        const newPoints = userRanking.current_points + pointsToAdd;
        const newMonthlyPoints = userRanking.monthly_points + pointsToAdd;
        const newLifetimePoints =
          userRanking.total_lifetime_points + pointsToAdd;

        // Determinar novo nível baseado nos pontos
        const newLevel = rankingData.rankings.levels.find(
          (level) =>
            newPoints >= level.min_points &&
            (level.max_points === null || newPoints <= level.max_points)
        );

        rankingData.rankings.user_rankings[userRankingIndex] = {
          ...userRanking,
          current_points: newPoints,
          monthly_points: newMonthlyPoints,
          total_lifetime_points: newLifetimePoints,
          level_id: newLevel ? newLevel.id : userRanking.level_id,
          last_updated: new Date().toISOString(),
        };

        saveData("rankings", rankingData);
      }
    } catch (error) {
      console.error("Erro ao atualizar pontos do usuário:", error);
    }
  }

  /**
   * Limpa dados locais e volta aos originais do arquivo JSON
   * @param {string} tableName - Nome da tabela (opcional, se não fornecido limpa todas)
   */
  function resetToOriginalData(tableName = null) {
    try {
      if (tableName) {
        // Limpar dados específicos
        localStorage.removeItem(`swift_db_${tableName}`);
        dataCache.delete(tableName);
        console.log(`🔄 Dados resetados para ${tableName}`);
      } else {
        // Limpar todos os dados
        Object.keys(DATA_FILES).forEach((table) => {
          localStorage.removeItem(`swift_db_${table}`);
          dataCache.delete(table);
        });
        console.log("🔄 Todos os dados resetados para originais");
      }
    } catch (error) {
      console.error("Erro ao resetar dados:", error);
    }
  }

  /**
   * Verifica se há dados modificados localmente
   * @returns {Array} Lista de tabelas com dados modificados
   */
  function getModifiedTables() {
    const modified = [];
    Object.keys(DATA_FILES).forEach((table) => {
      if (localStorage.getItem(`swift_db_${table}`)) {
        modified.push(table);
      }
    });
    return modified;
  }

  // Exportar API pública
  window.SwiftDB = {
    // CRUD genérico
    findAll,
    findById,
    findBy,
    create,
    update,
    remove,

    // Métodos específicos
    authenticateUser,
    getUserRanking,
    getUserMissions,
    registerSale,
    updateUserPoints,

    // Utilitários
    loadData,
    clearCache: () => dataCache.clear(),
    resetToOriginalData,
    getModifiedTables,
  };

  console.log("Sistema de Banco de Dados Swift inicializado");
})();
