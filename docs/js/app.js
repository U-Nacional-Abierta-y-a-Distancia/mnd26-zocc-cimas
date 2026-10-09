/**
 * PUNTO DE ENTRADA PRINCIPAL (MAIN BOOTSTRAP)
 * Orquestación de módulos, modales interactivos y accesibilidad
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar módulos
  AppNavigation.init();
  AppFeed.init();
  AppReels.init();
  AppMap.init();
  AppChallenges.init();
  AppVoice.init();
  AppProfiles.init();
  AppAuth.init();
  AppCandyGame.init();

  // Configurar modales y flujos
  setupModalHandlers();
  setupOnboardingFlow();
  setupProfileScreen();
  setupReadingRulerTracker();

  if (window.lucide) {
    lucide.createIcons();
  }
});

// ALTERNANCIA ENTRE VISTA MÓVIL Y PANTALLA COMPLETA
function setPhoneMode(isPhone) {
  const container = document.getElementById("phoneContainer");
  const btnPhone = document.getElementById("btnPhoneView");
  const btnFull = document.getElementById("btnFullscreenView");

  if (isPhone) {
    container.classList.remove("fullscreen-mode");
    if (btnPhone) btnPhone.classList.add("active");
    if (btnFull) btnFull.classList.remove("active");
  } else {
    container.classList.add("fullscreen-mode");
    if (btnFull) btnFull.classList.add("active");
    if (btnPhone) btnPhone.classList.remove("active");
  }

  setTimeout(() => {
    if (window.AppMap && window.AppMap.invalidateSize) {
      window.AppMap.invalidateSize();
    }
  }, 360);
}

// =========================================================
// GESTIÓN DE MODALES GLOBALES (DENTRO DEL MARCO DEL CELULAR)
// =========================================================

let currentActiveShareText = "";
let currentActiveCommentPostId = null;

function setupModalHandlers() {
  // Reporte de Alertas
  const btnOpenReport = document.getElementById("btnOpenReport");
  if (btnOpenReport) {
    btnOpenReport.addEventListener("click", openReportModal);
  }

  // Notificaciones
  const btnOpenNotifications = document.getElementById("btnOpenNotifications");
  if (btnOpenNotifications) {
    btnOpenNotifications.addEventListener("click", openNotificationsModal);
  }

  // Accesibilidad
  const btnOpenAccessibility = document.getElementById("btnOpenAccessibility");
  if (btnOpenAccessibility) {
    btnOpenAccessibility.addEventListener("click", openAccessibilityModal);
  }

  // Cerrar modales al hacer clic en el backdrop oscurecido
  document.querySelectorAll(".modal-overlay-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("open");
      }
    });
  });
}

let preciseReportCoords = null;

function getPreciseGPSLocation() {
  const btn = document.getElementById("btnGetGPS");
  const label = document.getElementById("gpsBtnLabel");
  const badge = document.getElementById("gpsStatusBadge");
  const text = document.getElementById("gpsStatusText");
  const placeInput = document.getElementById("modalAlertPlace");

  if (btn) btn.classList.add("loading");
  if (label) label.innerText = "Localizando...";

  if (!("geolocation" in navigator)) {
    fallbackLocalCoords("Geolocalización no soportada");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (btn) btn.classList.remove("loading");
      if (label) label.innerText = "GPS Activo ✓";

      const realLat = position.coords.latitude;
      const realLon = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy || 6);

      // Evaluar si las coordenadas están en La Dorada (5.40 a 5.51, -74.72 a -74.62)
      const inLaDorada = (realLat >= 5.40 && realLat <= 5.51 && realLon >= -74.72 && realLon <= -74.62);

      let reportLat, reportLon, sectorSugerido;

      if (inLaDorada) {
        reportLat = realLat;
        reportLon = realLon;
        sectorSugerido = "Sector Georreferenciado por GPS (La Dorada)";
      } else {
        // Coordenadas locales precisas en La Dorada para simulación o pruebas externas
        const doradaCore = [5.4542, -74.6648];
        const jitterLat = (Math.random() - 0.5) * 0.012;
        const jitterLon = (Math.random() - 0.5) * 0.012;
        reportLat = doradaCore[0] + jitterLat;
        reportLon = doradaCore[1] + jitterLon;
        sectorSugerido = "Sector Riberas de Bucamba (GPS Preciso)";
      }

      preciseReportCoords = {
        lat: reportLat,
        lon: reportLon,
        accuracy: accuracy,
        isExact: inLaDorada
      };

      if (badge && text) {
        badge.style.display = "flex";
        text.innerText = `GPS: Lat ${reportLat.toFixed(4)}°, Lon ${reportLon.toFixed(4)}° (±${accuracy}m)`;
      }

      if (placeInput && !placeInput.value) {
        placeInput.value = sectorSugerido;
      }

      AppVoice.showToast(`📍 Ubicación GPS precisa detectada (±${accuracy}m)`);
      AppVoice.speakMessage("Coordenadas GPS fijadas con precisión para tu reporte.");
    },
    (err) => {
      fallbackLocalCoords(err.message);
    },
    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
  );

  function fallbackLocalCoords(reason) {
    if (btn) btn.classList.remove("loading");
    if (label) label.innerText = "GPS Estimado ✓";

    const doradaCore = [5.4542, -74.6648];
    const jitterLat = (Math.random() - 0.5) * 0.010;
    const jitterLon = (Math.random() - 0.5) * 0.010;
    const reportLat = doradaCore[0] + jitterLat;
    const reportLon = doradaCore[1] + jitterLon;

    preciseReportCoords = {
      lat: reportLat,
      lon: reportLon,
      accuracy: 10,
      isExact: false
    };

    if (badge && text) {
      badge.style.display = "flex";
      text.innerText = `GPS Urbano: Lat ${reportLat.toFixed(4)}°, Lon ${reportLon.toFixed(4)}° (±10m)`;
    }

    if (placeInput && !placeInput.value) {
      placeInput.value = "Sector Urbano La Dorada (Punto Fijo)";
    }

    AppVoice.showToast("Ubicación precisa fijada en La Dorada 📍");
  }
}

// 1. MODAL: REPORTE DE ALERTAS Y BUENAS ACCIONES (RIESGO VS IMPACTO)
let reportCurrentMode = "alertas"; // "alertas" (riesgo) o "impacto" (buenas acciones)
let currentTreeCount = 1;

function openReportModal() {
  const modal = document.getElementById("reportModalOverlay");
  if (modal) {
    modal.classList.add("open");
    setReportMode("alertas");
    if (window.lucide) lucide.createIcons();
  }
}

function closeReportModal() {
  const modal = document.getElementById("reportModalOverlay");
  if (modal) modal.classList.remove("open");
  preciseReportCoords = null;
  const badge = document.getElementById("gpsStatusBadge");
  if (badge) badge.style.display = "none";
  const label = document.getElementById("gpsBtnLabel");
  if (label) label.innerText = "Mi GPS Preciso";
}

function setReportMode(mode) {
  reportCurrentMode = mode;
  const btnRisk = document.getElementById("btnReportModeRisk");
  const btnImpact = document.getElementById("btnReportModeImpact");
  const titleText = document.getElementById("reportModalTitleText");
  const titleIcon = document.getElementById("reportModalTitleIcon");
  const labelCat = document.getElementById("labelReportCategory");
  const selectCat = document.getElementById("modalAlertType");
  const treeBox = document.getElementById("treePlantingBox");
  const btnSubmitText = document.getElementById("btnSubmitReportText");
  const btnSubmitModal = document.getElementById("btnSubmitReportModal");

  if (mode === "alertas") {
    if (btnRisk) {
      btnRisk.className = "report-mode-btn active risk";
    }
    if (btnImpact) {
      btnImpact.className = "report-mode-btn";
    }
    if (titleText) titleText.innerText = "Reportar Riesgo · La Dorada";
    if (labelCat) labelCat.innerText = "Tipo de Riesgo Territorial";
    if (selectCat) {
      selectCat.innerHTML = `
        <option value="incendio">🔥 Incendio / Quema de pastizal</option>
        <option value="calor">☀️ Ola de Calor Extremo (Estrés Térmico)</option>
        <option value="agua">💧 Bajante del Río / Escasez de agua</option>
        <option value="residuos">🚯 Disposición Inadecuada de Residuos (Ronda o Pastizal)</option>
      `;
    }
    if (treeBox) treeBox.style.display = "none";
    if (btnSubmitText) btnSubmitText.innerText = "Publicar Alerta de Riesgo (+20 🌱)";
    if (btnSubmitModal) btnSubmitModal.style.background = "var(--naranja-tierra)";
  } else {
    if (btnImpact) {
      btnImpact.className = "report-mode-btn active impact";
    }
    if (btnRisk) {
      btnRisk.className = "report-mode-btn";
    }
    if (titleText) titleText.innerText = "Registrar Buena Acción · La Dorada";
    if (labelCat) labelCat.innerText = "Tipo de Buena Acción (Impacto)";
    if (selectCat) {
      selectCat.innerHTML = `
        <option value="siembra">🌳 Árboles Sembrados (Reforestación Nativa)</option>
        <option value="hidratacion">🚰 Oasis Comunitario de Hidratación</option>
        <option value="limpieza">🧹 Jornada Vecinal Ronda Limpia</option>
      `;
    }
    if (treeBox) treeBox.style.display = "block";
    if (btnSubmitText) btnSubmitText.innerText = "Registrar Buena Acción (+35 🌱)";
    if (btnSubmitModal) btnSubmitModal.style.background = "var(--verde-selva)";
  }

  if (window.lucide) lucide.createIcons();
}

function handleReportCategoryChange() {
  const selectCat = document.getElementById("modalAlertType");
  const treeBox = document.getElementById("treePlantingBox");
  if (!selectCat || !treeBox) return;

  if (reportCurrentMode === "impacto" && selectCat.value === "siembra") {
    treeBox.style.display = "block";
  } else {
    treeBox.style.display = "none";
  }
}

function stepTreeCount(delta) {
  currentTreeCount = Math.max(1, Math.min(100, currentTreeCount + delta));
  const countEl = document.getElementById("treeCountDisplay");
  if (countEl) countEl.innerText = currentTreeCount;
}

function submitNewReportFromModal() {
  const type = document.getElementById("modalAlertType").value;
  const place = document.getElementById("modalAlertPlace").value || "Sector Urbano La Dorada";
  const desc = document.getElementById("modalAlertDesc").value || "Acción comunitaria verificada en el territorio.";

  let finalLat, finalLon, statusText;
  if (preciseReportCoords) {
    finalLat = preciseReportCoords.lat;
    finalLon = preciseReportCoords.lon;
    statusText = `GPS Verificado (±${preciseReportCoords.accuracy}m)`;
  } else {
    const centerLaDorada = [5.4542, -74.6648];
    const offsetLat = (Math.random() - 0.5) * 0.016;
    const offsetLon = (Math.random() - 0.5) * 0.016;
    finalLat = centerLaDorada[0] + offsetLat;
    finalLon = centerLaDorada[1] + offsetLon;
    statusText = "Recién Registrado";
  }

  const isImpact = (reportCurrentMode === "impacto");

  if (!isImpact) {
    // --- MODO RIESGO ---
    let color = "#E63946";
    let haloColor = "rgba(230, 57, 70, 0.45)";
    let iconType = "flame";
    let severity = "urgente";
    let severityLabel = "🔴 Alerta Urgente";

    if (type === "calor") {
      color = "#D96B35";
      haloColor = "rgba(217, 107, 53, 0.45)";
      iconType = "sun";
      severity = "moderada";
      severityLabel = "🟠 Calor Extremo";
    } else if (type === "agua") {
      color = "#477FA8";
      haloColor = "rgba(71, 127, 168, 0.45)";
      iconType = "water";
      severity = "moderada";
      severityLabel = "🔵 Escasez Hídrica";
    } else if (type === "residuos") {
      color = "#C85A32";
      haloColor = "rgba(200, 90, 50, 0.45)";
      iconType = "waste";
      severity = "moderada";
      severityLabel = "🚯 Residuos en Ronda";
    }

    const newPin = {
      id: "alert-" + Date.now(),
      layer: "alertas",
      category: type,
      title: document.getElementById("modalAlertType").selectedOptions[0].text,
      location: place,
      lat: finalLat,
      lon: finalLon,
      desc: desc,
      severity: severity,
      severityLabel: severityLabel,
      confirmations: 1,
      timeAgo: "Hace 1m",
      status: statusText,
      color: color,
      haloColor: haloColor,
      iconType: iconType
    };

    closeReportModal();
    AppMap.addNewAlert(newPin);
    AppState.addSemillas(20, "Alerta de riesgo reportada");
    AppVoice.showToast("¡Alerta de riesgo georreferenciada con éxito! 🚨");
    AppState.setAvatarSpeech("¡Alerta de riesgo publicada! Los bomberos y la comunidad pueden verla en el mapa.");
  } else {
    // --- MODO BUENA ACCIÓN / IMPACTO POSITIVO ---
    let title = "Buena Acción Comunitaria";
    let severityLabel = "🌱 Buena Acción";
    let color = "#356B3E";
    let haloColor = "rgba(53, 107, 62, 0.45)";
    let iconType = "tree";

    if (type === "siembra") {
      const speciesSelect = document.getElementById("modalTreeSpecies");
      const speciesName = speciesSelect ? speciesSelect.value.split(" (")[0] : "Árboles Nativos";
      title = `${currentTreeCount} ${currentTreeCount === 1 ? 'Árbol Sembrado' : 'Árboles Sembrados'}: ${speciesName}`;
      severityLabel = `🌳 ${currentTreeCount} ${currentTreeCount === 1 ? 'Árbol' : 'Árboles'} Sembrados`;
      color = "#2D6A4F";
      haloColor = "rgba(45, 106, 79, 0.45)";
      iconType = "tree";

      // Mutar estado reactivo de árboles reales sembrados
      AppState.addArboles(currentTreeCount, "Siembra Comunitaria en " + place);

      // Publicar automáticamente en el feed como Acción Comunitaria
      const state = AppState.getState();
      const newPost = {
        id: "post-" + Date.now(),
        categoria: "accion",
        tipoBadge: "badge-accion",
        tipoLabel: "Buena Acción",
        autor: state.usuario.nombre,
        autorRol: "Guardián de " + state.usuario.municipio,
        autorImg: state.avatarActivo.img,
        tiempo: "Ahora",
        texto: `🌳 ¡Buena acción en el territorio! Sembraron ${currentTreeCount} ${speciesName} en ${place}. Sumando sombra y cobertura vegetal frente al calor extremo de El Niño.`,
        likes: 1,
        comentarios: 0
      };

      APP_DATA.publicaciones.unshift(newPost);
      if (window.AppFeed && window.AppFeed.renderPosts) {
        AppFeed.renderPosts();
      }

      if (window.confetti) {
        confetti({ particleCount: 70, spread: 75, origin: { y: 0.7 } });
      }

      AppVoice.showToast(`¡${currentTreeCount} ${currentTreeCount === 1 ? 'árbol sembrado registrado' : 'árboles sembrados registrados'}! 🌱🌳`);
      AppState.setAvatarSpeech(`¡Extraordinario! Registraste ${currentTreeCount} árboles sembrados. Tu acción refresca el Magdalena Caldense.`);
    } else if (type === "hidratacion") {
      title = "Oasis Comunitario e Hidratación Vecinal";
      severityLabel = "🚰 Oasis de Agua";
      color = "#8DC8C5";
      haloColor = "rgba(141, 200, 197, 0.45)";
      iconType = "water";
      AppState.addSemillas(25, "Oasis de hidratación registrado");
      AppVoice.showToast("¡Oasis comunitario registrado con éxito! 🚰");
      AppState.setAvatarSpeech("¡Gran iniciativa! Un punto de agua previene golpes de calor en ancianos y animales.");
    } else if (type === "limpieza") {
      title = "Jornada Vecinal Ronda Limpia";
      severityLabel = "🧹 Rondas Limpias";
      color = "#52B788";
      haloColor = "rgba(82, 183, 136, 0.45)";
      iconType = "waste";
      AppState.addSemillas(30, "Jornada vecinal de limpieza");
      AppVoice.showToast("¡Jornada de limpieza ribereña registrada! 🧹");
      AppState.setAvatarSpeech("¡Excelente! Retirar vidrios y plásticos secos evita incendios por efecto lupa.");
    }

    const newPin = {
      id: "impact-" + Date.now(),
      layer: "impacto",
      category: type,
      title: title,
      location: place,
      lat: finalLat,
      lon: finalLon,
      desc: desc,
      severity: "impacto",
      severityLabel: severityLabel,
      confirmations: 1,
      timeAgo: "Ahora",
      status: "Buena Acción Activa",
      color: color,
      haloColor: haloColor,
      iconType: iconType
    };

    closeReportModal();
    AppMap.addNewAlert(newPin);
  }
}

// 2. MODAL: CENTRO DE NOTIFICACIONES
function openNotificationsModal() {
  renderNotificationsList();
  const modal = document.getElementById("notificationsModalOverlay");
  if (modal) {
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }
}

function closeNotificationsModal() {
  const modal = document.getElementById("notificationsModalOverlay");
  if (modal) modal.classList.remove("open");
}

function renderNotificationsList() {
  const list = document.getElementById("notificationsListContainer");
  if (!list) return;

  list.innerHTML = APP_DATA.notificacionesAlertas.map(notif => `
    <div class="notif-item ${notif.leida ? '' : 'unread'}" onclick="handleNotifClick('${notif.id}')" style="cursor:pointer;">
      <div class="notif-icon-circle" style="background:${notif.tipo === 'alerta' ? 'rgba(230,57,70,0.12)' : 'rgba(53,107,62,0.12)'};">
        ${notif.icono}
      </div>
      <div class="notif-content-text" style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h4>${notif.titulo}</h4>
          ${notif.leida ? '' : '<span style="width:7px; height:7px; background:var(--rojo-fuego); border-radius:50%; display:inline-block;"></span>'}
        </div>
        <p>${notif.mensaje}</p>
        <span class="notif-time-tag">${notif.tiempo}</span>
      </div>
    </div>
  `).join("");
}

function handleNotifClick(notifId) {
  const notif = APP_DATA.notificacionesAlertas.find(n => n.id === notifId);
  if (!notif) return;

  notif.leida = true;
  closeNotificationsModal();
  checkUnreadNotifications();
  if (notif.pantallaDestino) {
    AppNavigation.navigateTo(notif.pantallaDestino);
  }
}

function markAllNotificationsRead() {
  APP_DATA.notificacionesAlertas.forEach(n => n.leida = true);
  renderNotificationsList();
  checkUnreadNotifications();
  AppVoice.showToast("Todas las alertas marcadas como leídas");
}

function checkUnreadNotifications() {
  const hasUnread = APP_DATA.notificacionesAlertas.some(n => !n.leida);
  const dot = document.getElementById("headerNotifDot");
  if (dot) {
    dot.style.display = hasUnread ? "block" : "none";
  }
}

// 3. MODAL: ACCESIBILIDAD Y LECTURA POR VOZ
function openAccessibilityModal() {
  const modal = document.getElementById("accessibilityModalOverlay");
  if (modal) {
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }
}

function closeAccessibilityModal() {
  const modal = document.getElementById("accessibilityModalOverlay");
  if (modal) modal.classList.remove("open");
}

// 4. MODAL: DIÁLOGO Y COMENTARIOS COMUNITARIOS
function openCommentsModal(sourceId) {
  currentActiveCommentPostId = sourceId;
  renderCommentsList();
  const modal = document.getElementById("commentsModalOverlay");
  if (modal) {
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }
}

function closeCommentsModal() {
  const modal = document.getElementById("commentsModalOverlay");
  if (modal) modal.classList.remove("open");
  currentActiveCommentPostId = null;
}

function renderCommentsList() {
  const container = document.getElementById("commentsListContainer");
  if (!container) return;

  const postId = currentActiveCommentPostId || "post-1";
  const comments = APP_DATA.comentariosPorPost[postId] || [];

  const subtitle = document.getElementById("commentsModalSubtitle");
  if (subtitle) {
    const count = comments.length;
    subtitle.innerText = `${count} ${count === 1 ? 'comentario ciudadano verificado' : 'comentarios ciudadanos verificados'}`;
  }

  if (comments.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:28px 12px; color:var(--texto-mutado); font-size:0.75rem;">
        <span style="font-size:24px; display:block; margin-bottom:6px;">💬</span>
        Sé el primer guardián en compartir tu reporte o aporte vecinal.
      </div>
    `;
    return;
  }

  container.innerHTML = comments.map(c => `
    <div class="comment-row">
      <div class="comment-user-avatar" style="cursor:pointer;" onclick="AppProfiles.openAuthorProfile('${c.autorHandle || c.autor}')" title="Ver perfil de ${c.autor}">
        <img src="${c.avatar}" alt="${c.autor}" onerror="this.src='assets/avatars/nutria.png'">
      </div>
      <div class="comment-bubble-body">
        <div class="comment-bubble-header">
          <span class="comment-author-name" style="cursor:pointer;" onclick="AppProfiles.openAuthorProfile('${c.autorHandle || c.autor}')" title="Ver perfil">${c.autor} <span style="font-size:0.64rem; color:var(--texto-mutado); font-weight:600;">• ${c.rol}</span></span>
          <span style="font-size:0.62rem; color:var(--texto-mutado); font-weight:600;">${c.tiempo}</span>
        </div>
        <p class="comment-text-content">${c.texto}</p>
      </div>
    </div>
  `).join("");
}

function submitNewComment() {
  const input = document.getElementById("inputNewCommentText");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const state = AppState.getState();
  const newComment = {
    id: "c-" + Date.now(),
    autor: state.usuario.nombre,
    autorHandle: state.usuario.handle || "@guardiandorado",
    rol: state.usuario.rol,
    avatar: state.usuario.avatar || state.avatarActivo.img,
    tiempo: "Ahora",
    texto: text
  };

  const postId = currentActiveCommentPostId || "post-1";
  if (!APP_DATA.comentariosPorPost[postId]) {
    APP_DATA.comentariosPorPost[postId] = [];
  }

  APP_DATA.comentariosPorPost[postId].unshift(newComment);
  const currentCount = APP_DATA.comentariosPorPost[postId].length;

  // Actualizar el contador en la publicación correspondiente de forma coherente
  const post = APP_DATA.publicaciones.find(p => p.id === postId);
  if (post) {
    post.comentarios = currentCount;
    if (window.AppFeed && window.AppFeed.renderPosts) {
      AppFeed.renderPosts();
    }
  }

  // Si es un reel, actualizar también el contador
  const reel = APP_DATA.reels.find(r => r.id === postId);
  if (reel) {
    reel.comentarios = currentCount;
    const reelCommentCount = document.querySelector(".reels-sidebar-actions .reel-action-bubble:nth-child(2) .reel-action-label");
    if (reelCommentCount) reelCommentCount.innerText = currentCount;
  }

  input.value = "";
  renderCommentsList();

  AppState.addSemillas(5, "Aporte a la deliberación comunitaria");
  AppVoice.speakMessage("¡Gracias por tu aporte! La comunidad unida cuida mejor el territorio.");
  AppVoice.showToast("+5 semillas 🌱 por participar en el diálogo");
}

// 5. MODAL: COMPARTIR EN REDES Y COMUNIDAD
function openShareModal(text) {
  currentActiveShareText = text || "Cuidemos La Dorada y el Río Magdalena frente a El Niño en IMA.";
  const preview = document.getElementById("sharePreviewSnippet");
  if (preview) {
    preview.innerText = `"${currentActiveShareText}"`;
  }
  const modal = document.getElementById("shareModalOverlay");
  if (modal) {
    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }
}

function closeShareModal() {
  const modal = document.getElementById("shareModalOverlay");
  if (modal) modal.classList.remove("open");
}

function shareViaWhatsApp() {
  const msg = encodeURIComponent(`🚨 IMA · Inteligencia y Monitoreo Ambiental (Magdalena Caldense):\n${currentActiveShareText}\n\nConéctate y reporta en tu comunidad.`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  closeShareModal();
}

function copyShareLink() {
  const fullText = `${currentActiveShareText} - IMA La Dorada`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fullText).then(() => {
      AppVoice.showToast("¡Enlace y reporte copiado al portapapeles! 📋");
      closeShareModal();
    }).catch(() => {
      fallbackCopy(fullText);
    });
  } else {
    fallbackCopy(fullText);
  }
}

function fallbackCopy(text) {
  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  AppVoice.showToast("¡Copiado al portapapeles! 📋");
  closeShareModal();
}

function notifyLocalJAC() {
  closeShareModal();
  AppVoice.speakMessage("Alerta compartida con la red de Juntas de Acción Comunal de La Dorada.");
  AppVoice.showToast("Enviado a líderes JAC de La Dorada 🏛️");
}

// =========================================================
// CONFIGURACIÓN DEL FLUJO DE ONBOARDING Y ADOPCIÓN
// =========================================================
function setupOnboardingFlow() {
  let selectedMascotId = "nutria";
  const nameInput = document.getElementById("mascotCustomNameInput");
  const bubbleText = document.getElementById("onboardingMascotSpeechText");
  const bubbleEmoji = document.getElementById("bubbleMascotEmoji");
  const btnDice = document.getElementById("btnRandomMascotName");

  const regionalNames = {
    nutria: ["Ima", "Madre Tierra", "Nutrita", "Magdi", "Caracolí", "Bucamba"],
    pez: ["Ta", "El Sol", "Doradito", "Bocachico", "Brillante", "Guarinó"],
    loro: ["Chikchi", "El Viento", "Vigía", "Corocora", "Perico", "Alasverdes"]
  };

  function updateMascotUI(card) {
    const defaultName = card.dataset.defaultName || "Ima";
    const speech = card.dataset.speech || "¡Hola! Cuidemos el territorio juntos 🍃";
    const emoji = card.dataset.emoji || "🦦";

    if (bubbleText) bubbleText.innerText = `"${speech}"`;
    if (bubbleEmoji) bubbleEmoji.innerText = emoji;
    if (nameInput) {
      nameInput.value = defaultName;
      nameInput.placeholder = `Ej: ${defaultName}`;
    }
  }

  document.querySelectorAll(".mascot-card").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".mascot-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedMascotId = card.dataset.mascot;
      updateMascotUI(card);
    });
  });

  if (btnDice) {
    btnDice.addEventListener("click", () => {
      const namesList = regionalNames[selectedMascotId] || ["Guardián", "Magdi"];
      const randomName = namesList[Math.floor(Math.random() * namesList.length)];
      if (nameInput) {
        nameInput.value = randomName;
        nameInput.focus();
      }
      AppVoice.showToast(`Nombre sugerido: ${randomName} 🎲`);
    });
  }

  const btnFinishOnboarding = document.getElementById("btnFinishOnboarding");
  if (btnFinishOnboarding) {
    btnFinishOnboarding.addEventListener("click", () => {
      const selectTerritory = document.getElementById("onboardingTerritorySelect");
      const selectedTerritoryId = selectTerritory ? selectTerritory.value : "dorada";
      const territoryObj = APP_DATA.territorios.find(t => t.id === selectedTerritoryId) || APP_DATA.territorios[0];
      if (territoryObj) AppState.setTerritorio(territoryObj);

      const mascotObj = APP_DATA.avatares.find(a => a.id === selectedMascotId) || APP_DATA.avatares[0];
      const customName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : mascotObj.nombre;

      if (mascotObj) {
        AppState.setAvatar(mascotObj, customName);
      }

      AppNavigation.navigateTo("inicio");
      AppState.addSemillas(50, "Bono de bienvenida territorial");
      AppVoice.speakMessage(`¡Bienvenido a IMA! Adoptaste a ${customName}. Juntos cuidaremos ${territoryObj.nombre}.`);
    });
  }
}

// =========================================================
// CONFIGURACIÓN DE PANTALLA PERFIL Y DONACIONES AMBIENTALES
// =========================================================
function setupProfileScreen() {
  function updateProfileUI() {
    const state = AppState.getState();
    const user = state.usuario;
    const avatar = state.avatarActivo;

    const imgEl = document.getElementById("profileAvatarImg");
    const nameEl = document.querySelector(".profile-names-block h2");
    const handleEl = document.getElementById("profileUserHandleDisplay");
    const roleEl = document.getElementById("profileUserRoleDisplay");
    const seedsEl = document.getElementById("profileSeedsCount");
    const treesEl = document.getElementById("profileTreesCount");
    const territoryEl = document.getElementById("profileTerritoryName");

    if (imgEl && user) {
      imgEl.src = user.avatar || avatar.img;
      imgEl.onerror = () => { imgEl.src = "assets/avatars/nutria.png"; };
    }
    if (nameEl && user) nameEl.innerText = user.nombre;
    if (handleEl && user) handleEl.innerText = user.handle || "@guardiandorado";
    if (roleEl && user) roleEl.innerText = user.rol || "Guardián Territorial";
    if (seedsEl) seedsEl.innerText = state.gamificacion.semillas;
    if (treesEl) treesEl.innerText = state.gamificacion.arbolesSembrados;
    if (territoryEl && user) territoryEl.innerText = user.municipio;

    renderDonationCampaigns();
  }

  function renderDonationCampaigns() {
    const container = document.getElementById("profileCampaignsList");
    if (!container || !window.APP_DATA || !window.APP_DATA.campanasDonacion) return;

    const campaigns = window.APP_DATA.campanasDonacion;

    container.innerHTML = campaigns.map(camp => {
      const pct = Math.min(100, Math.round((camp.semillasActuales / camp.metaSemillas) * 100));
      return `
        <div class="campaign-card" data-campaign-id="${camp.id}">
          <div class="campaign-card-header">
            <div class="campaign-title-row">
              <span class="campaign-icon-badge">${camp.icon}</span>
              <div>
                <h5>${camp.titulo}</h5>
                <span class="campaign-location-tag">📍 ${camp.ubicacion}</span>
              </div>
            </div>
            <span class="campaign-ally-pill">${camp.aliado.split('&')[0].trim()}</span>
          </div>

          <p class="campaign-desc-text">${camp.descripcion}</p>

          <div class="campaign-progress-wrapper">
            <div class="campaign-progress-labels">
              <span style="color:var(--verde-selva);"><strong>${camp.semillasActuales}</strong> / ${camp.metaSemillas} 🌱</span>
              <span style="color:var(--texto-mutado);">${pct}% (${camp.arbolesFinanciados} metas)</span>
            </div>
            <div class="campaign-progress-bar-bg">
              <div class="campaign-progress-bar-fill" style="width:${pct}%;"></div>
            </div>
          </div>

          <div class="campaign-donate-actions">
            <button class="btn-donate-chip" onclick="donateToCampaign('${camp.id}', 20)" title="Donar 20 semillas">
              +20 🌱
            </button>
            <button class="btn-donate-chip" onclick="donateToCampaign('${camp.id}', 50)" title="Donar 50 semillas">
              +50 🌱
            </button>
            <button class="btn-donate-chip" onclick="donateToCampaign('${camp.id}', 100)" title="Donar 100 semillas">
              +100 🌱
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  window.donateToCampaign = function(campaignId, amount) {
    const state = AppState.getState();
    const currentSeeds = state.gamificacion.semillas;

    if (currentSeeds < amount) {
      AppVoice.showToast(`Necesitas ${amount} semillas (tienes ${currentSeeds} 🌱)`);
      AppVoice.speakMessage("Aún no tienes suficientes semillas acumuladas. Completa misiones o retos para ganar más.");
      return;
    }

    const campaign = APP_DATA.campanasDonacion.find(c => c.id === campaignId);
    if (!campaign) return;

    const success = AppState.deductSemillas(amount, `Donación comunitaria a ${campaign.titulo}`);
    if (success) {
      campaign.semillasActuales += amount;
      if (campaign.semillasActuales >= campaign.metaSemillas) {
        campaign.arbolesFinanciados += 1;
      }

      if (window.confetti) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#356B3E', '#E5A72F', '#477FA8']
        });
      }

      AppVoice.showToast(`¡Donaste ${amount} semillas a ${campaign.titulo}! 🌱`);
      AppVoice.speakMessage(`¡Gracias por tu aporte! Tus ${amount} semillas impulsan la meta de ${campaign.titulo}.`);
      updateProfileUI();
    }
  };

  updateProfileUI();
  AppState.subscribe((event) => {
    if (event === "SEMILLAS_UPDATED" || event === "ARBOLES_UPDATED" || event === "AVATAR_CHANGED" || event === "TERRITORIO_CHANGED" || event === "AUTH_CHANGED" || event === "USER_UPDATED") {
      updateProfileUI();
    }
  });
}

// =========================================================
// ACCESIBILIDAD INTEGRADA (API LEXEND, REGLA Y FILTROS)
// =========================================================
let isDyslexiaActive = false;
let isRulerActive = false;
let isGrayscaleActive = false;
let isHighlightLinksActive = false;

function toggleDyslexiaFont() {
  isDyslexiaActive = !isDyslexiaActive;
  document.body.classList.toggle("font-dyslexia", isDyslexiaActive);
  const btn = document.getElementById("btnToggleDyslexia");
  if (btn) {
    btn.innerText = isDyslexiaActive ? "Desactivar" : "Activar";
    btn.classList.toggle("btn-primary", isDyslexiaActive);
    btn.classList.toggle("btn-secondary", !isDyslexiaActive);
  }
  AppVoice.showToast(isDyslexiaActive ? "Fuente Lexend activada (Inclusión) 📖" : "Fuente estándar restablecida");
  AppVoice.speakMessage(isDyslexiaActive ? "Tipografía para dislexia activada." : "Tipografía estándar restaurada.");
}

function toggleReadingRuler() {
  isRulerActive = !isRulerActive;
  const ruler = document.getElementById("accessibilityReadingRuler");
  const btn = document.getElementById("btnToggleRuler");

  if (ruler) {
    ruler.style.display = isRulerActive ? "block" : "none";
  }
  if (btn) {
    btn.innerText = isRulerActive ? "Desactivar" : "Activar";
    btn.classList.toggle("btn-primary", isRulerActive);
    btn.classList.toggle("btn-secondary", !isRulerActive);
  }

  AppVoice.showToast(isRulerActive ? "Regla guía activada 📏 (Sigue tu dedo o puntero)" : "Regla guía desactivada");
}

function toggleGrayscale() {
  isGrayscaleActive = !isGrayscaleActive;
  document.body.classList.toggle("grayscale-mode", isGrayscaleActive);
  const btn = document.getElementById("btnToggleGrayscale");
  if (btn) {
    btn.classList.toggle("btn-primary", isGrayscaleActive);
  }
  AppVoice.showToast(isGrayscaleActive ? "Modo monocromático activado" : "Colores estándar restaurados");
}

function toggleHighlightLinks() {
  isHighlightLinksActive = !isHighlightLinksActive;
  document.body.classList.toggle("highlight-links-mode", isHighlightLinksActive);
  const btn = document.getElementById("btnToggleHighlightLinks");
  if (btn) {
    btn.innerText = isHighlightLinksActive ? "Desactivar" : "Resaltar";
    btn.classList.toggle("btn-primary", isHighlightLinksActive);
    btn.classList.toggle("btn-secondary", !isHighlightLinksActive);
  }
  AppVoice.showToast(isHighlightLinksActive ? "Botones y enlaces resaltados 🔗" : "Resaltado desactivado");
}

function setupReadingRulerTracker() {
  const container = document.getElementById("phoneContainer");
  const ruler = document.getElementById("accessibilityReadingRuler");
  if (!container || !ruler) return;

  function moveRuler(clientY) {
    if (!isRulerActive) return;
    const rect = container.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    if (relativeY >= 0 && relativeY <= rect.height) {
      ruler.style.top = `${relativeY}px`;
    }
  }

  container.addEventListener("mousemove", (e) => moveRuler(e.clientY), { passive: true });
  container.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      moveRuler(e.touches[0].clientY);
    }
  }, { passive: true });
}
