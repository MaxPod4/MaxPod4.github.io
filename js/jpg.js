// 🪩 Lightbox for JPG gallery
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // safety

  const lightboxImg = lightbox.querySelector('img');

  // hide on load
  lightbox.setAttribute('hidden', '');

  // add click handlers to all gallery images
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      // skip if image is broken / not loaded
      if (!img.complete || img.naturalWidth === 0) return;

      lightboxImg.src = img.src;
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden'; // prevent background scroll
    });
  });

  // helper to close lightbox
  const closeLightbox = () => {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  // close when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
});
