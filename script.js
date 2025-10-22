// Handle icon selection + open (single click highlight, double click opens)
const icons = document.querySelectorAll('.icon');

icons.forEach(icon => {
  // Click selects
  icon.addEventListener('click', () => {
    icons.forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
  });

  // Double click opens link
  icon.addEventListener('dblclick', () => {
    const link = icon.dataset.link;
    if (link) {
      window.location.href = link;
    }
  });
});

// Click empty desktop = clear selection
document.addEventListener('click', (e) => {
  if (!e.target.closest('.icon')) {
    icons.forEach(i => i.classList.remove('selected'));
  }
});
