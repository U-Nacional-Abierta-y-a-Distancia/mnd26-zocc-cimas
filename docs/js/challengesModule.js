/**
 * MÓDULO DE RETOS Y GAMIFICACIÓN AMBIENTAL
 * Misiones frente a «El Niño», validación educativa y recompensas de semillas
 */

const AppChallenges = (() => {
  let activeChallengeInModal = null;
  let selectedOptionIndex = null;

  function init() {
    renderChallenges();
    updateSeedsBanner();

    AppState.subscribe((event) => {
      if (event === "SEMILLAS_UPDATED" || event === "ARBOLES_UPDATED") {
        updateSeedsBanner();
      }
    });
  }

  function updateSeedsBanner() {
    const bannerTotal = document.getElementById("totalSeedsDisplay");
    const treesTotal = document.getElementById("totalTreesDisplay");
    const state = AppState.getState();

    if (bannerTotal) bannerTotal.innerText = state.gamificacion.semillas;
    if (treesTotal) treesTotal.innerText = state.gamificacion.arbolesSembrados;
  }

  function renderChallenges() {
    const list = document.getElementById("challengesListContainer");
    if (!list) return;

    list.innerHTML = "";

    APP_DATA.retos.forEach(reto => {
      const card = document.createElement("div");
      card.className = "challenge-card";
      card.id = reto.id;

      let actionBtnHtml = "";
      if (reto.completado) {
        actionBtnHtml = `
          <button class="btn-primary" style="background:#2b7a38; cursor:default; padding:8px 14px; font-size:0.75rem;">
            ✅ Misión Cumplida
          </button>
        `;
      } else {
        actionBtnHtml = `
          <button class="btn-primary" style="padding:8px 14px; font-size:0.75rem;" onclick="AppChallenges.openChallengeDetail('${reto.id}')">
            Detalles & Validar (+${reto.semillas} 🌱)
          </button>
        `;
      }

      card.innerHTML = `
        <div class="challenge-card-header" style="cursor:pointer;" onclick="AppChallenges.openChallengeDetail('${reto.id}')">
          <div class="challenge-title-group">
            <div class="challenge-icon-box" style="background:${reto.color}20; color:${reto.color};">
              <span>${reto.icono}</span>
            </div>
            <div style="min-width:0; flex:1;">
              <h3 style="font-size:0.88rem; font-weight:800; color:var(--texto-oscuro); margin:0;">${reto.titulo}</h3>
              <span style="font-size:0.7rem; color:var(--texto-mutado); font-weight:700;">${reto.categoria}</span>
            </div>
          </div>
          <span class="reward-tag-pill">+${reto.semillas} 🌱</span>
        </div>

        <p style="font-size:0.78rem; color:var(--texto-oscuro); line-height:1.45;">${reto.subtitulo}</p>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.68rem; font-weight:700; margin-bottom:4px; color:var(--texto-mutado);">
            <span>Progreso comunitario en La Dorada</span>
            <span>${reto.progreso}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${reto.progreso}%; background:${reto.color};"></div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <span style="font-size:0.72rem; font-weight:700; color:var(--verde-selva);">${reto.metaTexto}</span>
          ${actionBtnHtml}
        </div>
      `;

      list.appendChild(card);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function openChallengeDetail(id) {
    const reto = APP_DATA.retos.find(r => r.id === id);
    if (!reto) return;

    activeChallengeInModal = reto;
    selectedOptionIndex = null;

    const modal = document.getElementById("challengeDetailModalOverlay");
    if (!modal) return;

    document.getElementById("modalChallengeIcon").innerText = reto.icono;
    document.getElementById("modalChallengeTitle").innerText = reto.titulo;
    document.getElementById("modalChallengeCategory").innerText = reto.categoria;
    document.getElementById("modalChallengeReward").innerText = `+${reto.semillas} 🌱`;
    document.getElementById("modalChallengeDesc").innerText = reto.descripcionDetallada;

    // Pasos / Requisitos
    const stepsList = document.getElementById("modalChallengeSteps");
    if (stepsList) {
      stepsList.innerHTML = reto.pasos.map((p, idx) => `
        <div style="display:flex; align-items:flex-start; gap:8px; font-size:0.75rem; color:var(--texto-oscuro); line-height:1.35;">
          <span style="background:var(--verde-fondo); color:var(--verde-selva); border-radius:50%; width:18px; height:18px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.65rem; flex-shrink:0;">${idx+1}</span>
          <span>${p}</span>
        </div>
      `).join("");
    }

    // Sección de verificación interactiva
    const quizBox = document.getElementById("modalChallengeQuizBox");
    const feedbackBox = document.getElementById("modalChallengeFeedback");
    const actionBtn = document.getElementById("btnVerifyChallengeAction");

    if (feedbackBox) feedbackBox.style.display = "none";

    if (reto.completado) {
      if (quizBox) {
        quizBox.innerHTML = `
          <div style="background:#f0f8e8; border:1px solid rgba(111,158,69,0.3); border-radius:12px; padding:12px; text-align:center;">
            <span style="font-size:24px;">🏆</span>
            <h4 style="font-size:0.84rem; font-weight:800; color:var(--verde-selva); margin-top:4px;">¡Misión Completada y Verificada!</h4>
            <p style="font-size:0.72rem; color:var(--texto-secundario); margin-top:2px;">Tus semillas ya fueron sumadas a la meta de siembra de árboles en Bucamba.</p>
          </div>
        `;
      }
      if (actionBtn) {
        actionBtn.style.display = "none";
      }
    } else {
      if (quizBox) {
        quizBox.innerHTML = `
          <div style="background:#fff; border:1.5px solid var(--borde-suave); border-radius:14px; padding:12px;">
            <label style="font-size:0.74rem; font-weight:800; color:var(--verde-selva); display:block; margin-bottom:6px;">
              📝 Verificación Comunitaria:
            </label>
            <p style="font-size:0.75rem; font-weight:600; color:var(--texto-oscuro); margin-bottom:10px; line-height:1.35;">
              ${reto.preguntaValidacion}
            </p>
            <div id="quizOptionsList" style="display:flex; flex-direction:column; gap:8px;">
              ${reto.opciones.map((opt, i) => `
                <div class="quiz-option-pill" onclick="AppChallenges.selectOption(${i})" data-index="${i}" style="border:1.5px solid var(--borde-suave); border-radius:12px; padding:9px 12px; font-size:0.74rem; cursor:pointer; transition:var(--trans-suave); background:var(--marfil); display:flex; align-items:center; gap:8px;">
                  <span class="quiz-radio-circle" style="width:14px; height:14px; border-radius:50%; border:2px solid var(--texto-mutado); display:inline-block; flex-shrink:0;"></span>
                  <span>${opt}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
      if (actionBtn) {
        actionBtn.style.display = "block";
        actionBtn.innerText = `Validar Cumplimiento & Reclamar (+${reto.semillas} 🌱)`;
        actionBtn.disabled = true;
        actionBtn.style.opacity = "0.5";
      }
    }

    modal.classList.add("open");
    if (window.lucide) lucide.createIcons();
  }

  function selectOption(index) {
    selectedOptionIndex = index;
    document.querySelectorAll(".quiz-option-pill").forEach(pill => {
      const isSelected = parseInt(pill.dataset.index) === index;
      pill.style.borderColor = isSelected ? "var(--verde-selva)" : "var(--borde-suave)";
      pill.style.background = isSelected ? "#f0f8e8" : "var(--marfil)";
      const circle = pill.querySelector(".quiz-radio-circle");
      if (circle) {
        circle.style.borderColor = isSelected ? "var(--verde-selva)" : "var(--texto-mutado)";
        circle.style.background = isSelected ? "var(--verde-selva)" : "transparent";
      }
    });

    const actionBtn = document.getElementById("btnVerifyChallengeAction");
    if (actionBtn) {
      actionBtn.disabled = false;
      actionBtn.style.opacity = "1";
    }
  }

  function submitVerification() {
    if (!activeChallengeInModal || selectedOptionIndex === null) return;

    const feedbackBox = document.getElementById("modalChallengeFeedback");
    const isCorrect = selectedOptionIndex === activeChallengeInModal.respuestaCorrecta;

    if (isCorrect) {
      activeChallengeInModal.completado = true;
      activeChallengeInModal.progreso = 100;
      activeChallengeInModal.metaTexto = "Completado";

      // Disparar confeti de celebración comunitaria
      if (window.confetti) {
        window.confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#356B3E", "#6F9E45", "#E5A72F", "#8DC8C5", "#F5EFD8"]
        });
      }

      AppState.addSemillas(activeChallengeInModal.semillas, `Reto superado con verificación: ${activeChallengeInModal.titulo}`);
      renderChallenges();

      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.style.background = "#eaf5dc";
        feedbackBox.style.color = "var(--verde-selva)";
        feedbackBox.style.border = "1px solid rgba(53,107,62,0.3)";
        feedbackBox.innerHTML = `
          <strong>🎉 ¡Excelente validación comunitaria!</strong><br>
          ${activeChallengeInModal.explicacionRespuesta}
        `;
      }

      const actionBtn = document.getElementById("btnVerifyChallengeAction");
      if (actionBtn) {
        actionBtn.innerText = "✅ Misión Completada";
        actionBtn.style.background = "#2b7a38";
        actionBtn.disabled = true;
      }

      AppVoice.speakMessage(`¡Excelente validación! Superaste la misión y sumaste ${activeChallengeInModal.semillas} semillas para sembrar árboles en La Dorada.`);

      setTimeout(() => {
        closeChallengeModal();
      }, 2600);

    } else {
      if (feedbackBox) {
        feedbackBox.style.display = "block";
        feedbackBox.style.background = "#fff0f0";
        feedbackBox.style.color = "var(--rojo-fuego)";
        feedbackBox.style.border = "1px solid rgba(230,57,70,0.3)";
        feedbackBox.innerHTML = `
          <strong>⚠️ Respuesta no preventiva:</strong><br>
          Esa medida no es recomendada frente a El Niño. Revisa los pasos recomendados e intenta de nuevo.
        `;
      }
      AppVoice.speakMessage("Esa opción no es la más segura. Por favor revisa las recomendaciones de prevención.");
    }
  }

  function closeChallengeModal() {
    const modal = document.getElementById("challengeDetailModalOverlay");
    if (modal) modal.classList.remove("open");
    activeChallengeInModal = null;
    selectedOptionIndex = null;
  }

  return {
    init,
    renderChallenges,
    openChallengeDetail,
    selectOption,
    submitVerification,
    closeChallengeModal
  };
})();

window.AppChallenges = AppChallenges;
