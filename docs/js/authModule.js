/**
 * MÓDULO DE AUTENTICACIÓN Y GESTIÓN DE SESIONES (LOGIN)
 * Permite iniciar sesión, alternar cuentas comunitarias o continuar como invitado
 */

const AppAuth = (() => {
  const demoAccounts = [
    {
      id: "user-estudiante",
      nombre: "Estudiante UNAD",
      handle: "@estudiante_unad",
      email: "estudiante@unad.edu.co",
      rol: "Guardián Territorial",
      avatar: "assets/avatars/nutria.webp",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      semillas: 340,
      arboles: 4,
      descripcion: "Semillero de Emprendimiento Social UNAD 2026"
    },
    {
      id: "user-luzmarina",
      nombre: "Luz Marina Gómez",
      handle: "@luzmarina_bucamba",
      email: "luzmarina@bucamba.org",
      rol: "Presidenta JAC Bucamba",
      avatar: "assets/avatars/nutria.webp",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      semillas: 510,
      arboles: 6,
      descripcion: "Líder Vecinal del sector ribereño Bucamba"
    },
    {
      id: "user-bomberos",
      nombre: "Sgto. Jorge Morales",
      handle: "@bomberos_dorada_oficial",
      email: "bomberos@dorada.gov.co",
      rol: "Bomberos La Dorada · 119",
      avatar: "assets/img/logo_unad.png",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      semillas: 680,
      arboles: 8,
      descripcion: "Gestión de emergencias y conflagraciones forestales"
    },
    {
      id: "user-corpocaldas",
      nombre: "Ing. Rodrigo Silva",
      handle: "@corpocaldas_oficial",
      email: "gestion@corpocaldas.gov.co",
      rol: "Autoridad Ambiental",
      avatar: "assets/img/logo_cimas.jpg",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      semillas: 1200,
      arboles: 15,
      descripcion: "Vigilancia de determinantes ambientales y POMCA Guarinó"
    }
  ];

  function init() {
    setupAuthListeners();
    updateUIWithUser();
  }

  function setupAuthListeners() {
    AppState.subscribe((event) => {
      if (event === "AUTH_CHANGED" || event === "USER_UPDATED") {
        updateUIWithUser();
      }
    });
  }

  function openLoginModal() {
    const modal = document.getElementById("loginModalOverlay");
    if (modal) {
      modal.classList.add("open");
      renderDemoAccountsSelector();
    }
  }

  function closeLoginModal() {
    const modal = document.getElementById("loginModalOverlay");
    if (modal) {
      modal.classList.remove("open");
    }
  }

  function renderDemoAccountsSelector() {
    const container = document.getElementById("demoAccountsContainer");
    if (!container) return;

    const currentUser = AppState.getState().usuario;

    container.innerHTML = "";
    demoAccounts.forEach(acc => {
      const isCurrent = currentUser && currentUser.id === acc.id;
      const chip = document.createElement("div");
      chip.className = `demo-account-item ${isCurrent ? 'active' : ''}`;
      chip.onclick = () => loginQuickAccount(acc.id);
      chip.innerHTML = `
        <div class="demo-account-avatar">
          <img src="${acc.avatar}" alt="${acc.nombre}" onerror="this.src='assets/avatars/nutria.png'">
        </div>
        <div class="demo-account-info">
          <h4>${acc.nombre} ${isCurrent ? '<span>(Sesión Activa)</span>' : ''}</h4>
          <p>${acc.rol} • ${acc.handle}</p>
        </div>
        <div class="demo-account-badge">
          <span>🌱 ${acc.semillas}</span>
        </div>
      `;
      container.appendChild(chip);
    });
  }

  function loginQuickAccount(accId) {
    const acc = demoAccounts.find(a => a.id === accId);
    if (!acc) return;

    AppState.loginUser({
      id: acc.id,
      nombre: acc.nombre,
      handle: acc.handle,
      email: acc.email,
      rol: acc.rol,
      avatar: acc.avatar,
      municipio: acc.municipio,
      municipioId: acc.municipioId,
      semillas: acc.semillas,
      arboles: acc.arboles
    });

    closeLoginModal();
    AppVoice.showToast(`¡Bienvenido de nuevo, ${acc.nombre}! 👋`);
  }

  function submitLoginForm(e) {
    if (e && e.preventDefault) e.preventDefault();

    const emailInput = document.getElementById("loginEmailInput");
    const passInput = document.getElementById("loginPasswordInput");

    const email = emailInput ? emailInput.value.trim() : "";
    const pass = passInput ? passInput.value.trim() : "";

    if (!email) {
      AppVoice.showToast("Por favor ingresa tu correo o usuario");
      return;
    }

    // Buscar si coincide con alguna demo
    const match = demoAccounts.find(a => a.email.toLowerCase() === email.toLowerCase() || a.handle.toLowerCase() === email.toLowerCase());
    if (match) {
      loginQuickAccount(match.id);
      return;
    }

    // Crear o iniciar con cuenta personalizada
    const displayName = email.includes("@") ? email.split("@")[0] : email;
    const cleanHandle = "@" + displayName.toLowerCase().replace(/[^a-z0-9]/g, "");

    AppState.loginUser({
      id: "custom-" + Date.now(),
      nombre: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      handle: cleanHandle,
      email: email,
      rol: "Guardián de La Dorada",
      avatar: "assets/avatars/nutria.webp",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      semillas: 150,
      arboles: 2
    });

    closeLoginModal();
    AppVoice.showToast(`¡Sesión iniciada con éxito! 🌱`);
  }

  function submitRegisterForm(e) {
    if (e && e.preventDefault) e.preventDefault();

    const nameInput = document.getElementById("registerNameInput");
    const emailInput = document.getElementById("registerEmailInput");
    const roleSelect = document.getElementById("registerRoleSelect");

    const nombre = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const rol = roleSelect ? roleSelect.value : "Guardián Territorial";

    if (!nombre) {
      AppVoice.showToast("Escribe tu nombre para tu carnet de Guardián");
      return;
    }

    const cleanHandle = "@" + nombre.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14);

    AppState.loginUser({
      id: "new-" + Date.now(),
      nombre: nombre,
      handle: cleanHandle,
      email: email || `${cleanHandle.slice(1)}@territorio.org`,
      rol: rol,
      avatar: "assets/avatars/nutria.webp",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      semillas: 100, // Bono de bienvenida
      arboles: 1
    });

    closeLoginModal();
    if (window.confetti) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
    AppVoice.showToast(`¡Cuenta creada! Ganaste un bono de 100 semillas de bienvenida 🌱`);
  }

  function continueAsGuest() {
    AppState.logoutUser();
    closeLoginModal();
    AppVoice.showToast("Navegando como visitante comunitario 👀");
  }

  function logout() {
    AppState.logoutUser();
    AppVoice.showToast("Sesión cerrada. Puedes ingresar cuando desees.");
    openLoginModal();
  }

  function setAuthTab(tabName) {
    const isLogin = tabName === "login";
    const tabLoginBtn = document.getElementById("tabAuthLogin");
    const tabRegBtn = document.getElementById("tabAuthRegister");
    const formLogin = document.getElementById("authLoginFormContainer");
    const formReg = document.getElementById("authRegisterFormContainer");

    if (tabLoginBtn) tabLoginBtn.classList.toggle("active", isLogin);
    if (tabRegBtn) tabRegBtn.classList.toggle("active", !isLogin);
    if (formLogin) formLogin.style.display = isLogin ? "block" : "none";
    if (formReg) formReg.style.display = !isLogin ? "block" : "none";
  }

  function updateUIWithUser() {
    const user = AppState.getState().usuario;
    if (!user) return;

    // Actualizar cabecera (botón de perfil/login)
    const headerAvatar = document.getElementById("headerUserAvatar");
    const headerUserName = document.getElementById("headerUserNameBadge");
    if (headerAvatar) {
      headerAvatar.src = user.avatar || "assets/avatars/nutria.webp";
      headerAvatar.onerror = () => { headerAvatar.src = "assets/avatars/nutria.png"; };
    }
    if (headerUserName) {
      headerUserName.innerText = user.estaAutenticado ? user.nombre.split(" ")[0] : "Ingresar";
    }

    // Actualizar Pantalla de Perfil
    const profileAvatar = document.getElementById("profileAvatarImg");
    const profileName = document.querySelector(".profile-names-block h2");
    const profileRole = document.getElementById("profileUserRoleDisplay");
    const profileHandle = document.getElementById("profileUserHandleDisplay");
    const profileSeeds = document.getElementById("profileSeedsCount");
    const profileTrees = document.getElementById("profileTreesCount");
    const btnAuthAction = document.getElementById("btnProfileAuthAction");

    if (profileAvatar) {
      profileAvatar.src = user.avatar || "assets/avatars/nutria.webp";
      profileAvatar.onerror = () => { profileAvatar.src = "assets/avatars/nutria.png"; };
    }
    if (profileName) {
      profileName.innerText = user.nombre;
    }
    if (profileRole) {
      profileRole.innerText = user.rol;
    }
    if (profileHandle) {
      profileHandle.innerText = user.handle || "@guardiandorado";
    }
    if (profileSeeds) {
      profileSeeds.innerText = AppState.getState().gamificacion.semillas;
    }
    if (profileTrees) {
      profileTrees.innerText = AppState.getState().gamificacion.arbolesSembrados;
    }

    if (btnAuthAction) {
      if (user.estaAutenticado) {
        btnAuthAction.innerHTML = `<i data-lucide="log-out" style="width:14px; height:14px;"></i> Cambiar / Cerrar Sesión`;
        btnAuthAction.className = "btn-secondary";
        btnAuthAction.onclick = openLoginModal;
      } else {
        btnAuthAction.innerHTML = `<i data-lucide="log-in" style="width:14px; height:14px;"></i> Iniciar Sesión para Guardar Progreso`;
        btnAuthAction.className = "btn-primary";
        btnAuthAction.onclick = openLoginModal;
      }
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  return {
    init,
    openLoginModal,
    closeLoginModal,
    loginQuickAccount,
    submitLoginForm,
    submitRegisterForm,
    continueAsGuest,
    logout,
    setAuthTab,
    updateUIWithUser
  };
})();

window.AppAuth = AppAuth;

