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
      openWindow(winId);
    } else if (link) {
      window.open(link, "_blank");
    }
  });
});

// Click empty space clears selection
document.addEventListener('click', (e) => {
  if (!e.target.closest('.icon') && !e.target.closest('.window')) {
    icons.forEach(i => i.classList.remove('selected'));
  }
});

/*************** Window helpers ***************/
let zCounter = 1000;
const nextZ = () => ++zCounter;

/*************** PodOS Taskbar Management ***************/

function getTaskbarButton(win) {
  return document.querySelector(
    `.taskbar-app[data-window="${win.id}"]`
  );
}

function updateTaskbarActive() {
  const visibleWindows = [...document.querySelectorAll('.window')]
    .filter(win => !win.hidden && !win.classList.contains('minimized'));

  const topWindow = visibleWindows.sort(
    (a, b) =>
      (parseInt(b.style.zIndex) || 0) -
      (parseInt(a.style.zIndex) || 0)
  )[0];

  document.querySelectorAll('.taskbar-app').forEach(btn => {
    btn.classList.toggle(
      'active',
      !!topWindow && btn.dataset.window === topWindow.id
    );
  });
}

function createTaskbarButton(win) {
  const container = document.getElementById('taskbarApps');

  if (!container || getTaskbarButton(win)) return;

  const title = win.querySelector('.title-bar-text span')?.textContent
    || win.id;

  const icon = win.querySelector('.title-bar-text img')?.getAttribute('src');

  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'taskbar-app';
  button.dataset.window = win.id;
  button.title = title;

  if (icon) {
    const img = document.createElement('img');
    img.src = icon;
    img.alt = '';
    button.appendChild(img);
  }

  const label = document.createElement('span');
  label.textContent = title;
  button.appendChild(label);

  button.addEventListener('click', () => {
    if (win.classList.contains('minimized') || win.hidden) {
      restoreWindow(win);
    } else if (button.classList.contains('active')) {
      minimizeWindow(win);
    } else {
      win.style.zIndex = String(nextZ());
      updateTaskbarActive();
    }
  });

  container.appendChild(button);
}

function minimizeWindow(win) {
  if (typeof win === 'string') {
    win = document.getElementById(win);
  }

  if (!win) return;

  // Ensure the window has a taskbar button
  createTaskbarButton(win);

  // Hide the window without closing it
  win.classList.add('minimized');
  win.hidden = true;

  // Update active taskbar application
  updateTaskbarActive();
}

function restoreWindow(win) {
  if (typeof win === 'string') {
    win = document.getElementById(win);
  }

  if (!win) return;

  win.classList.remove('minimized');
  win.hidden = false;

  win.style.zIndex = String(nextZ());

  updateTaskbarActive();
}

function removeTaskbarButton(win) {
  getTaskbarButton(win)?.remove();
  updateTaskbarActive();
}

/*************** Maximize / Restore Windows ***************/

function toggleMaximize(win) {
  if (typeof win === 'string') {
    win = document.getElementById(win);
  }

  if (!win) return;

  const isMaximized = win.classList.contains('maximized');

  if (isMaximized) {
    // Restore original window size and position
    win.classList.remove('maximized');

    win.style.left = win.dataset.restoreLeft || '';
    win.style.top = win.dataset.restoreTop || '';
    win.style.width = win.dataset.restoreWidth || '';
    win.style.height = win.dataset.restoreHeight || '';

  } else {
    // Remember the current size and position
    win.dataset.restoreLeft = win.style.left;
    win.dataset.restoreTop = win.style.top;
    win.dataset.restoreWidth = win.style.width;
    win.dataset.restoreHeight = win.style.height;

    // Maximize window
    win.classList.add('maximized');
  }

  // Bring window to front
  win.style.zIndex = String(nextZ());
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  // If minimized, restore without changing size or position
  if (win.classList.contains('minimized')) {
  restoreWindow(win);
  return;
}
    
  // Load window iframe only when first opened
  const iframe = win.querySelector('iframe[data-src]');

  if (iframe && !iframe.getAttribute('src')) {
    iframe.src = iframe.dataset.src;
}

  win.removeAttribute('hidden');

  // Center-ish when opened
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const rect = win.getBoundingClientRect();

  const left = Math.max(8, (vw - rect.width) / 2);
  const top = Math.max(8, (vh - rect.height) / 3);

  win.style.left = `${left}px`;
  win.style.top = `${top}px`;

  win.style.zIndex = String(nextZ());

  // Create taskbar button
  createTaskbarButton(win);
  updateTaskbarActive();

  // Reset contact link visited state
  if (id === 'contactWindow') {
    win.querySelectorAll('.contact-link').forEach(link => {
      link.classList.remove('visited');
    });
  }
}

function closeWindow(win) {
  if (typeof win === 'string') {
    win = document.getElementById(win);
  }

  if (!win) return;

  win.classList.remove('minimized');
  win.hidden = true;

  // Remove application from taskbar
  removeTaskbarButton(win);
}

/*************** Window Controls + Bring-to-Front ***************/

