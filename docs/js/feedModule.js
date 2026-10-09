/**
 * MÓDULO DEL FEED COMUNITARIO
 * Publicaciones interactivas, microaprendizaje y acciones locales
 */

const AppFeed = (() => {
  let activeTab = "todo";

  function init() {
    renderPosts();
    setupTabListeners();
  }

  function setupTabListeners() {
    document.querySelectorAll(".feed-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".feed-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        renderPosts();
      });
    });
  }

  function renderPosts() {
    const container = document.getElementById("feedPostsList");
    if (!container) return;

    container.innerHTML = "";

    const posts = APP_DATA.publicaciones.filter(p => {
      if (activeTab === "todo") return true;
      return p.categoria === activeTab;
    });

    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "feed-card";
      card.id = post.id;

      let interactiveActionHtml = "";
      if (post.recompensa && !post.reclamado) {
        interactiveActionHtml = `
          <div class="post-interactive-box">
            <div class="reward-info">
              <span>Recompensa ambiental</span>
              <strong>+${post.recompensa} semillas colectivas 🌱</strong>
            </div>
            <button class="btn-primary" style="padding:7px 14px; font-size:0.75rem;" onclick="AppFeed.claimReward('${post.id}', ${post.recompensa})">
              Aprender & Reclamar
            </button>
          </div>
        `;
      } else if (post.reclamado) {
        interactiveActionHtml = `
          <div class="post-interactive-box" style="background:#f0f8e8; border-color:rgba(111,158,69,0.35);">
            <div class="reward-info">
              <span style="color:var(--verde-selva);">¡Semillas otorgadas!</span>
              <strong style="color:var(--verde-selva);">🌱 Contribuiste a la meta comunitaria</strong>
            </div>
            <span style="font-size:1.1rem;">✅</span>
          </div>
        `;
      } else if (post.categoria === "alerta") {
        interactiveActionHtml = `
          <div class="post-interactive-box" style="border-color:rgba(230,57,70,0.35); background:#fff5f5;">
            <div class="reward-info">
              <span style="color:var(--rojo-fuego);">Recomendación oficial</span>
              <strong>Consultar protocolos ante sequía</strong>
            </div>
            <button class="btn-primary" style="background:var(--rojo-fuego); padding:7px 14px; font-size:0.75rem;" onclick="AppNavigation.navigateTo('mapa')">
              Ver en Mapa
            </button>
          </div>
        `;
      } else if (post.categoria === "accion") {
        interactiveActionHtml = `
          <div class="post-interactive-box" style="border-color:rgba(53,107,62,0.35); background:#f4f9f0;">
            <div class="reward-info">
              <span>Punto de encuentro: Malecón</span>
              <strong>Sábado 8:00 AM · Río Magdalena</strong>
            </div>
            <button class="btn-primary" style="padding:7px 14px; font-size:0.75rem;" onclick="AppFeed.joinAction(this)">
              ¡Me uno!
            </button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="feed-card-header">
          <div class="author-info-group" style="cursor:pointer;" onclick="AppProfiles.openAuthorProfile('${post.perfilId || post.autorHandle || post.autor}')" title="Ver perfil de ${post.autor}">
            <div class="author-avatar">
              <img src="${post.autorImg}" alt="${post.autor}" onerror="this.src='assets/avatars/nutria.png'">
            </div>
            <div class="author-names">
              <h4>${post.autor} <i data-lucide="check-circle" style="width:13px; height:13px; color:var(--verde-hoja);"></i></h4>
              <span>${post.autorRol} • ${post.tiempo}</span>
            </div>
          </div>
          <span class="post-type-badge ${post.tipoBadge}">${post.tipoLabel}</span>
        </div>

        <div class="feed-card-content">
          <p class="post-text-body">${post.texto}</p>
          ${interactiveActionHtml}
        </div>

        <div class="feed-card-footer">
          <div class="post-stats-row">
            <button class="stat-action-btn" onclick="AppFeed.toggleLike(this, ${post.likes})">
              <i data-lucide="heart" style="width:16px; height:16px;"></i>
              <span>${post.likes}</span>
            </button>
            <button class="stat-action-btn" onclick="openCommentsModal('${post.id}')">
              <i data-lucide="message-circle" style="width:16px; height:16px;"></i>
              <span>${post.comentarios}</span>
            </button>
          </div>
          <button class="stat-action-btn" onclick="openShareModal('${post.texto.replace(/'/g, "\\'")}')">
            <i data-lucide="share-2" style="width:16px; height:16px;"></i>
            <span>Compartir</span>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function claimReward(postId, amount) {
    const post = APP_DATA.publicaciones.find(p => p.id === postId);
    if (post && !post.reclamado) {
      post.reclamado = true;
      AppState.addSemillas(amount, "Microaprendizaje ambiental");
      renderPosts();
      AppState.setAvatarSpeech(`¡Excelente! Ganaste +${amount} semillas aprendiendo a cuidar el territorio.`);
    }
  }

  function joinAction(btn) {
    btn.innerText = "¡Inscrito!";
    btn.style.background = "#2b7a38";
    btn.disabled = true;
    AppState.addSemillas(20, "Inscripción a siembra comunitaria");
    AppState.setAvatarSpeech("¡Qué gran compromiso! Te sumaste a la siembra en el Malecón Bucamba (+20 semillas).");
  }

  function toggleLike(btn, initialCount) {
    const isLiked = btn.classList.toggle("liked");
    const countSpan = btn.querySelector("span");
    countSpan.innerText = isLiked ? (initialCount + 1) : initialCount;
  }

  function sharePost(text) {
    if (typeof openShareModal === "function") {
      openShareModal(text);
    } else {
      AppVoice.showToast("Reporte listo para compartir");
    }
  }

  return {
    init,
    renderPosts,
    claimReward,
    joinAction,
    toggleLike,
    sharePost
  };
})();

window.AppFeed = AppFeed;

