/**
 * GESTOR DE ESTADO REACTIVO (STATE)
 * Centraliza la información del usuario, semillas, avatar y territorio
 */

const AppState = (() => {
  // Cargar estado previo de localStorage si existe
  const savedUser = (() => {
    try {
      const u = localStorage.getItem("magda_user");
      return u ? JSON.parse(u) : null;
    } catch (e) { return null; }
  })();

  const savedGamificacion = (() => {
    try {
      const g = localStorage.getItem("magda_gamificacion");
      return g ? JSON.parse(g) : null;
    } catch (e) { return null; }
  })();

  // Estado inicial
  const state = {
    usuario: savedUser || {
      id: "user-estudiante",
      nombre: "Estudiante UNAD",
      handle: "@estudiante_unad",
      email: "estudiante@unad.edu.co",
      rol: "Guardián Territorial",
      avatar: "assets/avatars/nutria.webp",
      municipio: "La Dorada, Caldas",
      municipioId: "dorada",
      estaAutenticado: true
    },
    avatarActivo: {
      id: "nutria",
      nombreBautizado: "Ima",
      rol: "La Madre Tierra (Nutria de Río)",
      img: "assets/avatars/nutria.webp",
      fallback: "assets/avatars/nutria.png",
      dialogoActual: "¡Hola! Soy Ima, represento a La Madre Tierra. Cuidemos el agua del Río Magdalena frente a El Niño."
    },
    gamificacion: savedGamificacion || {
      semillas: 340,
      arbolesSembrados: 4,
      donacionesAgua: 12,
      partidasJuego: 0
    },
    pantallaActual: "inicio", // 'onboarding', 'inicio', 'reels', 'mapa', 'retos', 'perfil'
    seguidos: new Set(["perfil-comite-unad", "perfil-defensa-civil", "perfil-corpocaldas"]),
    listeners: []
  };

  function persistGamificacion() {
    try {
      localStorage.setItem("magda_gamificacion", JSON.stringify(state.gamificacion));
    } catch (e) {}
  }

  function persistUser() {
    try {
      localStorage.setItem("magda_user", JSON.stringify(state.usuario));
    } catch (e) {}
  }

  // Suscribirse a cambios de estado
  function subscribe(fn) {
    state.listeners.push(fn);
  }

  // Notificar a todos los observadores
  function notify(changeType, payload) {
    state.listeners.forEach(fn => {
      try {
        fn(changeType, payload, state);
      } catch (err) {
        console.error("Error en listener de AppState:", err);
      }
    });
  }

  // Métodos de mutación controlada
  return {
    getState: () => state,
    subscribe,

    // Sumar semillas con animación
    addSemillas: (cantidad, motivo = "Acción Comunitaria") => {
      state.gamificacion.semillas += cantidad;
      // Cada 100 semillas colectivas = 1 árbol nuevo
      state.gamificacion.arbolesSembrados = Math.floor(state.gamificacion.semillas / 100) + 1;
      persistGamificacion();
      notify("SEMILLAS_UPDATED", { cantidad, motivo, total: state.gamificacion.semillas });
    },

    // Deducir semillas para donaciones comunitarias
    deductSemillas: (cantidad, motivo = "Donación Ambiental") => {
      if (state.gamificacion.semillas >= cantidad) {
        state.gamificacion.semillas -= cantidad;
        persistGamificacion();
        notify("SEMILLAS_UPDATED", { cantidad: -cantidad, motivo, total: state.gamificacion.semillas });
        return true;
      }
      return false;
    },

    // Registrar siembra directa de árboles reales
    addArboles: (cantidad = 1, motivo = "Siembra Comunitaria") => {
      state.gamificacion.arbolesSembrados += cantidad;
      state.gamificacion.semillas += (cantidad * 25);
      persistGamificacion();
      notify("ARBOLES_UPDATED", { cantidad, motivo, totalArboles: state.gamificacion.arbolesSembrados, totalSemillas: state.gamificacion.semillas });
      notify("SEMILLAS_UPDATED", { cantidad: cantidad * 25, motivo, total: state.gamificacion.semillas });
    },

    // Iniciar Sesión con cuenta
    loginUser: (userObj) => {
      state.usuario = {
        ...state.usuario,
        ...userObj,
        estaAutenticado: true
      };
      if (userObj.semillas) state.gamificacion.semillas = userObj.semillas;
      if (userObj.arboles) state.gamificacion.arbolesSembrados = userObj.arboles;
      persistUser();
      persistGamificacion();
      notify("AUTH_CHANGED", state.usuario);
      notify("USER_UPDATED", state.usuario);
      notify("SEMILLAS_UPDATED", { cantidad: 0, motivo: "Inicio de sesión", total: state.gamificacion.semillas });
    },

    // Cerrar sesión
    logoutUser: () => {
      state.usuario = {
        id: "invitado",
        nombre: "Ciudadano Invitado",
        handle: "@invitado_dorada",
        email: "",
        rol: "Visitante Territorial",
        avatar: "assets/avatars/nutria.webp",
        municipio: "La Dorada, Caldas",
        municipioId: "dorada",
        estaAutenticado: false
      };
      persistUser();
      notify("AUTH_CHANGED", state.usuario);
      notify("USER_UPDATED", state.usuario);
    },

    // Seguir o Dejar de Seguir a un autor/cuenta
    toggleSeguirPerfil: (perfilId) => {
      const perfil = (window.APP_DATA && window.APP_DATA.perfiles) 
        ? window.APP_DATA.perfiles.find(p => p.id === perfilId || p.handle === perfilId)
        : null;

      const isFollowing = state.seguidos.has(perfilId);
      if (isFollowing) {
        state.seguidos.delete(perfilId);
        if (perfil) {
          perfil.seguido = false;
          perfil.seguidores = Math.max(0, (perfil.seguidores || 1) - 1);
        }
      } else {
        state.seguidos.add(perfilId);
        if (perfil) {
          perfil.seguido = true;
          perfil.seguidores = (perfil.seguidores || 0) + 1;
        }
      }

      notify("FOLLOW_CHANGED", { perfilId, siguiendo: !isFollowing, perfil });
      return !isFollowing;
    },

    estaSiguiendo: (perfilId) => {
      return state.seguidos.has(perfilId);
    },

    // Cambiar avatar / mascota activa
    setAvatar: (avatarObj, nombreBautizado = null) => {
      state.avatarActivo = {
        id: avatarObj.id,
        nombreBautizado: nombreBautizado || avatarObj.nombre,
        rol: avatarObj.rol,
        img: avatarObj.img,
        fallback: avatarObj.fallback,
        dialogoActual: avatarObj.dialogoBienvenida
      };
      notify("AVATAR_CHANGED", state.avatarActivo);
    },

    // Actualizar diálogo del avatar
    setAvatarSpeech: (mensaje) => {
      state.avatarActivo.dialogoActual = mensaje;
      notify("SPEECH_CHANGED", mensaje);
    },

    // Cambiar territorio seleccionado
    setTerritorio: (territorioObj) => {
      state.usuario.municipio = `${territorioObj.nombre}, Caldas`;
      state.usuario.municipioId = territorioObj.id;
      persistUser();
      notify("TERRITORIO_CHANGED", territorioObj);
    },

    // Cambiar pantalla
    setPantalla: (nombrePantalla) => {
      state.pantallaActual = nombrePantalla;
      notify("SCREEN_CHANGED", nombrePantalla);
    }
  };
})();

window.AppState = AppState;

