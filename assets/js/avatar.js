/**
 * Sistema de Gerenciamento de Avatar
 * Carrega e atualiza avatars do usuário em todas as páginas
 */

(function () {
  "use strict";

  // Aguardar que o DOM esteja pronto
  document.addEventListener("DOMContentLoaded", function () {
    initializeAvatarSystem();
  });

  function initializeAvatarSystem() {
    try {
      const currentUser = getCurrentUser();

      if (currentUser) {
        loadUserAvatars(currentUser);
        console.log("Sistema de avatar inicializado para:", currentUser.email);
      }
    } catch (error) {
      console.error("Erro ao inicializar sistema de avatar:", error);
    }
  }

  function getCurrentUser() {
    // Tentar usar a função do sistema de autenticação
    if (window.SwiftAuth && window.SwiftAuth.getCurrentUser) {
      return window.SwiftAuth.getCurrentUser();
    }

    // Fallback para compatibilidade
    const userData =
      sessionStorage.getItem("swift_user") ||
      localStorage.getItem("swift_user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Erro ao processar dados do usuário:", error);
        return null;
      }
    }

    return null;
  }

  function loadUserAvatars(user) {
    const avatarKey = `swift_avatar_${user.id}`;
    const savedAvatar = localStorage.getItem(avatarKey);

    if (savedAvatar) {
      try {
        const imageData = JSON.parse(savedAvatar);

        // Atualizar todos os elementos de avatar na página
        updateAllAvatars(imageData.dataUrl);

        console.log("Avatar carregado:", {
          fileName: imageData.fileName,
          uploadDate: new Date(imageData.uploadDate).toLocaleDateString(
            "pt-BR"
          ),
          size: `${(imageData.fileSize / 1024).toFixed(1)} KB`,
        });
      } catch (error) {
        console.error("Erro ao carregar avatar salvo:", error);
      }
    } else {
      // Se não há avatar salvo, usar avatar padrão
      console.log("Nenhum avatar personalizado encontrado, usando padrão");
    }
  }

  function updateAllAvatars(imageDataUrl) {
    // Selecionar todos os elementos de avatar na página
    const avatarSelectors = [
      "[data-user-avatar]",
      ".user-avatar",
      "#profileImagePreview",
    ];

    avatarSelectors.forEach((selector) => {
      const avatarElements = document.querySelectorAll(selector);
      avatarElements.forEach((avatar) => {
        if (avatar.tagName === "IMG") {
          avatar.src = imageDataUrl;
        } else {
          // Para elementos que usam background-image
          avatar.style.backgroundImage = `url(${imageDataUrl})`;
        }
      });
    });
  }

  // Função para salvar avatar (pode ser chamada de outras páginas)
  function saveUserAvatar(user, file, callback) {
    if (!file || !user) {
      console.error("Usuário ou arquivo não fornecido");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const imageDataUrl = e.target.result;
        const fileName = `avatar_${user.id}_${Date.now()}.${file.name
          .split(".")
          .pop()}`;

        const imageData = {
          dataUrl: imageDataUrl,
          fileName: fileName,
          uploadDate: new Date().toISOString(),
          fileSize: file.size,
          fileType: file.type,
        };

        // Salvar no localStorage
        const avatarKey = `swift_avatar_${user.id}`;
        localStorage.setItem(avatarKey, JSON.stringify(imageData));

        // Atualizar todos os avatars
        updateAllAvatars(imageDataUrl);

        console.log("Avatar salvo com sucesso:", {
          fileName: fileName,
          user: user.email,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        });

        // Chamar callback se fornecido
        if (callback && typeof callback === "function") {
          callback(null, imageData);
        }
      } catch (error) {
        console.error("Erro ao salvar avatar:", error);
        if (callback && typeof callback === "function") {
          callback(error, null);
        }
      }
    };

    reader.onerror = function () {
      const error = new Error("Erro ao processar arquivo de imagem");
      console.error(error);
      if (callback && typeof callback === "function") {
        callback(error, null);
      }
    };

    reader.readAsDataURL(file);
  }

  // Função para remover avatar personalizado
  function removeUserAvatar(user) {
    if (!user) return;

    const avatarKey = `swift_avatar_${user.id}`;
    localStorage.removeItem(avatarKey);

    // Resetar para avatar padrão
    const defaultAvatar =
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format";
    updateAllAvatars(defaultAvatar);

    console.log("Avatar personalizado removido para:", user.email);
  }

  // Função para obter URL do avatar atual
  function getUserAvatarUrl(user) {
    if (!user) return null;

    const avatarKey = `swift_avatar_${user.id}`;
    const savedAvatar = localStorage.getItem(avatarKey);

    if (savedAvatar) {
      try {
        const imageData = JSON.parse(savedAvatar);
        return imageData.dataUrl;
      } catch (error) {
        console.error("Erro ao obter URL do avatar:", error);
        return null;
      }
    }

    return null;
  }

  // Exportar funções para uso global
  window.SwiftAvatar = {
    saveUserAvatar: saveUserAvatar,
    removeUserAvatar: removeUserAvatar,
    getUserAvatarUrl: getUserAvatarUrl,
    updateAllAvatars: updateAllAvatars,
    loadUserAvatars: loadUserAvatars,
  };
})();
