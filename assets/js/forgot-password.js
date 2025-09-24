document.addEventListener("DOMContentLoaded", function () {
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const emailInput = document.getElementById("email");

  forgotPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    clearErrors();

    let isValid = true;

    if (!email) {
      showError(emailInput, "E-mail é obrigatório");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Por favor, insira um e-mail válido");
      isValid = false;
    } else if (!isSwiftEmail(email)) {
      showError(
        emailInput,
        "Por favor, utilize um e-mail corporativo Swift (@swift.com)"
      );
      isValid = false;
    }

    if (isValid) {
      showLoadingState();

      // Simular envio de e-mail de recuperação
      setTimeout(async () => {
        hideLoadingState();

        // Verificar se o e-mail existe no sistema usando o banco de dados
        const emailExists = await checkEmailExists(email);

        if (emailExists) {
          showSuccessMessage(
            `Um e-mail com instruções para redefinir sua senha foi enviado para ${email}`
          );

          // Limpar o formulário após sucesso
          emailInput.value = "";

          console.log("Password reset email sent to:", email);

          // Redirecionar para login após alguns segundos
          setTimeout(() => {
            window.location.href = "login.html";
          }, 4000);
        } else {
          showError(
            emailInput,
            "E-mail não encontrado em nosso sistema. Verifique o endereço digitado."
          );
        }
      }, 2000);
    }
  });

  emailInput.addEventListener("blur", function () {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
      showError(this, "Por favor, insira um e-mail válido");
    } else if (email && !isSwiftEmail(email)) {
      showError(
        this,
        "Por favor, utilize um e-mail corporativo Swift (@swift.com)"
      );
    } else {
      clearFieldError(this);
    }
  });

  emailInput.addEventListener("input", function () {
    clearFieldError(this);
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isSwiftEmail(email) {
    return email.toLowerCase().endsWith("@swift.com");
  }

  async function checkEmailExists(email) {
    try {
      // Verificar se o e-mail existe usando o sistema de banco de dados
      const users = await window.SwiftDB.findBy(
        "users",
        "email",
        email.toLowerCase()
      );
      return users.length > 0 && users[0].active;
    } catch (error) {
      console.error("Erro ao verificar e-mail:", error);
      return false;
    }
  }

  function showError(input, message) {
    clearFieldError(input);

    input.classList.add("is-invalid");

    const fieldContainer = input.closest(".mb-3, .mb-4");
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
    const fieldContainer = input.closest(".mb-3, .mb-4");
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
    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';
    submitBtn.setAttribute("data-original-text", originalText);
  }

  function hideLoadingState() {
    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
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
            <strong>E-mail enviado!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    forgotPasswordForm.insertBefore(alertDiv, forgotPasswordForm.firstChild);

    // Auto-remover após 4 segundos
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 4000);
  }

  // Efeitos visuais similares ao login
  const formElements = document.querySelectorAll(".form-control, .btn");
  formElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.transform = "translateY(-1px)";
    });

    element.addEventListener("blur", function () {
      this.style.transform = "translateY(0)";
    });
  });

  console.log("Swift Pro Forgot Password Page initialized successfully");
});