document.querySelectorAll('.window').forEach(win => {

  // Bring window to front when interacting
  win.addEventListener('mousedown', () => {
  win.style.zIndex = String(nextZ());
  updateTaskbarActive();
});

  // Close buttons
win.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => closeWindow(win));
});
  
  // Minimize button
  const minBtn = win.querySelector('.min-btn');

  if (minBtn) {
  minBtn.addEventListener('click', () => {
    minimizeWindow(win);
  });
}
  
  // Maximize / Restore button
  const maxBtn = win.querySelector('.max-btn');

  if (maxBtn) {
    maxBtn.addEventListener('click', () => {
      toggleMaximize(win);
    });
  }

  // Double-click title bar to maximize / restore
  const titleBar = win.querySelector('.title-bar');

  if (titleBar) {
    titleBar.addEventListener('dblclick', (e) => {

      // Don't maximize when double-clicking window controls
      if (e.target.closest('button, .title-bar-controls')) return;

      toggleMaximize(win);
    });
  }

});

/*************** Make all windows draggable ***************/
function makeDraggable(win, handle) {
  let isDown = false, startX = 0, startY = 0, startL = 0, startT = 0;

 const onPointerDown = (e) => {

  // Don't drag maximized windows
  if (win.classList.contains('maximized')) {
    return;
  }

  // Don't drag when clicking window controls
  if (e.target.closest('button, .title-bar-controls')) {
    return;
  }

    isDown = true;
    win.style.zIndex = String(nextZ());

    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX;
    startY = p.clientY;

    const r = win.getBoundingClientRect();
    startL = r.left;
    startT = r.top;

    // Temporarily disable iframe interaction while dragging
    win.querySelectorAll('iframe').forEach(frame => {
      frame.style.pointerEvents = 'none';
    });

    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);

    if (e.cancelable) e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDown) return;

    const p = e.touches ? e.touches[0] : e;

    let newL = startL + (p.clientX - startX);
    let newT = startT + (p.clientY - startY);

    // Keep window within viewport
    const pad = 8;
    const maxL = window.innerWidth - win.offsetWidth - pad;
    const maxT = window.innerHeight - win.offsetHeight - pad;

    newL = Math.min(Math.max(pad, newL), Math.max(pad, maxL));
    newT = Math.min(Math.max(pad, newT), Math.max(pad, maxT));

    win.style.left = `${newL}px`;
    win.style.top = `${newT}px`;

    if (e.cancelable) e.preventDefault();
  };

  const onPointerUp = () => {
    isDown = false;

    // Restore iframe interaction when dragging ends
    win.querySelectorAll('iframe').forEach(frame => {
      frame.style.pointerEvents = '';
    });

    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
  };

  handle.addEventListener('mousedown', onPointerDown);
  handle.addEventListener('touchstart', onPointerDown, { passive: true });
}

// Initialize draggable for every window with a handle
document.querySelectorAll('.window').forEach(win => {
  const handle = win.querySelector('.title-bar');
  if (handle) makeDraggable(win, handle);
});

/*************** Contact links: fake “visited” behavior ***************/
document.querySelectorAll('#contactWindow .contact-link').forEach(link => {
  link.addEventListener('click', () => {
    link.classList.add('visited'); // triggers purple in CSS
  });
});

/* =======================
   Live XP-style Clock
   ======================= */
function updateClock() {
  const clockEl = document.getElementById("trayClock");
  if (!clockEl) return;

  const now = new Date();
  
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // XP uses 12-hour format with no leading zero
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; 

  // Add leading zero to minutes
  minutes = minutes < 10 ? "0" + minutes : minutes;

  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // initial

/*************** PodOS Start Menu ***************/

const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');

function openStartMenu() {
  if (!startButton || !startMenu) return;

  startMenu.hidden = false;
  startButton.classList.add('menu-open');
  startButton.setAttribute('aria-expanded', 'true');
}

function closeStartMenu() {
  if (!startButton || !startMenu) return;

  startMenu.hidden = true;
  startButton.classList.remove('menu-open');
  startButton.setAttribute('aria-expanded', 'false');
}

function toggleStartMenu() {
  if (!startMenu) return;

  if (startMenu.hidden) {
    openStartMenu();
  } else {
    closeStartMenu();
  }
}

// Clicking Start toggles the menu
if (startButton && startMenu) {

  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleStartMenu();
  });

  // Keyboard support: Enter or Space
  startButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleStartMenu();
    }
  });

  // Clicking outside the Start menu closes it
  document.addEventListener('click', (e) => {
    if (
      !startMenu.hidden &&
      !startMenu.contains(e.target) &&
      !startButton.contains(e.target)
    ) {
      closeStartMenu();
    }
  });

  // Pressing Escape closes the Start menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !startMenu.hidden) {
      closeStartMenu();
      startButton.focus();
    }
  });
}

/*************** Start Menu Shortcuts ***************/
if (startMenu) {
  startMenu.addEventListener('click', (e) => {

    const shortcut = e.target.closest('.start-menu-item');
    if (!shortcut) return;

    const app = shortcut.dataset.app;
    const link = shortcut.dataset.link;
    const url = shortcut.dataset.url;

    // Open existing PodOS windows
    if (app) {
      openWindow(app);
    }

    // Open standalone HTML pages
    if (link) {
      window.open(link, '_blank');
    }

    // Open external social media profiles
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    // Close Start menu after selecting a shortcut
    if (app || link || url) {
      closeStartMenu();
    }

  });
}
