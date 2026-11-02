// ================= URL PARAM =================
const params = new URLSearchParams(window.location.search);
const storeType = params.get("type");

// ================= STORE DATA =================
const storesData = {
  shopping: [
    {
      id: 1,
      type: "shopping",
      name: "Urban Fashion Store",
      address: "Banjara Hills, Hyderabad",
      lat: 17.4065,
      lng: 78.4772,
      reward: "10 pts / ₹100"
    }
  ],
  food: [
    {
      id: 2,
      type: "food",
      name: "Urban Brew Café",
      address: "Jubilee Hills, Hyderabad",
      lat: 17.4326,
      lng: 78.4071,
      reward: "10 pts / ₹100"
    }
  ],
  services: [
    {
      id: 3,
      type: "services",
      name: "FitZone Gym",
      address: "Gachibowli, Hyderabad",
      lat: 17.4401,
      lng: 78.3489,
      reward: "15 pts / ₹100"
    }
  ],
  travel: [
    {
      id: 4,
      type: "travel",
      name: "AURA Travel Partner",
      address: "Hitech City, Hyderabad",
      lat: 17.4483,
      lng: 78.3915,
      reward: "20 pts / ₹100"
    }
  ]
};

// ================= DISTANCE =================
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

// ================= RENDER STORES =================
function renderStores(userLat = 17.3850, userLng = 78.4867, isEstimated = true) {
  const container = document.getElementById("storesList");
  if (!container) return;
  container.innerHTML = "";

  // If specific storeType requested, show that, otherwise show all stores
  let stores = [];
  if (storeType && storesData[storeType]) {
    stores = storesData[storeType];
  } else {
    Object.values(storesData).forEach(cat => stores.push(...cat));
  }

  if (stores.length === 0) {
    container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>No partner stores found.</p>";
    return;
  }

  stores.forEach(store => {
    const distance = getDistanceKm(
      userLat,
      userLng,
      store.lat,
      store.lng
    );
    const catType = store.type || storeType || "shopping";
    container.innerHTML += `
      <div class="card store-list-card">
        <h3>${store.name}</h3>
        <p><strong>Address:</strong> ${store.address}</p>
        <p><strong>Rewards:</strong> <span style="color:#00412E; font-weight:600;">${store.reward}</span></p>
        <p><strong>Distance:</strong> ${distance} km ${isEstimated ? "(approx)" : "from your location"}</p>
        <a class="btn-outline" style="display:inline-block; margin-top:0.75rem; text-align:center;"
           href="store-details.html?id=${store.id}&type=${catType}">
           View Store & Earn
        </a>
      </div>
    `;
  });
}

// ================= LOCATION BUTTON =================
document.addEventListener("DOMContentLoaded", () => {
  // Initial render so page is not empty
  renderStores(17.3850, 78.4867, true);

  const allowBtn = document.getElementById("allowLocationBtn");
  if (allowBtn) {
    allowBtn.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            renderStores(
              position.coords.latitude,
              position.coords.longitude,
              false
            );
            allowBtn.textContent = "✓ Location Active";
            allowBtn.style.background = "#00412E";
          },
          () => {
            if (typeof showToast === "function") {
              showToast("Location access denied. Showing all partner stores.", "error");
            } else {
              alert("Location access is required to show exact GPS distance. Showing all partner stores.");
            }
            renderStores(17.3850, 78.4867, true);
          }
        );
      }
    });
  }
});
