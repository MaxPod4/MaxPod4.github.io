// 🧭 XP Tab Switching
const tabs = document.querySelectorAll('.xp-tabs .tab');
const sections = document.querySelectorAll('.tab-section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // reset all tabs + sections
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // activate clicked tab + section
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// 🪩 Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

// safety: hide on load
lightbox.setAttribute('hidden', '');

// add click handlers for valid images only
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    // skip if image missing or broken
    if (!img.complete || img.naturalWidth === 0) return;

    // set image + show overlay
    lightboxImg.src = img.src;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  });
});

// close when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lightboxImg.src = ''; // reset img
  }
});

// close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }
});
