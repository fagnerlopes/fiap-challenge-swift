// ============================================
// SISTEMA DE AUTENTICAÇÃO E CONTROLE DE ACESSO
// ============================================

/**
 * Obtém o usuário atual da sessão
 * @returns {object|null} Dados do usuário ou null se não logado
 */
function getCurrentUser() {
  // Verificar sessionStorage primeiro
  let userData = sessionStorage.getItem("swift_user");

  // Se não encontrar, verificar localStorage (remember me)
  if (!userData) {
    userData = localStorage.getItem("swift_user");
  }

  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error("Erro ao processar dados do usuário:", e);
      return null;
    }
  }

  return null;
}

/**
 * Verifica se o usuário está logado
 * @returns {boolean}
 */
function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Verifica se o usuário tem uma role específica
 * @param {string} requiredRole
 * @returns {boolean}
 */
function hasRole(requiredRole) {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
}

/**
 * Faz logout do usuário
 */
function logoutUser() {
  sessionStorage.removeItem("swift_user");
  localStorage.removeItem("swift_user");
  localStorage.removeItem("swift_remember");
  window.location.href = "login.html";
}

/**
 * Redireciona o usuário baseado na sua role
 * @param {string} role
 */
function redirectUserByRole(role) {
  switch (role) {
    case "gerente":
      window.location.href = "gerente.html";
      break;
    case "vendedor":
      window.location.href = "index.html"; // Dashboard principal
      break;
    default:
      window.location.href = "index.html";
  }
}

/**
 * Protege uma página verificando se o usuário tem a role necessária
 * @param {string} requiredRole - Role necessária para acessar a página
 * @param {string} redirectUrl - URL para redirecionar se não autorizado
 */
function protectPage(requiredRole = null, redirectUrl = "login.html") {
  const user = getCurrentUser();

  // Se não estiver logado, redirecionar para login
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }

  // Se uma role específica for necessária, verificar
  if (requiredRole && user.role !== requiredRole) {
    alert("Acesso negado. Você não tem permissão para acessar esta página.");
    // Redirecionar para página apropriada baseada na role do usuário
    redirectUserByRole(user.role);
    return false;
  }

  return true;
}

/**
 * Atualiza a interface com informações do usuário logado
 */
function updateUserInterface() {
  const user = getCurrentUser();
  if (!user) return;

  // Atualizar nome do usuário na interface (se existir elemento)
  const userNameElements = document.querySelectorAll("[data-user-name]");
  userNameElements.forEach((element) => {
    element.textContent = user.name;
  });

  // Atualizar email do usuário na interface (se existir elemento)
  const userEmailElements = document.querySelectorAll("[data-user-email]");
  userEmailElements.forEach((element) => {
    element.textContent = user.email;
  });

  // Atualizar role do usuário na interface (se existir elemento)
  const userRoleElements = document.querySelectorAll("[data-user-role]");
  userRoleElements.forEach((element) => {
    element.textContent = user.role === "gerente" ? "Gerente" : "Vendedor";
  });

  // Mostrar/ocultar elementos baseado na role
  const managerOnlyElements = document.querySelectorAll("[data-manager-only]");
  managerOnlyElements.forEach((element) => {
    element.style.display = user.role === "gerente" ? "block" : "none";
  });

  const sellerOnlyElements = document.querySelectorAll("[data-seller-only]");
  sellerOnlyElements.forEach((element) => {
    element.style.display = user.role === "vendedor" ? "block" : "none";
  });
}

/**
 * Adiciona event listeners para botões de logout
 */
function setupLogoutButtons() {
  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Tem certeza que deseja sair?")) {
        logoutUser();
      }
    });
  });
}

/**
 * Inicializa o sistema de autenticação na página
 */
function initAuth() {
  // Atualizar interface com dados do usuário
  updateUserInterface();

  // Configurar botões de logout
  setupLogoutButtons();

  console.log("Sistema de autenticação inicializado");
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  initAuth();
});

// Exportar funções para uso global
window.SwiftAuth = {
  getCurrentUser,
  isUserLoggedIn,
  hasRole,
  logoutUser,
  protectPage,
  redirectUserByRole,
  updateUserInterface,
  initAuth,
};

// Verificar se a página atual precisa de proteção
// Esta função deve ser chamada em cada página que precisa de autenticação
window.checkPageAccess = function (requiredRole = null) {
  // Aguardar o DOM carregar antes de verificar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      protectPage(requiredRole);
    });
  } else {
    protectPage(requiredRole);
  }
};
