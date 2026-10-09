/**
 * NAVEGACIÓN Y ENRUTADOR SPA FLUIDO
 * Transiciones suaves con GSAP y gestión de visibilidad de pantallas
 */

const AppNavigation = (() => {
  const screens = {
    onboarding: "screenOnboarding",
    inicio: "screenInicio",
    reels: "screenReels",
    mapa: "screenMapa",
    retos: "screenRetos",
    perfil: "screenPerfil"
  };

  let currentScreenId = "inicio";

  function init() {
    // Configurar listeners de la barra inferior
    document.querySelectorAll(".tab-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.screen;
        if (target) {
          navigateTo(target);
        }
      });
    });

    // Escuchar cambios de estado
    AppState.subscribe((event, data) => {
      if (event === "SCREEN_CHANGED" && data !== currentScreenId) {
        navigateTo(data, false);
      }
    });

    // Mostrar pantalla inicial
    navigateTo(currentScreenId, false);
  }

  function navigateTo(screenName, updateState = true) {
    if (!screens[screenName]) return;

    const prevEl = document.getElementById(screens[currentScreenId]);
    const nextEl = document.getElementById(screens[screenName]);

    if (!nextEl) return;

    // Actualizar estado si fue llamada externa
    if (updateState) {
      AppState.setPantalla(screenName);
    }

    // Gestionar reproducción de videos de Reels al salir
    if (currentScreenId === "reels" && screenName !== "reels") {
      const activeVideo = document.querySelector("#screenReels video");
      if (activeVideo) activeVideo.pause();
    } else if (screenName === "reels") {
      const activeVideo = document.querySelector("#screenReels video");
      if (activeVideo) activeVideo.play().catch(() => {});
    }

    // Gestionar redimensionamiento del mapa Leaflet
    if (screenName === "mapa") {
      setTimeout(() => {
        if (window.AppMap && window.AppMap.invalidateSize) {
          window.AppMap.invalidateSize();
        }
      }, 150);
    }

    // Actualizar estado visual de los tabs inferiores
    document.querySelectorAll(".tab-nav-btn").forEach(btn => {
      const isTarget = btn.dataset.screen === screenName;
      btn.classList.toggle("active", isTarget);
      const indicator = btn.querySelector(".tab-active-indicator");
      if (indicator) indicator.style.display = isTarget ? "block" : "none";
    });

    // Ocultar dock inferior en onboarding
    const tabDock = document.getElementById("bottomTabDock");
    if (tabDock) {
      tabDock.style.display = (screenName === "onboarding") ? "none" : "flex";
    }

    // Ocultar widget del acompañante en reels para no tapar el video
    const companionWidget = document.getElementById("companionWidget");
    if (companionWidget) {
      companionWidget.style.display = (screenName === "reels" || screenName === "onboarding") ? "none" : "flex";
    }

    // Transición fluida con GSAP
    const onScreenShown = () => {
      if (screenName === "mapa" && window.AppMap) {
        window.AppMap.ensureMapCreated();
        setTimeout(() => {
          window.AppMap.invalidateSize();
        }, 120);
      }
    };

    if (prevEl && prevEl !== nextEl) {
      if (window.gsap) {
        gsap.to(prevEl, {
          opacity: 0,
          y: -8,
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            prevEl.classList.remove("active");
            prevEl.style.display = "none";
            nextEl.style.display = "flex";
            nextEl.classList.add("active");
            onScreenShown();
            gsap.fromTo(nextEl, 
              { opacity: 0, y: 10 }, 
              { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
            );
          }
        });
      } else {
        prevEl.classList.remove("active");
        prevEl.style.display = "none";
        nextEl.style.display = "flex";
        nextEl.classList.add("active");
        onScreenShown();
      }
    } else {
      nextEl.style.display = "flex";
      nextEl.classList.add("active");
      onScreenShown();
      if (window.gsap) {
        gsap.fromTo(nextEl, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
    }

    currentScreenId = screenName;
  }

  return {
    init,
    navigateTo
  };
})();

window.AppNavigation = AppNavigation;

