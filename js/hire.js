// 🧭 Tab Switching
const tabs = document.querySelectorAll('.xp-tabs .tab');
const sections = document.querySelectorAll('.tab-section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Reset all tabs + sections
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Activate the clicked tab + section
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// 🪩 Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    if (!img.complete || img.naturalWidth === 0) return; // ✅ prevents broken images from triggering
    lightboxImg.src = img.src;
    lightbox.removeAttribute('hidden');
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.setAttribute('hidden', '');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') lightbox.setAttribute('hidden', '');
});
