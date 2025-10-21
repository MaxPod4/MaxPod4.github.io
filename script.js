// 🖱️ Handle double-click behavior on desktop icons
document.querySelectorAll('.icon').forEach(icon => {
  let clickTimer = null;

  icon.addEventListener('click', () => {
    // Remove 'selected' from all icons
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    // Highlight this icon
    icon.classList.add('selected');
  });

  icon.addEventListener('dblclick', () => {
    const link = icon.dataset.link;
    if (link) {
      // Simulate "opening" the folder — navigate to that page
      window.location.href = link;
    }
  });
});
