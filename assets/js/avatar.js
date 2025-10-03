(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initializeAvatarSystem();
  });

  function initializeAvatarSystem() {
    try {
      const currentUser = getCurrentUser();

      if (currentUser) {
        loadUserAvatars(currentUser);
      }
    } catch (error) {}
  }

  function getCurrentUser() {
    if (window.SwiftAuth && window.SwiftAuth.getCurrentUser) {
      return window.SwiftAuth.getCurrentUser();
    }

    const userData =
      sessionStorage.getItem("swift_user") ||
      localStorage.getItem("swift_user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
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
        updateAllAvatars(imageData.dataUrl);
      } catch (error) {}
    }
  }

  function updateAllAvatars(imageDataUrl) {
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
          avatar.style.backgroundImage = `url(${imageDataUrl})`;
        }
      });
    });
  }

  function saveUserAvatar(user, file, callback) {
    if (!file || !user) {
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

        const avatarKey = `swift_avatar_${user.id}`;
        localStorage.setItem(avatarKey, JSON.stringify(imageData));

        updateAllAvatars(imageDataUrl);

        if (callback && typeof callback === "function") {
          callback(null, imageData);
        }
      } catch (error) {
        if (callback && typeof callback === "function") {
          callback(error, null);
        }
      }
    };

    reader.onerror = function () {
      const error = new Error("Erro ao processar arquivo de imagem");
      if (callback && typeof callback === "function") {
        callback(error, null);
      }
    };

    reader.readAsDataURL(file);
  }

  function removeUserAvatar(user) {
    if (!user) return;

    const avatarKey = `swift_avatar_${user.id}`;
    localStorage.removeItem(avatarKey);

    const defaultAvatar =
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format";
    updateAllAvatars(defaultAvatar);
  }

  function getUserAvatarUrl(user) {
    if (!user) return null;

    const avatarKey = `swift_avatar_${user.id}`;
    const savedAvatar = localStorage.getItem(avatarKey);

    if (savedAvatar) {
      try {
        const imageData = JSON.parse(savedAvatar);
        return imageData.dataUrl;
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  window.SwiftAvatar = {
    saveUserAvatar: saveUserAvatar,
    removeUserAvatar: removeUserAvatar,
    getUserAvatarUrl: getUserAvatarUrl,
    updateAllAvatars: updateAllAvatars,
    loadUserAvatars: loadUserAvatars,
  };
})();
