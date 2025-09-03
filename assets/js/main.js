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

        showSuccessMessage("Login realizado com sucesso!");

        console.log("Login attempt:", {
          email: email,
          password: "[HIDDEN]",
          rememberMe: rememberMeCheckbox.checked,
        });

        setTimeout(() => {
          loginForm.reset();
          hideSuccessMessage();
        }, 2000);
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
