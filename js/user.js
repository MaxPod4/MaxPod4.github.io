// Close button behavior (only action needed on User page)
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".close-btn");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      window.close();  // Attempts to close tab (works when the tab was opened by script)
    });
  }
});
