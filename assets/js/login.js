document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const rememberMeCheckbox = document.getElementById("rememberMe");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    const icon = this.querySelector("i");
    if (type === "text") {
      icon.setAttribute("data-lucide", "eye-off");
    } else {
      icon.setAttribute("data-lucide", "eye");
    }

    lucide.createIcons();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    clearErrors();

    let isValid = true;

    if (!email) {
      showError(emailInput, "E-mail é obrigatório");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Por favor, insira um e-mail válido");
      isValid = false;
    }

    if (!password) {
      showError(passwordInput, "Senha é obrigatória");
      isValid = false;
    } else if (password.length < 6) {
      showError(passwordInput, "Senha deve ter pelo menos 6 caracteres");
      isValid = false;
    }

    if (isValid) {
      showLoadingState();

      setTimeout(() => {
        hideLoadingState();

        // Verificar credenciais mockadas
        const loginResult = authenticateUser(email, password);

        if (loginResult.success) {
          // Salvar dados da sessão usando a nova função
          if (window.SwiftAuth && window.SwiftAuth.saveUserSession) {
            window.SwiftAuth.saveUserSession(
              loginResult.user,
              rememberMeCheckbox.checked
            );
          } else {
            // Fallback para compatibilidade
            if (rememberMeCheckbox.checked) {
              localStorage.setItem(
                "swift_user",
                JSON.stringify(loginResult.user)
              );
              localStorage.setItem("swift_remember", "true");
            } else {
              sessionStorage.setItem(
                "swift_user",
                JSON.stringify(loginResult.user)
              );
            }
          }

          showSuccessMessage(`Bem-vindo(a), ${loginResult.user.name}!`);

          console.log("Login successful:", {
            email: loginResult.user.email,
            role: loginResult.user.role,
            rememberMe: rememberMeCheckbox.checked,
          });

          // Redirecionar após login bem-sucedido
          setTimeout(() => {
            redirectUserByRole(loginResult.user.role);
          }, 1500);
        } else {
          showError(emailInput, "E-mail ou senha incorretos");
          showError(passwordInput, "Verifique suas credenciais");
        }
      }, 1500);
    }
  });

  emailInput.addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
      showError(this, "Por favor, insira um e-mail válido");
    } else {
      clearFieldError(this);
    }
  });

  passwordInput.addEventListener("input", function () {
    clearFieldError(this);
  });

  document.querySelectorAll(".btn-outline-secondary").forEach((button) => {
    button.addEventListener("click", function () {
      const provider = this.textContent.trim();
      alert(`Login com ${provider} em desenvolvimento`);
    });
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, message) {
    clearFieldError(input);

    input.classList.add("is-invalid");

    const fieldContainer = input.closest(".mb-3");
    const errorContainer = fieldContainer.querySelector(
      ".error-message-container"
    );

    if (errorContainer) {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("invalid-feedback");
      errorDiv.textContent = message;

      errorContainer.appendChild(errorDiv);

      requestAnimationFrame(() => {
        errorDiv.classList.add("show");
      });
    }
  }

  function clearFieldError(input) {
    input.classList.remove("is-invalid");
    const fieldContainer = input.closest(".mb-3");
    const errorContainer = fieldContainer.querySelector(
      ".error-message-container"
    );

    if (errorContainer) {
      const errorMsg = errorContainer.querySelector(".invalid-feedback");
      if (errorMsg) {
        errorMsg.classList.remove("show");
        setTimeout(() => {
          if (errorMsg.parentNode) {
            errorMsg.remove();
          }
        }, 300);
      }
    }
  }

  function clearErrors() {
    document.querySelectorAll(".is-invalid").forEach((input) => {
      input.classList.remove("is-invalid");
    });
    document
      .querySelectorAll(".error-message-container .invalid-feedback")
      .forEach((error) => {
        error.classList.remove("show");
        setTimeout(() => {
          if (error.parentNode) {
            error.remove();
          }
        }, 300);
      });
  }

  function showLoadingState() {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Entrando...';
    submitBtn.setAttribute("data-original-text", originalText);
  }

  function hideLoadingState() {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.getAttribute("data-original-text");

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    submitBtn.removeAttribute("data-original-text");
  }

  function showSuccessMessage(message) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add(
      "alert",
      "alert-success",
      "alert-dismissible",
      "fade",
      "show",
      "mt-3"
    );
    alertDiv.innerHTML = `
            <strong>Sucesso!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    loginForm.insertBefore(alertDiv, loginForm.firstChild);
  }

  function hideSuccessMessage() {
    const alert = loginForm.querySelector(".alert-success");
    if (alert) {
      alert.remove();
    }
  }

  const formElements = document.querySelectorAll(".form-control, .btn");
  formElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.transform = "translateY(-1px)";
    });

    element.addEventListener("blur", function () {
      this.style.transform = "translateY(0)";
    });
  });

  document.querySelectorAll(".icon-circle").forEach((circle) => {
    circle.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.05)";
    });

    circle.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  console.log("Swift Pro Login Page initialized successfully");
});

// ============================================
// SISTEMA DE AUTENTICAÇÃO MOCKADO
// ============================================

// Credenciais mockadas para o sistema acadêmico
const MOCK_USERS = {
  "gerente@swift.com": {
    email: "gerente@swift.com",
    password: "123456",
    name: "Évelyn Rodrigues",
    role: "gerente",
    id: 1,
  },
  "vendedor@swift.com": {
    email: "vendedor@swift.com",
    password: "123456",
    name: "Lucas Fernando",
    role: "vendedor",
    id: 2,
  },
  "estoquista@swift.com": {
    email: "estoquista@swift.com",
    password: "123456",
    name: "Ana Silva",
    role: "estoquista",
    id: 3,
  },
};

/**
 * Autentica o usuário com as credenciais mockadas
 * @param {string} email
 * @param {string} password
 * @returns {object} Resultado da autenticação
 */
function authenticateUser(email, password) {
  const user = MOCK_USERS[email.toLowerCase()];

  if (user && user.password === password) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  return {
    success: false,
    message: "Credenciais inválidas",
  };
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

// Exportar funções para uso global
window.SwiftAuth = {
  getCurrentUser,
  isUserLoggedIn,
  hasRole,
  logoutUser,
  protectPage,
  redirectUserByRole,
};
