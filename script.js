// Single-click highlight + double-click open
const icons = document.querySelectorAll('.icon');

icons.forEach(icon => {
  icon.addEventListener('click', () => {
    icons.forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
  });

  icon.addEventListener('dblclick', () => {
    const link = icon.dataset.link;
    if (link) {
      window.location.href = link;
    }
  });
});

// Click empty space clears selection
document.addEventListener('click', (e) => {
  if (!e.target.closest('.icon')) {
    icons.forEach(i => i.classList.remove('selected'));
  }
});
