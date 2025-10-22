/*************************************************
 * Desktop Icon Interaction + Start Menu + Clock
 *************************************************/

/* ---------- Helpers ---------- */
function openLink(link) {
  if (!link) return;
  window.location.href = link;
}

function closeAllStartMenus() {
  document.querySelectorAll('.start-menu').forEach(m => m.setAttribute('hidden', ''));
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.setAttribute('aria-expanded', 'false');
}

/* ---------- Icon selection + open (click / dblclick / keyboard / touch) ---------- */
const icons = Array.from(document.querySelectorAll('.icon'));

icons.forEach(icon => {
  // Single click: select (blue highlight)
  icon.addEventListener('click', (e) => {
    icons.forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    // Close start menu if open
    closeAllStartMenus();
  });

  // Double click: open target page
  icon.addEventListener('dblclick', () => {
    const link = icon.dataset.link;
    openLink(link);
  });

  // Keyboard: Enter / Space to open when selected or focused
  icon.setAttribute('tabindex', '0'); // make focusable
  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      openLink(icon.dataset.link);
    }
    // Esc to unselect
    if (e.key === 'Escape') {
      icon.classList.remove('selected');
    }
  });

  // Touch: simple double-tap detection to simulate dblclick on mobile
  let lastTap = 0;
  icon.addEventListener('touchend', () => {
    const now = Date.now();
    if (now - lastTap < 350) {
      openLink(icon.dataset.link);
    } else {
      // first tap selects
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    }
    lastTap = now;
  }, { passive: true });
});

/* Click on empty desktop area = clear selection + close Start menu */
document.addEventListener('click', (e) => {
  // If click target isn't inside an .icon or the Start menu/button, clear selection
  const isIcon = e.target.closest && e.target.closest('.icon');
  const isStart = e.target.closest && (e.target.closest('#startBtn') || e.target.closest('#startMenu'));
  if (!isIcon && !isStart) {
    icons.forEach(i => i.classList.remove('selected'));
    closeAllStartMenus();
  }
});

/* ---------- Start Button / Start Menu ---------- */
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');

if (startBtn && startMenu) {
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = startMenu.hasAttribute('hidden');
    // close other menus, then toggle
    closeAllStartMenus();
    if (isHidden) {
      startMenu.removeAttribute('hidden');
      startBtn.setAttribute('aria-expanded', 'true');
    } else {
      startMenu.setAttribute('hidden', '');
      startBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Start menu item navigation
  startMenu.querySelectorAll('li[data-link]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      openLink(item.getAttribute('data-link'));
    });
    item.setAttribute('tabindex', '0'); // keyboard-focusable
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLink(item.getAttribute('data-link'));
      }
    });
  });

  // Close Start menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllStartMenus();
  });
}

/* ---------- System Tray Clock ---------- */
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  // Show local time like 14:05 (24h) or 2:05 PM (12h) — pick your style:
  // 24h style:
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  el.textContent = `${hh}:${mm}`;

  // If you prefer 12h style, swap the above with:
  // let h = now.getHours();
  // const ampm = h >= 12 ? 'PM' : 'AM';
  // h = h % 12 || 12;
  // const m = now.getMinutes().toString().padStart(2, '0');
  // el.textContent = `${h}:${m} ${ampm}`;
}
updateClock();
setInterval(updateClock, 15 * 1000); // update every 15s

/* ---------- Optional: Guard against accidental text selection while clicking icons ---------- */
// If you see unwanted text selection when rapidly clicking, you can uncomment this:
// document.addEventListener('mousedown', (e) => {
//   if (e.target.closest('.icon') || e.target.closest('.taskbar') || e.target.closest('.start-menu')) {
//     e.preventDefault();
//   }
// });
