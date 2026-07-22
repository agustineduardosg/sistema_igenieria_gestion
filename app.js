/**
 * ==========================================================================
 * INGENIERÍA EN SISTEMAS DE GESTIÓN ISG - LÓGICA DE LA LANDING PAGE
 * Diagnóstico interactivo, Menú Móvil Desplegable, Cotizador & WhatsApp
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuración Oficial de la Empresa
  const ISG_CONFIG = {
    whatsappNumber: '56966331435', // Número Oficial (+56 9 6633 1435)
    email: 'igca.gestion@gmail.com',
    instagramHandle: 'ingenieria_sistemas_gestion'
  };

  /* ==========================================================================
     1. MENÚ NAVEGACIÓN MÓVIL DESPLEGABLE (HAMBURGER TOGGLE)
     ========================================================================== */
  const mobileToggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('mobile-active');
      
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('mobile-active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // Cerrar menú al hacer clic en un enlace del menú
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('mobile-active')) {
          navMenu.classList.remove('mobile-active');
          const icon = mobileToggleBtn.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      });
    });

    // Cerrar menú al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        if (navMenu.classList.contains('mobile-active')) {
          navMenu.classList.remove('mobile-active');
          const icon = mobileToggleBtn.querySelector('i');
          if (icon) icon.className = 'fa-solid fa-bars';
        }
      }
    });
  }

  /* ==========================================================================
     2. HERRAMIENTA INTERACTIVA: QUIZ DE MADUREZ NORMATIVA
     ========================================================================== */
  const quizState = {
    currentStep: 1,
    totalSteps: 4,
    answers: {
      goal: '',
      documentation: '',
      timeline: '',
      team: ''
    },
    scores: {
      goal: 0,
      documentation: 0,
      timeline: 0,
      team: 0
    }
  };

  const steps = document.querySelectorAll('.quiz-step');
  const progressFill = document.querySelector('.quiz-progress-fill');
  const btnNext = document.getElementById('quiz-btn-next');
  const btnPrev = document.getElementById('quiz-btn-prev');

  // Inicializar selección de opciones
  document.querySelectorAll('.options-grid').forEach(grid => {
    grid.addEventListener('click', (e) => {
      const optionCard = e.target.closest('.option-card');
      if (!optionCard) return;

      // Desmarcar hermanos
      grid.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
      optionCard.classList.add('selected');

      // Guardar respuesta
      const stepIndex = grid.closest('.quiz-step').dataset.step;
      const val = optionCard.dataset.value;
      const score = parseInt(optionCard.dataset.score || '10');

      if (stepIndex === '1') {
        quizState.answers.goal = val;
        quizState.scores.goal = score;
      } else if (stepIndex === '2') {
        quizState.answers.documentation = val;
        quizState.scores.documentation = score;
      } else if (stepIndex === '3') {
        quizState.answers.timeline = val;
        quizState.scores.timeline = score;
      } else if (stepIndex === '4') {
        quizState.answers.team = val;
        quizState.scores.team = score;
      }

      if (btnNext) btnNext.disabled = false;
    });
  });

  // Controladores de navegación del Quiz
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (quizState.currentStep < quizState.totalSteps) {
        quizState.currentStep++;
        updateQuizView();
      } else {
        renderQuizResult();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (quizState.currentStep > 1) {
        quizState.currentStep--;
        updateQuizView();
      }
    });
  }

  function updateQuizView() {
    steps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.dataset.step) === quizState.currentStep) {
        step.classList.add('active');
      }
    });

    // Actualizar barra de progreso
    const progressPercent = (quizState.currentStep / quizState.totalSteps) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    // Botón previo
    if (btnPrev) btnPrev.style.visibility = quizState.currentStep > 1 ? 'visible' : 'hidden';

    // Texto del botón siguiente
    if (btnNext) {
      btnNext.innerText = quizState.currentStep === quizState.totalSteps ? 'Ver Mi Diagnóstico' : 'Siguiente Paso →';
    }
  }

  function renderQuizResult() {
    const totalScore = quizState.scores.goal + quizState.scores.documentation + quizState.scores.timeline + quizState.scores.team;
    
    // Ocultar formulario del quiz y mostrar resultado
    const container = document.getElementById('quiz-questions-container');
    if (container) container.style.display = 'none';
    const quizControls = document.querySelector('.quiz-controls');
    if (quizControls) quizControls.style.display = 'none';
    
    const resultCard = document.getElementById('quiz-result-card');
    if (resultCard) resultCard.style.display = 'block';

    const scoreNum = document.getElementById('result-score-num');
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');

    if (scoreNum) scoreNum.innerText = `${totalScore}%`;

    if (totalScore >= 75) {
      resultTitle.innerText = '¡Alto Nivel de Preparación!';
      resultDesc.innerText = 'Su organización cuenta con una excelente base estructural. Están listos para programar su Auditoría Interna o revisión final previa a la acreditación NCh 2728 / ISO.';
    } else if (totalScore >= 50) {
      resultTitle.innerText = 'Preparación Intermedia - Requiere Ajustes';
      resultDesc.innerText = 'Cuentan con avances, pero existen brechas documentales o de proceso que pueden generar observaciones. Recomendamos una asesoría de alineamiento previa.';
    } else {
      resultTitle.innerText = 'Requiere Implementación de Sistema de Gestión';
      resultDesc.innerText = 'Es necesario estructurar el Sistema de Gestión desde sus cimientos para garantizar el cumplimiento normativo sin observaciones ni reprocesos.';
    }

    // Configurar botón para enviar resultado a WhatsApp Oficial
    const btnSendWhatsApp = document.getElementById('btn-quiz-whatsapp');
    if (btnSendWhatsApp) {
      btnSendWhatsApp.addEventListener('click', () => {
        const msg = `Hola Ingeniería en Sistemas de Gestión ISG, realicé el Diagnóstico de Madurez en su página:\n\n📌 *Objetivo:* ${quizState.answers.goal}\n📄 *Estado Documental:* ${quizState.answers.documentation}\n⏱️ *Plazo Estimado:* ${quizState.answers.timeline}\n📊 *Puntaje Obtenido:* ${totalScore}%\n\nMe gustaría solicitar una evaluación previa con sus asesores.`;
        window.open(`https://wa.me/${ISG_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    }
  }

  /* ==========================================================================
     3. ACCORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Cerrar otros acordeones
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Abrir el actual si no estaba activo
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ==========================================================================
     4. CONTROL DEL MODAL DE COTIZACIÓN Y CONTACTO
     ========================================================================== */
  const modalOverlay = document.getElementById('modal-quote');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const normPref = btn.dataset.norm || '';
      if (normPref && document.getElementById('quote-norm')) {
        document.getElementById('quote-norm').value = normPref;
      }
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Manejo del envío del formulario de cotización a WhatsApp Oficial
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('quote-name').value.trim();
      const company = document.getElementById('quote-company').value.trim();
      const phone = document.getElementById('quote-phone').value.trim();
      const norm = document.getElementById('quote-norm').value;
      const message = document.getElementById('quote-message').value.trim();

      const waMsg = `*Solicitud de Asesoría / Cotización - ISG*\n\n📌 *Nombre:* ${name}\n🏢 *Empresa / OTEC:* ${company}\n📞 *Teléfono:* ${phone}\n📋 *Requerimiento:* ${norm}\n💬 *Detalles:* ${message || 'Sin mensaje adicional'}`;

      window.open(`https://wa.me/${ISG_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
      
      if (modalOverlay) modalOverlay.classList.remove('active');
      quoteForm.reset();
    });
  }

  /* ==========================================================================
     5. NAVEGACIÓN Y SCROLL SUAVE CON COMPENSACIÓN DE CABECERA
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
