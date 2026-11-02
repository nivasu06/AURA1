// ================= Get URL Params =================
const params = new URLSearchParams(window.location.search);
const storeId = Number(params.get("id")) || 1;
const storeType = params.get("type") || "shopping";

// ================= Store Data =================
const storesData = {
  shopping: [
    {
      id: 1,
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
      name: "AURA Travel Partner",
      address: "Hitech City, Hyderabad",
      lat: 17.4483,
      lng: 78.3915,
      reward: "20 pts / ₹100"
    }
  ]
};

// ================= Find Store with safe fallback =================
const store = storesData[storeType]?.find(s => s.id === storeId) || storesData.shopping[0];

if (document.getElementById("storeName")) {
  document.getElementById("storeName").textContent = store.name;
}
if (document.getElementById("storeAddress")) {
  document.getElementById("storeAddress").textContent = store.address;
}

// ================= Distance Calculation =================
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

// ================= Navigation =================
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const distance = getDistanceKm(
        userLat,
        userLng,
        store.lat,
        store.lng
      );
      const distEl = document.getElementById("storeDistance");
      if (distEl) distEl.textContent = `Distance: ${distance} km`;

      const mapLink = document.getElementById("mapLink");
      if (mapLink) {
        mapLink.href = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${store.lat},${store.lng}`;
      }

      const uberLink = document.getElementById("uberLink");
      if (uberLink) {
        uberLink.href = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${userLat}&pickup[longitude]=${userLng}&dropoff[latitude]=${store.lat}&dropoff[longitude]=${store.lng}`;
      }
    },
    () => {
      const distEl = document.getElementById("storeDistance");
      if (distEl) distEl.textContent = "Location: Approx. 2.4 km away";

      const mapLink = document.getElementById("mapLink");
      if (mapLink) {
        mapLink.href = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
      }

      const uberLink = document.getElementById("uberLink");
      if (uberLink) {
        uberLink.href = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${store.lat}&dropoff[longitude]=${store.lng}`;
      }
    }
  );
}

// ================= QR CODE =================
const user = JSON.parse(localStorage.getItem("aura_user") || "null");
const USER_ID = user ? user.email : "GUEST_USER";
const payload = `AURA|${USER_ID}|${store.id}|${Date.now()}`;

if (typeof QRious !== "undefined" && document.getElementById("qrCode")) {
  new QRious({
    element: document.getElementById("qrCode"),
    size: 180,
    value: payload
  });
}

// ================= Simulate Scan =================
const scanBtn = document.getElementById("simulateScan");
if (scanBtn) {
  scanBtn.addEventListener("click", () => {
    if (typeof addRewardPoints === "function") {
      addRewardPoints(100, `Partner Store Purchase: ${store.name}`);
    } else {
      let points = Number(localStorage.getItem("auraRewardPoints")) || 0;
      localStorage.setItem("auraRewardPoints", points + 100);
    }

    if (typeof showToast === "function") {
      showToast("Scan successful! +100 reward points credited.", "success");
    } else {
      alert("Scan successful! +100 reward points credited.");
    }
  });
}
