// Simple Preloader
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const mainWrapper = document.getElementById('mainWrapper');
  const progressFill = document.getElementById('progressFill');
  const loadingPercent = document.getElementById('loadingPercent');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Hide preloader and show main content
      setTimeout(() => {
        preloader.classList.add('hidden');
        mainWrapper.style.opacity = '1';
        
        // Initialize animations
        if (typeof initMainAnimations === 'function') {
          initMainAnimations();
        }
      }, 300);
    }
    progressFill.style.width = progress + '%';
    loadingPercent.textContent = Math.floor(progress) + '%';
  }, 100);

  // Backup: force hide after 3 seconds
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      clearInterval(interval);
      progressFill.style.width = '100%';
      loadingPercent.textContent = '100%';
      preloader.classList.add('hidden');
      mainWrapper.style.opacity = '1';
      if (typeof initMainAnimations === 'function') {
        initMainAnimations();
      }
    }
  }, 3000);
});
