// Resource category navigation & dynamic resources loader
document.addEventListener("DOMContentLoaded", () => {
  // Category cards navigation
  const categoryCards = document.querySelectorAll(".resource-category .card");
  categoryCards.forEach(card => {
    const link = card.closest("a");
    if (!link) return;

    // Keyboard accessibility
    card.setAttribute("tabindex", "0");
    card.addEventListener("click", () => {
      window.location.href = link.getAttribute("href");
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        window.location.href = link.getAttribute("href");
      }
    });
  });

  // Load custom added resources from localStorage into Available Resources
  const resourcesGrid = document.getElementById("resourcesGrid");
  if (resourcesGrid) {
    const storedResources = JSON.parse(localStorage.getItem("aura_resources") || "[]");
    storedResources.forEach(res => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.borderTop = "3px solid var(--primary)";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <h3 style="margin-bottom:0;">${res.title}</h3>
          <span style="font-size:0.75rem; background:rgba(0,65,46,0.1); color:var(--primary); padding:2px 8px; border-radius:4px; font-weight:600;">NEW</span>
        </div>
        <p>${res.description}</p>
        <p><strong>Type:</strong> ${res.type}</p>
        <p><strong>Access:</strong> ${res.access}</p>
        <br>
        <button class="btn-outline" style="margin-top:0.75rem;" onclick="showToast('Access link copied to clipboard or opened.', 'success')">
          Access Resource
        </button>
      `;
      resourcesGrid.prepend(card);
    });
  }
});
