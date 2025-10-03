document.addEventListener("DOMContentLoaded", function () {
  const user = getCurrentUser && getCurrentUser();
  if (user && user.role === "estoquista") {
    const navIndex = document.getElementById("navIndexColaborador");
    if (navIndex) navIndex.style.display = "none";
    const logo = document.getElementById("swiftproLogo");
    if (logo) logo.setAttribute("href", "estoquista.html");
  }
});

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

function getCurrentUser() {
  let userData = sessionStorage.getItem("swift_user");
  let isFromLocalStorage = false;

  if (!userData) {
    userData = localStorage.getItem("swift_user");
    isFromLocalStorage = true;
  }

  if (userData) {
    try {
      const user = JSON.parse(userData);

      if (user && user.id && user.email && user.name && user.role) {
        if (isFromLocalStorage) {
          sessionStorage.setItem("swift_user", userData);
        }
        return user;
      } else {
        clearCorruptedUserData();
        return null;
      }
    } catch (e) {
      clearCorruptedUserData();
      return null;
    }
  }

  return null;
}

function clearCorruptedUserData() {
  sessionStorage.removeItem("swift_user");
  localStorage.removeItem("swift_user");
  localStorage.removeItem("swift_remember");
}

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

function saveUserSession(user, rememberMe = false) {
  const userData = JSON.stringify(user);

  if (rememberMe) {
    localStorage.setItem("swift_user", userData);
    localStorage.setItem("swift_remember", "true");
    sessionStorage.setItem("swift_user", userData);
  } else {
    sessionStorage.setItem("swift_user", userData);
    localStorage.removeItem("swift_user");
    localStorage.removeItem("swift_remember");
  }
}

function isPersistentSession() {
  return localStorage.getItem("swift_remember") === "true";
}

function updateUserSession(updatedUser) {
  const isPersistent = isPersistentSession();
  saveUserSession(updatedUser, isPersistent);
}

function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

function hasRole(requiredRole) {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
}

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

function logoutUser() {
  sessionStorage.removeItem("swift_user");
  localStorage.removeItem("swift_user");
  localStorage.removeItem("swift_remember");
  window.location.href = "login.html";
}

function redirectUserByRole(role) {
  switch (role) {
    case "gerente":
      window.location.href = "gerente.html";
      break;
    case "vendedor":
      window.location.href = "index.html";
      break;
    case "estoquista":
      window.location.href = "estoquista.html";
      break;
    default:
      window.location.href = "index.html";
  }
}

function protectPage(requiredRole = null, redirectUrl = "login.html") {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }

  if (requiredRole && !hasAnyRole(requiredRole)) {
    alert("Acesso negado. Você não tem permissão para acessar esta página.");
    redirectUserByRole(user.role);
    return false;
  }

  return true;
}

function updateUserInterface() {
  const user = getCurrentUser();
  if (!user) return;

  const userNameElements = document.querySelectorAll("[data-user-name]");
  userNameElements.forEach((element) => {
    element.textContent = user.name;
  });

  const userEmailElements = document.querySelectorAll("[data-user-email]");
  userEmailElements.forEach((element) => {
    element.textContent = user.email;
  });

  const userRoleElements = document.querySelectorAll("[data-user-role]");
  userRoleElements.forEach((element) => {
    let roleText = "Vendedor";
    if (user.role === "gerente") roleText = "Gerente";
    else if (user.role === "estoquista") roleText = "Estoquista";
    element.textContent = roleText;
  });

  const userRoleDisplayElements = document.querySelectorAll(
    "[data-user-role-display]"
  );
  userRoleDisplayElements.forEach((element) => {
    let roleText = "Vendedor";
    if (user.role === "gerente") roleText = "Gerente";
    else if (user.role === "estoquista") roleText = "Estoquista";
    element.textContent = roleText;
  });

  const userAvatarElements = document.querySelectorAll("[data-user-avatar]");

  if (userAvatarElements.length > 0) {
    const avatarUrls = generateAvatarUrls(user.role, user.name);

    userAvatarElements.forEach((element) => {
      element.src = avatarUrls.primary;
      element.alt = `Avatar de ${user.name}`;

      element.onerror = function () {
        this.src = avatarUrls.fallback;
        this.onerror = null;
      };
    });
  }

  const managerOnlyElements = document.querySelectorAll("[data-manager-only]");
  managerOnlyElements.forEach((element) => {
    element.style.display = user.role === "gerente" ? "block" : "none";
  });

  const sellerOnlyElements = document.querySelectorAll("[data-seller-only]");
  sellerOnlyElements.forEach((element) => {
    element.style.display = user.role === "vendedor" ? "block" : "none";
  });
}

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

function initAuth() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return;
  }

  updateUserInterface();
  setupLogoutButtons();
  setupSessionMonitoring();
}

function setupSessionMonitoring() {
  setInterval(() => {
    const user = getCurrentUser();
    if (
      !user &&
      window.location.pathname !== "/login.html" &&
      !window.location.pathname.endsWith("login.html")
    ) {
      window.location.href = "login.html";
    }
  }, 30000);

  window.addEventListener("storage", (e) => {
    if (e.key === "swift_user" && e.newValue === null) {
      window.location.href = "login.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initAuth();
});

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

window.checkPageAccess = function (requiredRole = null) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      protectPage(requiredRole);
    });
  } else {
    protectPage(requiredRole);
  }
};
