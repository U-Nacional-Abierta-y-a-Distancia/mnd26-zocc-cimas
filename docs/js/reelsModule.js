/**
 * MÓDULO DE REELS (NARRATIVAS DIGITALES Y VIDEOS CORTOS)
 * Visor vertical interactivo de prevención e historias del Magdalena Caldense
 * Navegación fluida por deslizamiento vertical (Swipe) nativo
 */

const AppReels = (() => {
  let currentIndex = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let touchStartX = 0;
  let isMouseDown = false;
  let mouseStartY = 0;
  let lastWheelTime = 0;

  function init() {
    renderCurrentReel();
    setupSwipeGestures();
  }

  function renderCurrentReel() {
    const container = document.getElementById("reelsVideoContainer");
    if (!container) return;

    const reel = APP_DATA.reels[currentIndex];
    if (!reel) return;

    container.innerHTML = `
      <video class="reels-video-player" id="mainReelPlayer" loop playsinline autoplay muted>
        <source src="${reel.videoSrc}" type="video/mp4">
        Tu navegador no soporta video MP4.
      </video>

      <!-- Overlay de Información -->
      <div class="reels-overlay-details">
        <div class="reels-author-tag" style="cursor:pointer;" onclick="AppProfiles.openAuthorProfile('${reel.perfilId || reel.autorHandle || reel.autor}')" title="Ver perfil de ${reel.autor}">
          <span>${reel.autor}</span>
          <span style="font-size:0.65rem; background:rgba(111,158,69,0.9); padding:2px 8px; border-radius:10px; display:inline-flex; align-items:center; gap:4px;">
            <i data-lucide="user-check" style="width:10px; height:10px;"></i> Ver Perfil
          </span>
        </div>
        <p class="reels-desc-text">${reel.descripcion}</p>
        <div class="reels-tags-row">
          ${reel.tags.map(t => `<span class="reel-tag-chip">${t}</span>`).join("")}
        </div>
      </div>

      <!-- Barra Lateral de Acciones (Deslizar para cambiar de video) -->
      <div class="reels-sidebar-actions">
        <!-- Burbuja de Perfil de Autor con botón de seguir -->
        <div class="reel-action-bubble" onclick="AppProfiles.openAuthorProfile('${reel.perfilId || reel.autorHandle || reel.autor}')" title="Ver perfil">
          <div class="reel-action-icon-circle" style="border:2px solid var(--verde-hoja); padding:2px; background:rgba(0,0,0,0.4);">
            <img src="${reel.id === 'reel-1' ? 'assets/avatars/nutria.webp' : 'assets/avatars/pez.webp'}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" onerror="this.src='assets/avatars/nutria.png'">
          </div>
          <span class="reel-action-label" style="font-size:0.62rem; color:#fff;">Perfil</span>
        </div>

        <div class="reel-action-bubble ${reel.liked ? 'liked' : ''}" onclick="AppReels.toggleLikeReel(this, ${currentIndex})">
          <div class="reel-action-icon-circle">
            <i data-lucide="heart" style="width:22px; height:22px;"></i>
          </div>
          <span class="reel-action-label">${reel.likes}</span>
        </div>

        <div class="reel-action-bubble" onclick="AppReels.showComments(${currentIndex})">
          <div class="reel-action-icon-circle">
            <i data-lucide="message-circle" style="width:22px; height:22px;"></i>
          </div>
          <span class="reel-action-label">${reel.comentarios}</span>
        </div>

        <div class="reel-action-bubble" onclick="AppReels.claimReelSeeds(${currentIndex})">
          <div class="reel-action-icon-circle" style="border-color:var(--dorado-pez);">
            <span style="font-size:18px;">🌱</span>
          </div>
          <span class="reel-action-label">+${reel.semillasRecompensa}</span>
        </div>

        <div class="reel-action-bubble" onclick="openShareModal('${reel.descripcion.replace(/'/g, "\\'")}')">
          <div class="reel-action-icon-circle">
            <i data-lucide="share-2" style="width:20px; height:20px;"></i>
          </div>
          <span class="reel-action-label">Difundir</span>
        </div>
      </div>

      <!-- Indicador animado de deslizamiento vertical (Swipe) -->
      <div class="reel-swipe-indicator-bar">
        <div class="reel-swipe-arrow">
          <i data-lucide="chevron-up" style="width:16px; height:16px;"></i>
        </div>
        <span>Desliza para ver más</span>
      </div>
    `;

    if (window.lucide) {
      lucide.createIcons();
    }

    // Alternar audio al tocar el video
    const video = document.getElementById("mainReelPlayer");
    if (video) {
      video.addEventListener("click", () => {
        video.muted = !video.muted;
        AppVoice.showToast(video.muted ? "Audio silenciado 🔇" : "Audio activado 🔊");
      });
    }
  }

  function setupSwipeGestures() {
    const screen = document.getElementById("screenReels");
    if (!screen) return;

    // Gestos táctiles en móvil (touch)
    screen.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    screen.addEventListener("touchend", (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        handleSwipe(deltaY, deltaX);
      }
    }, { passive: true });

    // Gestos con ratón para escritorio (drag)
    screen.addEventListener("mousedown", (e) => {
      if (e.target.closest(".reels-sidebar-actions") || e.target.closest("button")) return;
      isMouseDown = true;
      mouseStartY = e.clientY;
    });

    screen.addEventListener("mouseup", (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const deltaY = e.clientY - mouseStartY;
      handleSwipe(deltaY, 0);
    });

    screen.addEventListener("mouseleave", () => {
      isMouseDown = false;
    });

    // Rueda del ratón (wheel scroll)
    screen.addEventListener("wheel", (e) => {
      const now = Date.now();
      if (now - lastWheelTime < 650) return;
      if (Math.abs(e.deltaY) > 25) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          navigateReel(1);
        } else {
          navigateReel(-1);
        }
      }
    }, { passive: true });
  }

  function handleSwipe(deltaY, deltaX) {
    if (Math.abs(deltaY) > 42 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        // Deslizar arriba -> siguiente
        navigateReel(1);
      } else {
        // Deslizar abajo -> anterior
        navigateReel(-1);
      }
    }
  }

  function navigateReel(direction) {
    if (isAnimating || !APP_DATA.reels.length) return;
    isAnimating = true;

    const container = document.getElementById("reelsVideoContainer");
    if (container) {
      container.classList.add(direction > 0 ? "slide-up-out" : "slide-down-out");
    }

    setTimeout(() => {
      currentIndex = (currentIndex + direction + APP_DATA.reels.length) % APP_DATA.reels.length;
      renderCurrentReel();

      const newContainer = document.getElementById("reelsVideoContainer");
      if (newContainer) {
        newContainer.classList.remove("slide-up-out", "slide-down-out");
        newContainer.classList.add(direction > 0 ? "slide-up-in" : "slide-down-in");

        setTimeout(() => {
          newContainer.classList.remove("slide-up-in", "slide-down-in");
          isAnimating = false;
        }, 340);
      } else {
        isAnimating = false;
      }
    }, 200);
  }

  function toggleLikeReel(btn, idx) {
    const reel = APP_DATA.reels[idx];
    if (!reel) return;

    reel.liked = !reel.liked;
    reel.likes += reel.liked ? 1 : -1;
    btn.classList.toggle("liked", reel.liked);
    btn.querySelector(".reel-action-label").innerText = reel.likes;

    if (reel.liked && window.gsap) {
      gsap.fromTo(btn.querySelector(".reel-action-icon-circle"), 
        { scale: 0.8 }, 
        { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1 }
      );
    }
  }

  function claimReelSeeds(idx) {
    const reel = APP_DATA.reels[idx];
    if (reel && !reel.claimed) {
      reel.claimed = true;
      AppState.addSemillas(reel.semillasRecompensa, "Viste un reel de prevención");
      AppState.setAvatarSpeech(`¡Sumaste +${reel.semillasRecompensa} semillas! Los videos del Magdalena nos enseñan a cuidar la tierra.`);
    } else {
      AppState.setAvatarSpeech("¡Ya aprendiste con este reel! Sigue explorando para sumar más.");
    }
  }

  function showComments() {
    const reel = APP_DATA.reels[currentIndex];
    if (typeof openCommentsModal === "function" && reel) {
      openCommentsModal(reel.id);
    }
  }

  // GESTIÓN DE SUBIDA DE VIDEOS / REELS
  let uploadedVideoBlobUrl = null;

  function openUploadModal() {
    const modal = document.getElementById("uploadReelModalOverlay");
    if (!modal) return;
    
    // Resetear formulario
    const titleInput = document.getElementById("uploadReelTitle");
    const descInput = document.getElementById("uploadReelDesc");
    const preview = document.getElementById("uploadReelPreview");
    const prompt = document.getElementById("uploadReelPrompt");
    const dropzone = document.querySelector(".upload-reel-dropzone");
    const fileInput = document.getElementById("reelVideoFileInput");

    if (titleInput) titleInput.value = "";
    if (descInput) descInput.value = "";
    if (fileInput) fileInput.value = "";
    if (preview) {
      preview.pause();
      preview.src = "";
      preview.style.display = "none";
    }
    if (prompt) prompt.style.display = "flex";
    if (dropzone) dropzone.classList.remove("has-video");
    uploadedVideoBlobUrl = null;

    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }

  function closeUploadModal() {
    const modal = document.getElementById("uploadReelModalOverlay");
    if (modal) modal.classList.remove("open");
    const preview = document.getElementById("uploadReelPreview");
    if (preview) preview.pause();
  }

  function handleFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (uploadedVideoBlobUrl) {
      try { URL.revokeObjectURL(uploadedVideoBlobUrl); } catch(e) {}
    }

    uploadedVideoBlobUrl = URL.createObjectURL(file);

    const preview = document.getElementById("uploadReelPreview");
    const prompt = document.getElementById("uploadReelPrompt");
    const dropzone = document.querySelector(".upload-reel-dropzone");
    const titleInput = document.getElementById("uploadReelTitle");

    if (preview) {
      preview.src = uploadedVideoBlobUrl;
      preview.style.display = "block";
      preview.play().catch(() => {});
    }
    if (prompt) prompt.style.display = "none";
    if (dropzone) dropzone.classList.add("has-video");

    if (titleInput && !titleInput.value) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }

    AppVoice.showToast("Video vertical seleccionado 🎥");
  }

  function toggleReelTag(btn) {
    if (btn) btn.classList.toggle("active");
  }

  function submitUploadedReel() {
    const titleInput = document.getElementById("uploadReelTitle");
    const descInput = document.getElementById("uploadReelDesc");

    const title = titleInput ? titleInput.value.trim() : "";
    const desc = descInput ? descInput.value.trim() : "";

    const activeTags = Array.from(document.querySelectorAll("#reelTagsSelector .vulnerable-chip-btn.active"))
      .map(b => b.dataset.tag || b.innerText.trim());

    // Usar el blob cargado por el usuario o video regional educativo
    const videoSrc = uploadedVideoBlobUrl || "video1.mp4";

    const state = AppState.getState();
    const newReel = {
      id: "reel-user-" + Date.now(),
      perfilId: state.usuario.id,
      autorHandle: state.usuario.handle || "@estudiante_unad",
      autor: state.usuario.nombre || "Estudiante UNAD",
      videoSrc: videoSrc,
      descripcion: desc || title || "Cápsula ciudadana de prevención frente al fenómeno de El Niño.",
      tags: activeTags.length ? activeTags : ["#VocesDelMagdalena", "#Prevención"],
      likes: 1,
      comentarios: 0,
      semillasRecompensa: 25,
      liked: true,
      claimed: true
    };

    APP_DATA.reels.unshift(newReel);
    currentIndex = 0;
    renderCurrentReel();

    AppState.addSemillas(25, "Publicación de video comunitario");

    if (window.confetti) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#356B3E', '#E5A72F', '#477FA8']
      });
    }

    closeUploadModal();
    AppVoice.showToast("+25 🌱 ¡Tu Reel fue publicado para la comunidad!");
    AppVoice.speakMessage("¡Excelente! Tu cápsula de video se ha compartido con todos los guardianes del Magdalena.");
  }

  return {
    init,
    navigateReel,
    nextReel: () => navigateReel(1),
    prevReel: () => navigateReel(-1),
    toggleLikeReel,
    claimReelSeeds,
    showComments,
    openUploadModal,
    closeUploadModal,
    handleFileSelected,
    toggleReelTag,
    submitUploadedReel
  };
})();

window.AppReels = AppReels;

