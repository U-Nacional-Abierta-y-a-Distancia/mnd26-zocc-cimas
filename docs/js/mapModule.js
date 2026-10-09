/**
 * MÓDULO DEL MAPA GEOGRÁFICO INTERACTIVO (LEAFLET & ECO-BADGES 3D)
 * Monitoreo de alertas de riesgo (El Niño) e impacto comunitario en La Dorada
 */

const AppMap = (() => {
  let map = null;
  let activeBaseLayer = null;
  let baseLayers = {};
  let currentLayerMode = "alertas"; // "alertas" o "impacto"
  let activeFilters = {
    incendio: true,
    calor: true,
    agua: true,
    residuos: true,
    siembra: true,
    hidratacion: true,
    limpieza: true
  };
  let markerInstances = [];
  let currentSelectedAlert = null;
  let followedZones = new Set();

  const boundsLaDorada = [
    [5.405, -74.715],
    [5.505, -74.625]
  ];
  const centerLaDorada = [5.4542, -74.6648];

  function init() {
    // Si el contenedor del mapa ya está visible en el DOM, inicializar de inmediato.
    // De lo contrario, se inicializará cuando el usuario navegue a la pantalla de mapa.
    const screenMapa = document.getElementById("screenMapa");
    if (screenMapa && screenMapa.classList.contains("active")) {
      ensureMapCreated();
    }
  }

  function ensureMapCreated() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    if (!map) {
      map = L.map("map", {
        center: centerLaDorada,
        zoom: 14,
        minZoom: 13,
        maxZoom: 18,
        maxBounds: boundsLaDorada,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        attributionControl: false
      });

      // Capas base 100% libres de bloqueos locales y capa ilustrada oficial
      baseLayers = {
        topo: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 18 }),
        street: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 }),
        satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 18 }),
        illustrated: L.imageOverlay("assets/img/mapa_dorada_real_osm.svg", boundsLaDorada, { opacity: 0.95 })
      };

      activeBaseLayer = baseLayers.topo;
      activeBaseLayer.addTo(map);

      renderMarkers();
      setupEventListeners();
    }

    // Invalidar dimensiones tras hacerse visible para garantizar carga completa de teselas
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 80);
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 280);
  }

  function setupEventListeners() {
    // Cerrar menú de capas al tocar el mapa
    if (map) {
      map.on("click", () => {
        const menu = document.getElementById("basemapMenu");
        if (menu) menu.classList.remove("open");
      });
    }

    // Buscador
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) return;

        const match = APP_DATA.mapaPuntos.find(d => 
          d.title.toLowerCase().includes(q) || 
          d.location.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q)
        );

        if (match) {
          if (match.layer !== currentLayerMode) {
            switchLayerMode(match.layer);
          }
          openBottomSheet(match);
        }
      });
    }
  }

  function buildEcoBadge(item) {
    let innerSvg = "";
    if (item.iconType === "flame") {
      innerSvg = `
        <svg class="anim-flame" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C9.5 7 5 9.5 5 15C5 18.87 8.13 22 12 22C15.87 22 19 18.87 19 15C19 11 15.5 8 13.5 5.5C13 4.5 12.5 3 12 2Z" fill="#FFF"/>
          <path d="M12 9C10.5 12 8 13.5 8 16.5C8 18.71 9.79 20.5 12 20.5C14.21 20.5 16 18.71 16 16.5C16 14 14.5 12.5 13 11C12.5 10.3 12.2 9.5 12 9Z" fill="#FFD166"/>
        </svg>`;
    } else if (item.iconType === "sun") {
      innerSvg = `
        <svg class="anim-sun" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5.5" fill="#FFF"/>
          <path d="M12 1V4M12 20V23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12H4M20 12H23M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke="#FFF" stroke-width="2.6" stroke-linecap="round"/>
        </svg>`;
    } else if (item.iconType === "water") {
      innerSvg = `
        <svg class="anim-water" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.69L6.5 10.2C4.33 13.18 4.78 17.29 7.55 19.76C10.15 22.08 13.85 22.08 16.45 19.76C19.22 17.29 19.67 13.18 17.5 10.2L12 2.69Z" fill="#FFF"/>
          <path d="M7 15C7.5 14 9.5 14 10.5 15C11.5 16 13.5 16 14.5 15C15.5 14 16.5 14.5 17 15" stroke="#477FA8" stroke-width="2" stroke-linecap="round"/>
        </svg>`;
    } else if (item.iconType === "tree") {
      innerSvg = `
        <svg class="anim-tree" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22V14" stroke="#DDA15E" stroke-width="3" stroke-linecap="round"/>
          <path d="M12 3C8 3 5 6.5 5 10C5 12.8 7 14.5 9 15C8.5 16 11 16 12 16C13 16 15.5 16 15 15C17 14.5 19 12.8 19 10C19 6.5 16 3 12 3Z" fill="#FFF"/>
          <circle cx="12" cy="9" r="3" fill="#A8C96F"/>
        </svg>`;
    } else if (item.iconType === "waste") {
      innerSvg = `
        <svg class="anim-waste" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 7H20M10 11V17M14 11V17M5 7L6 20C6 20.5 6.5 21 7 21H17C17.5 21 18 20.5 18 20L19 7M9 7V4C9 3.5 9.5 3 10 3H14C14.5 3 15 3.5 15 4V7" stroke="#FFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    } else {
      innerSvg = `
        <svg class="anim-water" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.69L6.5 10.2C4.33 13.18 4.78 17.29 7.55 19.76C10.15 22.08 13.85 22.08 16.45 19.76C19.22 17.29 19.67 13.18 17.5 10.2L12 2.69Z" fill="#FFF"/>
        </svg>`;
    }

    const isCritical = (item.severity === "urgente");

    const html = `
      <div class="gamified-pin-root">
        <div class="pin-ground-shadow"></div>
        <div class="pin-ground-ripple" style="border-color:${item.color};"></div>
        <div class="floating-eco-badge" style="background:${item.color}; box-shadow: 0 8px 22px ${item.haloColor}, 0 2px 6px rgba(0,0,0,0.25);">
          <div class="badge-glossy-shine"></div>
          ${innerSvg}
          ${isCritical ? '<div class="badge-urgent-dot"></div>' : ''}
        </div>
      </div>
    `;

    const divIcon = L.divIcon({
      className: "custom-pin-root-wrap",
      html: html,
      iconSize: [52, 62],
      iconAnchor: [26, 56]
    });

    const marker = L.marker([item.lat, item.lon], { icon: divIcon });
    marker.on("click", () => openBottomSheet(item));

    return { item, marker };
  }

  function renderMarkers() {
    if (!map) return;
    markerInstances.forEach(m => map.removeLayer(m.marker));
    markerInstances = [];

    APP_DATA.mapaPuntos.forEach(item => {
      const matchLayer = (item.layer === currentLayerMode);
      const matchFilter = activeFilters[item.category];

      if (matchLayer && matchFilter) {
        const pinObj = buildEcoBadge(item);
        pinObj.marker.addTo(map);
        markerInstances.push(pinObj);
      }
    });
  }

  function switchLayerMode(mode) {
    currentLayerMode = mode;
    const btnAlertas = document.getElementById("tabAlertas");
    const btnImpacto = document.getElementById("tabImpacto");
    if (btnAlertas) btnAlertas.classList.toggle("active", mode === "alertas");
    if (btnImpacto) btnImpacto.classList.toggle("active", mode === "impacto");

    const hudControls = document.getElementById("hudRowControls");
    if (hudControls) {
      hudControls.classList.toggle("map-view-alertas", mode === "alertas");
      hudControls.classList.toggle("map-view-impacto", mode === "impacto");
    }

    renderMarkers();
    closeBottomSheet();

    if (mode === "alertas") {
      AppState.setAvatarSpeech("Mostrando alertas de riesgo en La Dorada (incendios, calor, río y residuos).");
    } else {
      AppState.setAvatarSpeech("¡Buenas acciones e impacto! Monitoreando árboles sembrados y oasis comunitarios.");
    }
  }

  function toggleFilter(category) {
    activeFilters[category] = !activeFilters[category];
    const chip = document.querySelector(`.filter-chip-bubble[data-cat="${category}"]`);
    if (chip) chip.classList.toggle("active", activeFilters[category]);
    renderMarkers();
  }

  function openBottomSheet(item) {
    currentSelectedAlert = item;
    const sheet = document.getElementById("bottomSheet");
    if (!sheet) return;

    // Ocultar mascota flotante para que NO obstruya los botones de acción
    const companion = document.getElementById("companionWidget");
    if (companion) companion.style.display = "none";

    const badge = document.getElementById("sheetBadge");
    badge.className = `sheet-badge-cat ${item.severity}`;
    badge.innerText = item.severityLabel;

    document.getElementById("sheetTitle").innerText = item.title;
    document.getElementById("sheetLocationText").innerText = item.location;
    document.getElementById("sheetDesc").innerText = item.desc;
    document.getElementById("sheetConfirms").innerText = item.confirmations;
    document.getElementById("sheetTime").innerText = item.timeAgo;
    document.getElementById("sheetStatus").innerText = item.status;

    const confirmBtn = document.getElementById("btnConfirmCommunity");
    const emergencyBtn = document.getElementById("btnCallBomberos");
    const followBtn = document.getElementById("btnFollowZone");
    const followText = document.getElementById("followZoneText");
    const isFollowed = followedZones.has(item.location);

    if (followBtn) {
      followBtn.classList.toggle("following", isFollowed);
    }
    if (followText) {
      followText.innerText = isFollowed ? "✓ Siguiendo avisos de esta zona" : "Seguir Zona (+Avisos Vecinales)";
    }

    if (item.layer === "impacto") {
      confirmBtn.className = "btn-action-primary";
      confirmBtn.style.background = "var(--verde-selva)";
      confirmBtn.innerHTML = `<i data-lucide="heart" style="width:16px; height:16px;"></i><span>¡Apoyar esta Buena Acción! (+15 🌱)</span>`;
      if (emergencyBtn) emergencyBtn.style.display = "none";
    } else {
      confirmBtn.className = "btn-action-primary";
      confirmBtn.style.background = "";
      confirmBtn.innerHTML = `<i data-lucide="check-circle" style="width:16px; height:16px;"></i><span>Lo veo también (+1 confirmación)</span>`;
      if (emergencyBtn) emergencyBtn.style.display = "flex";
    }

    // Desplazamiento vertical offset para que el pin quede en la parte superior visible
    const offsetLat = 0.0075;
    map.flyTo([item.lat + offsetLat, item.lon], 15, { duration: 0.75 });

    sheet.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }

  function closeBottomSheet() {
    const sheet = document.getElementById("bottomSheet");
    if (sheet) sheet.classList.remove("open");
    currentSelectedAlert = null;

    // Restaurar mascota flotante al cerrar la hoja
    const companion = document.getElementById("companionWidget");
    if (companion) companion.style.display = "flex";
  }

  function toggleFollowZone() {
    if (!currentSelectedAlert) return;
    const loc = currentSelectedAlert.location;
    const followBtn = document.getElementById("btnFollowZone");
    const followText = document.getElementById("followZoneText");

    if (followedZones.has(loc)) {
      followedZones.delete(loc);
      if (followBtn) followBtn.classList.remove("following");
      if (followText) followText.innerText = "Seguir Zona (+Avisos Vecinales)";
      AppVoice.showToast(`Dejaste de seguir avisos de ${loc}`);
    } else {
      followedZones.add(loc);
      if (followBtn) followBtn.classList.add("following");
      if (followText) followText.innerText = "✓ Siguiendo avisos de esta zona";
      AppVoice.showToast(`¡Suscrito a avisos vecinales de ${loc}! 🔔`);
      AppVoice.speakMessage(`Ahora recibirás notificaciones tempranas sobre ${loc}.`);
    }
    if (window.lucide) lucide.createIcons();
  }

  function confirmCommunity() {
    if (!currentSelectedAlert) return;
    const confirmBtn = document.getElementById("btnConfirmCommunity");
    if (confirmBtn && confirmBtn.classList.contains("confirmed")) {
      AppVoice.showToast("Ya apoyaste este reporte ciudadano 👍");
      return;
    }

    currentSelectedAlert.confirmations += 1;
    document.getElementById("sheetConfirms").innerText = currentSelectedAlert.confirmations;

    if (confirmBtn) {
      confirmBtn.classList.add("confirmed");
      if (currentSelectedAlert.layer === "impacto") {
        confirmBtn.innerHTML = `<i data-lucide="heart" style="width:16px; height:16px; fill:#fff;"></i><span>¡Acción apoyada por ti! (+15 🌱)</span>`;
      } else {
        confirmBtn.innerHTML = `<i data-lucide="check" style="width:16px; height:16px;"></i><span>¡Validado por ti! (+15 🌱)</span>`;
      }
    }

    const isImpact = (currentSelectedAlert.layer === "impacto");
    AppState.addSemillas(15, isImpact ? "Apoyo a buena acción comunitaria" : "Validación ciudadana de alerta");
    if (isImpact) {
      AppState.setAvatarSpeech("¡Excelente! Al respaldar buenas acciones fortalecemos el cuidado colectivo del territorio.");
    } else {
      AppState.setAvatarSpeech("¡Gracias! Con tu confirmación la alerta sube de prioridad para los bomberos (+15 semillas).");
    }
    if (window.lucide) lucide.createIcons();
  }

  function centerOnTown() {
    if (map) {
      map.flyTo(centerLaDorada, 14, { duration: 0.85 });
      AppState.setAvatarSpeech("Mapa recentrado en el corazón de La Dorada, Caldas.");
    }
  }

  function toggleBasemapDropdown() {
    const menu = document.getElementById("basemapMenu");
    if (menu) menu.classList.toggle("open");
  }

  function switchBaseMap(type) {
    if (!map || !baseLayers[type]) return;
    document.querySelectorAll(".basemap-item-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`btnBase${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (activeBtn) activeBtn.classList.add("active");

    map.removeLayer(activeBaseLayer);
    activeBaseLayer = baseLayers[type];
    activeBaseLayer.addTo(map);
    document.getElementById("basemapMenu").classList.remove("open");
  }

  function addNewAlert(newAlert) {
    APP_DATA.mapaPuntos.unshift(newAlert);
    if (newAlert.layer === "impacto") {
      switchLayerMode("impacto");
    } else {
      if (currentLayerMode !== "alertas") {
        switchLayerMode("alertas");
      } else {
        renderMarkers();
      }
    }
    openBottomSheet(newAlert);
  }

  function invalidateSize() {
    if (map) {
      map.invalidateSize();
    } else {
      ensureMapCreated();
    }
  }

  return {
    init,
    ensureMapCreated,
    invalidateSize,
    switchLayerMode,
    toggleFilter,
    openBottomSheet,
    closeBottomSheet,
    toggleFollowZone,
    confirmCommunity,
    centerOnTown,
    toggleBasemapDropdown,
    switchBaseMap,
    addNewAlert
  };
})();

window.AppMap = AppMap;

