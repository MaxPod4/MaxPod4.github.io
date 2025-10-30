/*************** Icon selection + open ***************/
const icons = Array.from(document.querySelectorAll('.icon'));

icons.forEach(icon => {
  icon.addEventListener('click', () => {
    icons.forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
  });

  icon.addEventListener('dblclick', () => {
    const winId = icon.dataset.window;
    const link  = icon.dataset.link;

    if (winId) {
      openXPWindow(winId);
    } else if (link) {
      window.open(link, "_blank");
    }
  });
});

// Click empty space clears selection
document.addEventListener('click', (e) => {
  if (!e.target.closest('.icon') && !e.target.closest('.xp-window')) {
    icons.forEach(i => i.classList.remove('selected'));
  }
});

/*************** XP window helpers ***************/
let zCounter = 1000;
const nextZ = () => ++zCounter;

function openXPWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.removeAttribute('hidden');

  // center-ish when opened
  const vw = window.innerWidth, vh = window.innerHeight;
  const rect = win.getBoundingClientRect();
  const left = Math.max(8, (vw - rect.width) / 2);
  const top  = Math.max(8, (vh - rect.height) / 3);
  win.style.left = `${left}px`;
  win.style.top  = `${top}px`;
  win.style.zIndex = String(nextZ());
}

function closeXPWindow(win) {
  if (typeof win === 'string') win = document.getElementById(win);
  if (win) win.setAttribute('hidden', '');
}

/*************** Close buttons + bring-to-front ***************/
document.querySelectorAll('.xp-window').forEach(win => {
  // Bring to front when interacting
  win.addEventListener('mousedown', () => {
    win.style.zIndex = String(nextZ());
  });

  // Wire up close buttons inside this window
  win.querySelectorAll('.xp-close').forEach(btn => {
    btn.addEventListener('click', () => closeXPWindow(win));
  });
});

/*************** Make all windows draggable ***************/
function makeDraggable(win, handle) {
  let isDown = false, startX = 0, startY = 0, startL = 0, startT = 0;

  const onPointerDown = (e) => {
    isDown = true;
    win.style.zIndex = String(nextZ());
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    const r = win.getBoundingClientRect();
    startL = r.left; startT = r.top;
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDown) return;
    const p = e.touches ? e.touches[0] : e;
    let newL = startL + (p.clientX - startX);
    let newT = startT + (p.clientY - startY);

    // keep within viewport
    const pad = 8;
    const maxL = window.innerWidth - win.offsetWidth - pad;
    const maxT = window.innerHeight - win.offsetHeight - pad;
    newL = Math.min(Math.max(pad, newL), Math.max(pad, maxL));
    newT = Math.min(Math.max(pad, newT), Math.max(pad, maxT));

    win.style.left = `${newL}px`;
    win.style.top  = `${newT}px`;
    if (e.cancelable) e.preventDefault();
  };

  const onPointerUp = () => {
    isDown = false;
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
  };

  handle.addEventListener('mousedown', onPointerDown);
  handle.addEventListener('touchstart', onPointerDown, { passive: true });
}

// Initialize draggable for every window with a handle
document.querySelectorAll('.xp-window').forEach(win => {
  const handle = win.querySelector('[data-drag-handle]');
  if (handle) makeDraggable(win, handle);
});
