/**
 * MÓDULO DE VOZ Y ACCESIBILIDAD INCLUSIVA
 * Asistente de fauna local y síntesis de voz en español
 */

const AppVoice = (() => {
  let isSpeaking = false;
  let bubbleVisible = false;
  let autoHideTimeout = null;

  function init() {
    updateCompanionUI();

    AppState.subscribe((event) => {
      if (event === "AVATAR_CHANGED" || event === "SPEECH_CHANGED") {
        updateCompanionUI();
        showBubble(5000);
      }
    });

    const companionBubble = document.getElementById("companionBubble");
    if (companionBubble) {
      companionBubble.addEventListener("click", () => {
        const speechBox = document.getElementById("companionBubbleText");
        const isHidden = !speechBox || speechBox.style.display === "none" || window.getComputedStyle(speechBox).display === "none";
        if (isHidden) {
          showBubble(5000);
          speakCurrentMessage();
        } else {
          cycleNextAvatar();
        }
      });
    }

    const speechText = document.getElementById("speechText");
    if (speechText) {
      speechText.addEventListener("click", speakCurrentMessage);
    }
  }

  function updateCompanionUI() {
    const state = AppState.getState();
    const avatar = state.avatarActivo;

    const imgEl = document.getElementById("companionImg");
    const textEl = document.getElementById("speechText");

    if (imgEl) {
      imgEl.src = avatar.img;
      imgEl.onerror = () => { imgEl.src = avatar.fallback; };
    }

    if (textEl) {
      textEl.innerText = `"${avatar.dialogoActual}"`;
    }
  }

  function hideBubble(event) {
    if (event) event.stopPropagation();
    if (autoHideTimeout) clearTimeout(autoHideTimeout);
    const speechBox = document.getElementById("companionBubbleText");
    if (speechBox) {
      speechBox.style.display = "none";
      bubbleVisible = false;
    }
    const zzzBadge = document.getElementById("companionZzz");
    if (zzzBadge) zzzBadge.style.display = "flex";
  }

  function showBubble(autoHideMs = 5000) {
    const speechBox = document.getElementById("companionBubbleText");
    if (speechBox) {
      speechBox.style.display = "flex";
      bubbleVisible = true;
      if (autoHideTimeout) clearTimeout(autoHideTimeout);
      if (autoHideMs > 0) {
        autoHideTimeout = setTimeout(() => {
          hideBubble();
        }, autoHideMs);
      }
    }
    const zzzBadge = document.getElementById("companionZzz");
    if (zzzBadge) zzzBadge.style.display = "none";
  }

  function cycleNextAvatar() {
    const state = AppState.getState();
    const currentId = state.avatarActivo.id;
    const allAvatares = APP_DATA.avatares;
    const currentIndex = allAvatares.findIndex(a => a.id === currentId);
    const nextIndex = (currentIndex + 1) % allAvatares.length;
    const nextAvatar = allAvatares[nextIndex];

    AppState.setAvatar(nextAvatar);
    showBubble();
    speakMessage(`¡Hola! Ahora te acompaña ${nextAvatar.nombre}, ${nextAvatar.rol}.`);
  }

  function speakCurrentMessage() {
    const state = AppState.getState();
    speakMessage(state.avatarActivo.dialogoActual);
  }

  function speakMessage(text) {
    if (!("speechSynthesis" in window)) {
      console.warn("Web Speech API no disponible en este navegador");
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/"/g, "")
                          .replace(/🌱/g, "semillas")
                          .replace(/🔥/g, "fuego")
                          .replace(/💧/g, "agua")
                          .replace(/☀️/g, "calor");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "es-CO";
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => { isSpeaking = true; };
    utterance.onend = () => { isSpeaking = false; };
    utterance.onerror = () => { isSpeaking = false; };

    window.speechSynthesis.speak(utterance);
  }

  function readScreenAloud() {
    const state = AppState.getState();
    const screen = state.pantallaActual;

    let narration = "";
    if (screen === "inicio") {
      narration = "Estás en el Inicio Comunitario de IMA. La Dorada reporta temperatura de 41 grados bajo el fenómeno de El Niño. Hay 4 publicaciones activas y opciones para reportar alertas o aprender.";
    } else if (screen === "mapa") {
      narration = "Estás en el Mapa Interactivo de La Dorada en IMA. Se monitorean 4 alertas de riesgo: conflagración en Vereda Concordia, estrés térmico en Alfonso López, y descenso hídrico en Río Guarinó. Además, hay dos zonas de impacto con siembra comunitaria en Bucamba.";
    } else if (screen === "retos") {
      narration = `Estás en la sección de Retos y Misiones. La comunidad acumula ${state.gamificacion.semillas} semillas colectivas, equivalentes a ${state.gamificacion.arbolesSembrados} árboles nativos reales sembrados en Bucamba. Puedes completar misiones con verificación.`;
    } else if (screen === "perfil") {
      narration = `Perfil de Guardián Territorial en ${state.usuario.municipio}. Tu mascota activa es ${state.avatarActivo.nombreBautizado}. Llevas acumuladas ${state.gamificacion.semillas} semillas colectivas y ${state.gamificacion.arbolesSembrados} árboles sembrados.`;
    } else if (screen === "reels") {
      narration = "Estás en la sección de Reels. Videos cortos educativos sobre el Río Magdalena y prevención de incendios en las veredas de Caldas.";
    } else {
      narration = "IMA: Plataforma Comunitaria e Inteligencia Colectiva del Magdalena Caldense frente al fenómeno de El Niño.";
    }

    speakMessage(narration);
  }

  function toggleHighContrast() {
    const isContrast = document.body.classList.toggle("high-contrast");
    showToast(isContrast ? "Alto contraste activado 👁️" : "Contraste normal restablecido");
    return isContrast;
  }

  function setFontSize(size) {
    document.body.classList.remove("font-large", "font-extra-large");
    if (size === "large") {
      document.body.classList.add("font-large");
      showToast("Tamaño de texto: Grande (+12%)");
    } else if (size === "extra") {
      document.body.classList.add("font-extra-large");
      showToast("Tamaño de texto: Extra Grande (+25%)");
    } else {
      showToast("Tamaño de texto: Estándar");
    }
  }

  function showToast(message) {
    let toast = document.getElementById("globalAppToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "globalAppToast";
      toast.className = "toast-floating-banner";
      const frame = document.querySelector(".smartphone-frame") || document.body;
      frame.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  return {
    init,
    speakMessage,
    speakCurrentMessage,
    cycleNextAvatar,
    hideBubble,
    showBubble,
    readScreenAloud,
    toggleHighContrast,
    setFontSize,
    showToast
  };
})();

window.AppVoice = AppVoice;

