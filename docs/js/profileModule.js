/**
 * MÓDULO DE PERFILES DE AUTORES Y CUENTAS TERRITORIALES
 * Muestra el perfil completo de los creadores de reels, autores de noticias y líderes comunitarios
 */

const AppProfiles = (() => {
  let currentAuthorInModal = null;
  let activeTab = "posts"; // 'posts' o 'reels'

  function init() {
    setupEventListeners();
  }

  function setupEventListeners() {
    // Escuchar cambios de estado por si se actualiza el seguimiento
    AppState.subscribe((event, data) => {
      if (event === "FOLLOW_CHANGED" && currentAuthorInModal && currentAuthorInModal.id === data.perfilId) {
        updateFollowButtonState();
      }
    });
  }

  /**
   * Buscar perfil por ID, handle o nombre de autor
   */
  function findProfile(query) {
    if (!query) return null;
    const list = (window.APP_DATA && window.APP_DATA.perfiles) ? window.APP_DATA.perfiles : [];
    
    // 1. Por ID directo
    let p = list.find(item => item.id === query);
    if (p) return p;

    // 2. Por handle
    p = list.find(item => item.handle.toLowerCase() === query.toLowerCase());
    if (p) return p;

    // 3. Por nombre exacto o parcial
    p = list.find(item => item.nombre.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(item.nombre.toLowerCase()));
    if (p) return p;

    // Fallback dinámico si es un autor que no estaba en el directorio
    return {
      id: "perfil-dinamico-" + Math.abs(query.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
      handle: "@" + query.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 15),
      nombre: query,
      rol: "Ciudadano Guardián",
      entidad: "Comunidad del Magdalena Caldense",
      municipio: "La Dorada, Caldas",
      avatar: "assets/avatars/nutria.webp",
      portada: "#356B3E",
      bio: "Miembro activo de la red comunitaria IMA en La Dorada frente al fenómeno de El Niño.",
      verificado: false,
      seguidores: 42,
      seguido: false,
      semillasAportadas: 110,
      arbolesRespaldados: 2,
      alertasReportadas: 3,
      publicacionesIds: [],
      reelsIds: []
    };
  }

  /**
   * Abre el modal de perfil para un autor
   */
  function openAuthorProfile(authorQuery) {
    const profile = findProfile(authorQuery);
    if (!profile) return;

    currentAuthorInModal = profile;
    activeTab = "posts";

    const modal = document.getElementById("authorProfileModalOverlay");
    if (!modal) return;

    // Rellenar cabecera y datos
    const headerBanner = document.getElementById("authorModalBanner");
    const avatarImg = document.getElementById("authorModalAvatar");
    const nameEl = document.getElementById("authorModalName");
    const handleEl = document.getElementById("authorModalHandle");
    const roleEl = document.getElementById("authorModalRole");
    const locationEl = document.getElementById("authorModalLocation");
    const bioEl = document.getElementById("authorModalBio");
    const verifiedBadge = document.getElementById("authorModalVerified");

    if (headerBanner) headerBanner.style.background = profile.portada || "var(--verde-selva)";
    if (avatarImg) {
      avatarImg.src = profile.avatar;
      avatarImg.onerror = () => { avatarImg.src = "assets/avatars/nutria.png"; };
    }
    if (nameEl) nameEl.innerText = profile.nombre;
    if (handleEl) handleEl.innerText = profile.handle;
    if (roleEl) roleEl.innerText = `${profile.rol} • ${profile.entidad || 'Magdalena Caldense'}`;
    if (locationEl) locationEl.innerText = profile.municipio;
    if (bioEl) bioEl.innerText = profile.bio;
    if (verifiedBadge) verifiedBadge.style.display = profile.verificado ? "inline-flex" : "none";

    // Contadores métricos
    const followersEl = document.getElementById("authorModalFollowers");
    const seedsEl = document.getElementById("authorModalSeeds");
    const treesEl = document.getElementById("authorModalTrees");
    const alertsEl = document.getElementById("authorModalAlerts");

    if (followersEl) followersEl.innerText = profile.seguidores.toLocaleString();
    if (seedsEl) seedsEl.innerText = profile.semillasAportadas.toLocaleString();
    if (treesEl) treesEl.innerText = profile.arbolesRespaldados;
    if (alertsEl) alertsEl.innerText = profile.alertasReportadas;

    // Estado del botón seguir
    updateFollowButtonState();

    // Renderizar publicaciones del autor
    renderAuthorContent();

    // Abrir modal con clase open
    modal.classList.add("open");

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function updateFollowButtonState() {
    const btnFollow = document.getElementById("btnAuthorModalFollow");
    if (!btnFollow || !currentAuthorInModal) return;

    const isFollowing = AppState.estaSiguiendo(currentAuthorInModal.id) || currentAuthorInModal.seguido;
    if (isFollowing) {
      btnFollow.className = "btn-author-following";
      btnFollow.innerHTML = `<i data-lucide="check" style="width:14px; height:14px;"></i> Siguiendo`;
    } else {
      btnFollow.className = "btn-author-follow";
      btnFollow.innerHTML = `<i data-lucide="user-plus" style="width:14px; height:14px;"></i> Seguir`;
    }
    if (window.lucide) lucide.createIcons();
  }

  function toggleFollowCurrent() {
    if (!currentAuthorInModal) return;
    const nowFollowing = AppState.toggleSeguirPerfil(currentAuthorInModal.id);

    const followersEl = document.getElementById("authorModalFollowers");
    if (followersEl) followersEl.innerText = currentAuthorInModal.seguidores.toLocaleString();

    updateFollowButtonState();

    if (nowFollowing) {
      AppVoice.showToast(`¡Ahora sigues a ${currentAuthorInModal.nombre}! 🔔`);
    } else {
      AppVoice.showToast(`Dejaste de seguir a ${currentAuthorInModal.nombre}`);
    }
  }

  function setAuthorTab(tab) {
    activeTab = tab;
    document.querySelectorAll(".author-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    renderAuthorContent();
  }

  function renderAuthorContent() {
    const listContainer = document.getElementById("authorModalContentList");
    if (!listContainer || !currentAuthorInModal) return;

    listContainer.innerHTML = "";

    if (activeTab === "posts") {
      // Buscar publicaciones donde sea el autor
      const posts = (window.APP_DATA && window.APP_DATA.publicaciones)
        ? window.APP_DATA.publicaciones.filter(p => 
            p.perfilId === currentAuthorInModal.id || 
            p.autorHandle === currentAuthorInModal.handle || 
            p.autor.toLowerCase().includes(currentAuthorInModal.nombre.toLowerCase())
          )
        : [];

      if (posts.length === 0) {
        listContainer.innerHTML = `
          <div class="author-empty-state">
            <span style="font-size:28px;">📝</span>
            <p>Este perfil aún no ha publicado alertas directas en el muro.</p>
          </div>
        `;
        return;
      }

      posts.forEach(p => {
        const item = document.createElement("div");
        item.className = "author-post-mini-card";
        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="badge-live-tag" style="font-size:0.62rem;">${p.tipoLabel}</span>
            <span style="font-size:0.68rem; color:var(--texto-mutado);">${p.tiempo}</span>
          </div>
          <p style="font-size:0.75rem; color:var(--texto-oscuro); line-height:1.4; margin-bottom:8px;">${p.texto}</p>
          <div style="display:flex; justify-content:space-between; font-size:0.68rem; color:var(--texto-secundario);">
            <span>❤️ ${p.likes} apoyos</span>
            <span>💬 ${p.comentarios} comentarios</span>
          </div>
        `;
        listContainer.appendChild(item);
      });

    } else if (activeTab === "reels") {
      // Buscar reels donde sea el autor
      const reels = (window.APP_DATA && window.APP_DATA.reels)
        ? window.APP_DATA.reels.filter(r => 
            r.perfilId === currentAuthorInModal.id || 
            r.autorHandle === currentAuthorInModal.handle || 
            r.autor.toLowerCase().includes(currentAuthorInModal.handle.toLowerCase())
          )
        : [];

      if (reels.length === 0) {
        listContainer.innerHTML = `
          <div class="author-empty-state">
            <span style="font-size:28px;">🎬</span>
            <p>No hay reels registrados para esta cuenta.</p>
          </div>
        `;
        return;
      }

      reels.forEach(r => {
        const item = document.createElement("div");
        item.className = "author-post-mini-card";
        item.style.cursor = "pointer";
        item.onclick = () => {
          closeAuthorProfile();
          AppNavigation.navigateTo("reels");
        };
        item.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span class="badge-live-tag" style="background:var(--azul-magdalena); font-size:0.62rem;">Reel Territorial</span>
            <span style="font-size:0.68rem; color:var(--verde-selva); font-weight:700;">+${r.semillasRecompensa} 🌱</span>
          </div>
          <p style="font-size:0.75rem; color:var(--texto-oscuro); line-height:1.35; margin-bottom:6px;">${r.descripcion}</p>
          <div style="display:flex; gap:6px; font-size:0.68rem; color:var(--texto-mutado);">
            <span>❤️ ${r.likes}</span>
            <span>💬 ${r.comentarios}</span>
            <span style="margin-left:auto; color:var(--naranja-tierra); font-weight:700;">Ver Video ▶</span>
          </div>
        `;
        listContainer.appendChild(item);
      });
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function closeAuthorProfile() {
    const modal = document.getElementById("authorProfileModalOverlay");
    if (modal) modal.classList.remove("open");
    currentAuthorInModal = null;
  }

  function shareCurrentProfile() {
    if (!currentAuthorInModal) return;
    openShareModal(`Conoce el perfil ambiental de ${currentAuthorInModal.nombre} (${currentAuthorInModal.handle}) en IMA La Dorada: ${currentAuthorInModal.bio}`);
  }

  return {
    init,
    openAuthorProfile,
    closeAuthorProfile,
    toggleFollowCurrent,
    setAuthorTab,
    shareCurrentProfile
  };
})();

window.AppProfiles = AppProfiles;

