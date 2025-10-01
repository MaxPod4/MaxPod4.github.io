document.querySelectorAll('.icon').forEach(icon => {
  let clickTimer = null;

  icon.addEventListener('click', () => {
    if (clickTimer === null) {
      clickTimer = setTimeout(() => {
        clickTimer = null;
      }, 250);
    } else {
      clearTimeout(clickTimer);
      clickTimer = null;
      const link = icon.getAttribute('data-link');
      window.location.href = link;
    }
  });
});
