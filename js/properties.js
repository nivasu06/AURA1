document.addEventListener("DOMContentLoaded", () => {
  /* ================= MODALS ================= */
  const opportunityModal = document.getElementById("opportunityModal");
  const collaborationModal = document.getElementById("collaborationModal");

  document.getElementById("uploadOpportunityBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    opportunityModal.style.display = "flex";
  });

  document.getElementById("uploadCollaborationBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    collaborationModal.style.display = "flex";
  });

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      if (opportunityModal) opportunityModal.style.display = "none";
      if (collaborationModal) collaborationModal.style.display = "none";
    });
  });

  // Close only when clicking outside modal-content
  window.addEventListener("click", e => {
    if (e.target === opportunityModal) {
      opportunityModal.style.display = "none";
    }
    if (e.target === collaborationModal) {
      collaborationModal.style.display = "none";
    }
  });

  setupImagePreview("opportunityImage", "opportunityPreview");
  setupImagePreview("collaborationImage", "collaborationPreview");

  /* ================= SUBMIT OPPORTUNITY ================= */
  const oppSubmitBtn = opportunityModal?.querySelector(".modal-actions .btn-primary");
  if (oppSubmitBtn) {
    oppSubmitBtn.addEventListener("click", () => {
      const inputs = opportunityModal.querySelectorAll("input[type='text']");
      const name = inputs[0]?.value.trim();
      const category = inputs[1]?.value.trim();
      const city = inputs[2]?.value.trim();
      const investment = inputs[3]?.value.trim();
      const select = opportunityModal.querySelector("select");
      const type = select ? select.value : "Single Unit";
      const isIncubated = document.getElementById("franchiseIncubated")?.checked;
      const previewImg = document.getElementById("opportunityPreview");
      const imgSrc = (previewImg && previewImg.src && previewImg.style.display !== "none")
        ? previewImg.src
        : "assets/cafe.jpg";

      if (!name || !category || !city) {
        if (typeof showToast === "function") showToast("Please fill in franchise name, category, and city.", "error");
        else alert("Please fill in franchise name, category, and city.");
        return;
      }

      const newCard = document.createElement("div");
      newCard.className = "card franchise-card";
      newCard.dataset.name = name.toLowerCase();
      newCard.dataset.category = category.toLowerCase();
      newCard.dataset.city = city.toLowerCase();
      newCard.innerHTML = `
        ${isIncubated ? '<div class="collab-badge"><span>PARTNER</span></div>' : ''}
        <img src="${imgSrc}" class="card-img" style="width:100%; height:180px; object-fit:cover; border-radius:12px; margin-bottom:1rem;">
        <h3>${name}</h3>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Investment:</strong> ${investment || "₹15L – ₹25L"}</p>
        <p><strong>Franchise Type:</strong> ${type || "Single Unit"}</p>
        <button class="btn-outline">View Details</button>
      `;

      const oppGrid = document.querySelector(".franchise-section:first-of-type .grid-3");
      if (oppGrid) {
        oppGrid.prepend(newCard);
      }

      opportunityModal.style.display = "none";
      inputs.forEach(i => i.value = "");
      if (previewImg) previewImg.style.display = "none";

      if (typeof showToast === "function") showToast("Franchise opportunity published successfully!", "success");
      else alert("Franchise opportunity published successfully!");
    });
  }

  /* ================= SUBMIT COLLABORATION ================= */
  const collabSubmitBtn = collaborationModal?.querySelector(".modal-actions .btn-primary");
  if (collabSubmitBtn) {
    collabSubmitBtn.addEventListener("click", () => {
      const inputs = collaborationModal.querySelectorAll("input[type='text']");
      const name = inputs[0]?.value.trim();
      const category = inputs[1]?.value.trim();
      const city = inputs[2]?.value.trim();
      const lookingFor = inputs[3]?.value.trim();
      const budget = inputs[4]?.value.trim();
      const isIncubated = document.getElementById("collabIncubated")?.checked;
      const previewImg = document.getElementById("collaborationPreview");
      const imgSrc = (previewImg && previewImg.src && previewImg.style.display !== "none")
        ? previewImg.src
        : "assets/cloud-kitchen.jpg";

      if (!name || !category || !city) {
        if (typeof showToast === "function") showToast("Please fill in project name, category, and city.", "error");
        else alert("Please fill in project name, category, and city.");
        return;
      }

      const newCard = document.createElement("div");
      newCard.className = "card collaboration-card";
      newCard.dataset.name = name.toLowerCase();
      newCard.dataset.category = category.toLowerCase();
      newCard.dataset.city = city.toLowerCase();
      newCard.innerHTML = `
        ${isIncubated ? '<div class="collab-badge"><span>PARTNER</span></div>' : ''}
        <img src="${imgSrc}" class="card-img" style="width:100%; height:180px; object-fit:cover; border-radius:12px; margin-bottom:1rem;">
        <h3>${name}</h3>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Preferred Location:</strong> ${city}</p>
        <p><strong>Looking For:</strong> ${lookingFor || "Co-Founder / Partner"}</p>
        <p><strong>Budget:</strong> ${budget || "₹10L – ₹20L"}</p>
        <button class="btn-outline">View Proposal</button>
      `;

      const collabGrid = document.querySelector(".franchise-section:last-of-type .grid-3");
      if (collabGrid) {
        collabGrid.prepend(newCard);
      }

      collaborationModal.style.display = "none";
      inputs.forEach(i => i.value = "");
      if (previewImg) previewImg.style.display = "none";

      if (typeof showToast === "function") showToast("Collaboration proposal submitted successfully!", "success");
      else alert("Collaboration proposal submitted successfully!");
    });
  }

  /* =====================================================
     FRANCHISE OPPORTUNITIES FILTER
  ===================================================== */
  const fKeyword = document.getElementById("franchiseKeyword");
  const fLocation = document.getElementById("franchiseLocation");
  const fBtn = document.getElementById("franchiseSearchBtn");

  function searchFranchise() {
    const fCards = document.querySelectorAll(".franchise-card");
    const keyword = fKeyword ? fKeyword.value.trim().toLowerCase() : "";
    const location = fLocation ? fLocation.value.trim().toLowerCase() : "";

    fCards.forEach(card => {
      const { name = "", category = "", city = "" } = card.dataset;
      const match =
        (!keyword || name.includes(keyword) || category.includes(keyword)) &&
        (!location || city.includes(location));
      card.style.display = match ? "" : "none";
    });
  }

  fBtn?.addEventListener("click", searchFranchise);
  fKeyword?.addEventListener("keydown", e => e.key === "Enter" && searchFranchise());
  fLocation?.addEventListener("keydown", e => e.key === "Enter" && searchFranchise());
  fKeyword?.addEventListener("input", searchFranchise);
  fLocation?.addEventListener("input", searchFranchise);

  /* =====================================================
     FRANCHISE COLLABORATION FILTER
  ===================================================== */
  const cKeyword = document.getElementById("collabKeyword");
  const cLocation = document.getElementById("collabLocation");
  const cBtn = document.getElementById("collabSearchBtn");

  function searchCollaboration() {
    const cCards = document.querySelectorAll(".collaboration-card");
    const keyword = cKeyword ? cKeyword.value.trim().toLowerCase() : "";
    const location = cLocation ? cLocation.value.trim().toLowerCase() : "";

    cCards.forEach(card => {
      const { name = "", category = "", city = "" } = card.dataset;
      const match =
        (!keyword || name.includes(keyword) || category.includes(keyword)) &&
        (!location || city.includes(location));
      card.style.display = match ? "" : "none";
    });
  }

  cBtn?.addEventListener("click", searchCollaboration);
  cKeyword?.addEventListener("keydown", e => e.key === "Enter" && searchCollaboration());
  cLocation?.addEventListener("keydown", e => e.key === "Enter" && searchCollaboration());
  cKeyword?.addEventListener("input", searchCollaboration);
  cLocation?.addEventListener("input", searchCollaboration);
});

/* ================= IMAGE PREVIEW ================= */
function setupImagePreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}
