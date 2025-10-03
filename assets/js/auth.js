// Esconde o link para index.html e altera o logo SwiftPro para estoquista
document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser && getCurrentUser();
  // Oculta link index para estoquista
  if (user && user.role === "estoquista") {
    const navIndex = document.getElementById("navIndexColaborador");
    if (navIndex) navIndex.style.display = "none";
    // Redireciona logo para estoquista
    const logo = document.getElementById("swiftproLogo");
    if (logo) logo.setAttribute("href", "estoquista.html");
  }
});
// Redireciona automaticamente gerente para gerente.html se acessar outra página logado,
// exceto se for a página de configuração (config.html) ou perfil de colaborador (?colaborador=)
if (
  typeof window !== "undefined" &&
  window.location &&
  !window.location.pathname.endsWith("gerente.html") &&
  !window.location.pathname.endsWith("config.html")
) {
  const params = new URLSearchParams(window.location.search);
  const isPerfilColaborador = !!params.get("colaborador");
  const user = getCurrentUser && getCurrentUser();
  if (user && user.role === "gerente" && !isPerfilColaborador) {
    window.location.href = "gerente.html";
  }
}

// Redireciona automaticamente estoquista para estoquista.html se acessar index.html
if (
  typeof window !== "undefined" &&
  window.location &&
  (window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/")
) {
  const user = getCurrentUser && getCurrentUser();
  if (user && user.role === "estoquista") {
    window.location.href = "estoquista.html";
  }
}
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
  let isFromLocalStorage = false;

  // Se não encontrar, verificar localStorage (remember me)
  if (!userData) {
    userData = localStorage.getItem("swift_user");
    isFromLocalStorage = true;
  }

  if (userData) {
    try {
      const user = JSON.parse(userData);

      // Validar estrutura dos dados do usuário
      if (user && user.id && user.email && user.name && user.role) {
        // Se veio do localStorage, também salvar no sessionStorage para acesso rápido
        if (isFromLocalStorage) {
          sessionStorage.setItem("swift_user", userData);
        }
        return user;
      } else {
        console.warn("Dados do usuário inválidos encontrados, limpando...");
        clearCorruptedUserData();
        return null;
      }
    } catch (e) {
      console.error("Erro ao processar dados do usuário:", e);
      clearCorruptedUserData();
      return null;
    }
  }

  return null;
}

/**
 * Limpa dados corrompidos do usuário
 */
function clearCorruptedUserData() {
  sessionStorage.removeItem("swift_user");
  localStorage.removeItem("swift_user");
  localStorage.removeItem("swift_remember");
}

/**
 * Gera URLs de avatar baseado na role do usuário
 * @param {string} role - Role do usuário (gerente, vendedor)
 * @param {string} name - Nome do usuário
 * @returns {object} Objeto com URL principal e fallback
 */
