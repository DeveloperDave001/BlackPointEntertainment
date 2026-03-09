// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initBookingPage();
});

function initBookingPage() {
  initHeroAnimation();
  initServiceSelection();
  initBudgetOptions();
  initUrgencyOptions();
  initFormSteps();
  initFormNavigation();
  initFormSubmission();
}

function initHeroAnimation() {
  const heroTl = gsap.timeline({ delay: 0.3 });

  gsap.set('#bookingHeroBg img', { scale: 1.1, opacity: 0 });
  gsap.set('#bookingHeroText > *', { y: 40, opacity: 0 });
  gsap.set('#scrollIndicator', { y: 20, opacity: 0 });

  heroTl
    .to('#bookingHeroBg img', { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' })
    .to('#bookingHeroText > *', { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=1')
    .to('#scrollIndicator', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.5');

  gsap.to('#scrollIndicator', {
    y: 10,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  gsap.fromTo('#serviceSelection',
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#serviceSelection',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

function initServiceSelection() {
  const serviceCards = document.querySelectorAll('.service-card');
  const selectedServiceInput = document.getElementById('selectedService');
  const summaryServices = document.getElementById('summaryServices');
  const formSteps = document.querySelectorAll('.form-step');

  const serviceNames = {
    'recording': 'Recording Session',
    'live': 'Live Session',
    'rehearsal': 'Rehearsal Session',
    'mixing': 'Mixing Session',
    'mastering': 'Mastering Session',
    'photo': 'Photo Shoot Session',
    'podcast': 'Podcast Session'
  };

  // Check URL parameter for pre-selected session
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedSession = urlParams.get('session');
  
  if (preSelectedSession && serviceNames[preSelectedSession]) {
    const preSelectedCard = document.querySelector(`.service-card[data-service="${preSelectedSession}"]`);
    if (preSelectedCard) {
      preSelectedCard.classList.add('selected');
      selectedServiceInput.value = preSelectedSession;
      summaryServices.innerHTML = `<span class="summary-tag">${serviceNames[preSelectedSession]}</span>`;
      
      // Auto-advance to step 2
      setTimeout(() => {
        window.goToStep(2);
      }, 500);
    }
  }

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const service = card.dataset.service;
      selectedServiceInput.value = service;

      summaryServices.innerHTML = `<span class="summary-tag">${serviceNames[service]}</span>`;

      document.getElementById('summaryBudget').textContent = '—';

      gsap.fromTo('.summary-tag',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    });
  });
}

function initBudgetOptions() {
  const budgetBtns = document.querySelectorAll('.budget-btn');
  const selectedBudgetInput = document.getElementById('selectedBudget');
  const summaryBudget = document.getElementById('summaryBudget');

  budgetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      budgetBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const budget = btn.dataset.budget;
      selectedBudgetInput.value = budget;
      summaryBudget.textContent = budget;

      gsap.fromTo(summaryBudget,
        { scale: 1.2, color: '#B91C1C' },
        { scale: 1, color: '#F4F4F4', duration: 0.3 }
      );
    });
  });
}

function initUrgencyOptions() {
  const urgencyBtns = document.querySelectorAll('.urgency-btn');
  const selectedUrgencyInput = document.getElementById('selectedUrgency');

  urgencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      urgencyBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      selectedUrgencyInput.value = btn.dataset.urgency;
    });
  });
}

function initFormSteps() {
  const form = document.getElementById('bookingFormElement');
  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  let currentStep = 1;

  window.getCurrentStep = () => currentStep;

  window.goToStep = (step) => {
    if (step < 1 || step > steps.length) return;

    steps.forEach((s, i) => {
      s.classList.toggle('active', i + 1 === step);
    });

    progressSteps.forEach((p, i) => {
      p.classList.remove('active', 'completed');
      if (i + 1 < step) {
        p.classList.add('completed');
      } else if (i + 1 === step) {
        p.classList.add('active');
      }
    });

    currentStep = step;

    animateStepIn(step);
    updateNavigationButtons();
  };

  function animateStepIn(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    gsap.fromTo(stepEl.querySelectorAll('*'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );
  }

  window.validateStep = (step) => {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = stepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ff4444';
        setTimeout(() => {
          field.style.borderColor = '';
        }, 2000);
      }
    });

    if (step === 1) {
      const service = document.getElementById('selectedService').value;
      if (!service) {
        isValid = false;
        gsap.fromTo('#serviceGrid',
          { x: -10 },
          { x: 10, duration: 0.1, repeat: 3, yoyo: true }
        );
      }
    }

    if (step === 2) {
      const budget = document.getElementById('selectedBudget').value;
      if (!budget) {
        isValid = false;
        gsap.fromTo('#budgetOptions',
          { x: -10 },
          { x: 10, duration: 0.1, repeat: 3, yoyo: true }
        );
      }
    }

    return isValid;
  };
}

function initFormNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const totalSteps = 4;

  window.updateNavigationButtons = () => {
    const currentStep = window.getCurrentStep();

    prevBtn.disabled = currentStep === 1;

    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  };

  prevBtn.addEventListener('click', () => {
    const currentStep = window.getCurrentStep();
    if (currentStep > 1) {
      window.goToStep(currentStep - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    const currentStep = window.getCurrentStep();
    if (window.validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        window.goToStep(currentStep + 1);
      }
    }
  });

  updateNavigationButtons();
}

function initFormSubmission() {
  const form = document.getElementById('bookingFormElement');
  const successOverlay = document.getElementById('successOverlay');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!window.validateStep(window.getCurrentStep())) {
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('Booking submission:', data);

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = `
      Sending...
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
    `;

    setTimeout(() => {
      successOverlay.classList.add('active');

      gsap.fromTo('.success-content > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo('.success-icon',
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.1 }
      );
    }, 1500);
  });
}

const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinning {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