function generateAvatarUrls(role, name) {
  const size = 32;
  const swiftColor = "ff6b35";

  if (role === "gerente") {
    return {
      primary:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face&auto=format",
      fallback: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=${swiftColor}&color=fff&size=${size}`,
      description: "Avatar feminino profissional - Gerente",
    };
  } else if (role === "estoquista") {
    return {
      primary: "https://randomuser.me/api/portraits/women/32.jpg",
      fallback: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=${swiftColor}&color=fff&size=${size}`,
      description: "Avatar feminino profissional - Estoquista",
    };
  } else {
    return {
      primary:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format",
      fallback: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=${swiftColor}&color=fff&size=${size}`,
      description: "Avatar masculino profissional - Vendedor",
    };
  }
}

/**
 * Salva dados do usuário na sessão
 * @param {object} user - Dados do usuário
 * @param {boolean} rememberMe - Se deve salvar no localStorage
 */
function saveUserSession(user, rememberMe = false) {
  const userData = JSON.stringify(user);

  if (rememberMe) {
    localStorage.setItem("swift_user", userData);
    localStorage.setItem("swift_remember", "true");
    // Também salvar no sessionStorage para acesso rápido
    sessionStorage.setItem("swift_user", userData);
  } else {
    // Apenas sessionStorage para sessão temporária
    sessionStorage.setItem("swift_user", userData);
    // Limpar localStorage se existir
    localStorage.removeItem("swift_user");
    localStorage.removeItem("swift_remember");
  }

  console.log("Sessão do usuário salva:", {
    email: user.email,
    name: user.name,
    role: user.role,
    persistent: rememberMe,
  });
}

/**
 * Verifica se a sessão atual é persistente (localStorage)
 * @returns {boolean}
 */
function isPersistentSession() {
  return localStorage.getItem("swift_remember") === "true";
}

/**
 * Atualiza dados do usuário na sessão atual
 * @param {object} updatedUser - Dados atualizados do usuário
 */
function updateUserSession(updatedUser) {
  const isPersistent = isPersistentSession();
  saveUserSession(updatedUser, isPersistent);
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
 * Verifica se o usuário tem uma das roles especificadas
 * @param {string|string[]} requiredRoles - Role ou array de roles necessárias
 * @returns {boolean}
 */
function hasAnyRole(requiredRoles) {
  const user = getCurrentUser();
  if (!user) return false;

  if (typeof requiredRoles === "string") {
    return user.role === requiredRoles;
  }

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }

  return false;
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
    case "estoquista":
      window.location.href = "estoquista.html";
      break;
    default:
      window.location.href = "index.html";
  }
}

/**
 * Protege uma página verificando se o usuário tem a role necessária
 * @param {string|string[]} requiredRole - Role ou array de roles necessárias para acessar a página
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
  if (requiredRole && !hasAnyRole(requiredRole)) {
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
    let roleText = "Vendedor";
    if (user.role === "gerente") roleText = "Gerente";
    else if (user.role === "estoquista") roleText = "Estoquista";
    element.textContent = roleText;
  });

  // Atualizar role display (formato específico para cards principais)
  const userRoleDisplayElements = document.querySelectorAll(
    "[data-user-role-display]"
  );
  userRoleDisplayElements.forEach((element) => {
    let roleText = "Vendedor";
    if (user.role === "gerente") roleText = "Gerente";
    else if (user.role === "estoquista") roleText = "Estoquista";
    element.textContent = roleText;
  });

  // Atualizar avatar baseado na role
  const userAvatarElements = document.querySelectorAll("[data-user-avatar]");
  console.log(
    `Atualizando ${userAvatarElements.length} elementos de avatar para ${user.role}`
  );

  if (userAvatarElements.length > 0) {
    const avatarUrls = generateAvatarUrls(user.role, user.name);

    userAvatarElements.forEach((element, index) => {
      element.src = avatarUrls.primary;
      element.alt = `Avatar de ${user.name}`;

      console.log(`Avatar ${index + 1} configurado:`, {
        role: user.role,
        name: user.name,
        primaryUrl: avatarUrls.primary,
        fallbackUrl: avatarUrls.fallback,
        description: avatarUrls.description,
      });

      // Adicionar evento de erro para fallback
      element.onerror = function () {
        console.warn(
          `Erro ao carregar avatar primário para ${user.role}, usando fallback`
        );
        this.src = avatarUrls.fallback;
        this.onerror = null; // Prevenir loop infinito
      };

      // Adicionar evento de sucesso para confirmar carregamento
      element.onload = function () {
        console.log(
          `Avatar ${index + 1} carregado com sucesso para ${user.role}`
        );
      };
    });
  } else {
    console.warn("Nenhum elemento [data-user-avatar] encontrado na página");
  }

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
  console.log("Inicializando sistema de autenticação...");

  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.log("Usuário não logado");
    return;
  }

  console.log("Usuário logado:", {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    persistent: isPersistentSession(),
  });

  // Atualizar interface com dados do usuário
  updateUserInterface();

  // Configurar botões de logout
  setupLogoutButtons();

  // Configurar monitoramento da sessão
  setupSessionMonitoring();

  console.log("Sistema de autenticação inicializado");
}

/**
 * Configura monitoramento da sessão para detectar perda de dados
 */
function setupSessionMonitoring() {
  // Verificar sessão a cada 30 segundos
  setInterval(() => {
    const user = getCurrentUser();
    if (
      !user &&
      window.location.pathname !== "/login.html" &&
      !window.location.pathname.endsWith("login.html")
    ) {
      console.warn("Sessão perdida, redirecionando para login...");
      window.location.href = "login.html";
    }
  }, 30000);

  // Escutar eventos de storage para detectar logout em outras abas
  window.addEventListener("storage", (e) => {
    if (e.key === "swift_user" && e.newValue === null) {
      console.log("Logout detectado em outra aba");
      window.location.href = "login.html";
    }
  });
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
  hasAnyRole,
  logoutUser,
  protectPage,
  redirectUserByRole,
  updateUserInterface,
  initAuth,
  saveUserSession,
  isPersistentSession,
  updateUserSession,
  clearCorruptedUserData,
  generateAvatarUrls,
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
