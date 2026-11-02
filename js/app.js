// ================= GLOBAL REWARD STATE =================

// Initialize rewards with sample activities if not present
(function initDefaultRewards() {
  if (!localStorage.getItem("auraRewardPoints")) {
    const initialRewards = [
      { date: "2026-01-10", activity: "Platform Signup & Verification", points: 150 },
      { date: "2026-01-15", activity: "Completed Module 1: AURA Foundations", points: 100 },
      { date: "2026-01-22", activity: "Partner Store Check-in: Urban Brew Café", points: 100 }
    ];
    localStorage.setItem("aura_rewards", JSON.stringify(initialRewards));
    localStorage.setItem("auraRewardPoints", "350");
  }
})();

// Get rewards
function getRewardPoints() {
  return Number(localStorage.getItem("auraRewardPoints")) || 0;
}

// Add rewards
function addRewardPoints(points, activityName = "Platform Activity") {
  const current = getRewardPoints();
  const updated = current + points;
  localStorage.setItem("auraRewardPoints", updated);

  const rewards = JSON.parse(localStorage.getItem("aura_rewards") || "[]");
  rewards.unshift({
    date: new Date().toISOString().split("T")[0],
    activity: activityName,
    points: points
  });
  localStorage.setItem("aura_rewards", JSON.stringify(rewards));

  // Sync any crypto & reward displays on page
  renderRewardsCrypto();
  return updated;
}

/* ================= Franchise Recommendations ================= */

const franchiseRecommendations = [
  {
    id: 1,
    type: "Franchise",
    title: "FitZone Gym",
    location: "Bengaluru",
    investment: "₹30L – ₹40L",
    image: "assets/gym.jpg"
  },
  {
    id: 2,
    type: "Franchise",
    title: "Urban Brew Café",
    location: "Hyderabad",
    investment: "₹15L – ₹25L",
    image: "assets/cafe.jpg"
  },
  {
    id: 3,
    type: "Collaboration",
    title: "South India Cloud Kitchen",
    location: "Bengaluru",
    investment: "₹12L",
    image: "assets/cloud-kitchen.jpg"
  }
];

function renderFranchiseRecommendations() {
  const list = document.getElementById("recommendationsList");
  if (!list) return;

  list.innerHTML = "";

  franchiseRecommendations.forEach(item => {
    list.innerHTML += `
      <div class="card">
        <img src="${item.image}" alt="${item.title}" style="width:100%; height:180px; object-fit:cover; border-radius:12px; margin-bottom:1rem;">
        <h3>${item.title}</h3>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Investment:</strong> ${item.investment}</p>
        <a href="properties.html" class="btn-outline" style="display:inline-block; margin-top:0.75rem; text-align:center;">
          View Details
        </a>
      </div>
    `;
  });
}

/* ================= Rewards → Crypto ================= */

function renderRewardsCrypto() {
  const rewardPoints = getRewardPoints();

  const rewardEl = document.getElementById("rewardPoints");
  const cryptoEl = document.getElementById("cryptoValue");
  const fiatEl = document.getElementById("fiatValue");
  const lockedEl = document.getElementById("cryptoLocked");
  const unlockedEl = document.getElementById("cryptoUnlocked");

  if (rewardEl) {
    rewardEl.textContent = `${rewardPoints.toLocaleString()} pts`;
  }

  const INR_PER_POINT = 1.25;
  const BTC_RATE = 4200000;

  if (cryptoEl && fiatEl) {
    const inrValue = rewardPoints * INR_PER_POINT;
    const btcValue = inrValue / BTC_RATE;

    if (lockedEl) lockedEl.style.display = "none";
    if (unlockedEl) unlockedEl.style.display = "block";

    fiatEl.textContent = `≈ ₹${inrValue.toLocaleString("en-IN")}`;
    cryptoEl.textContent = `${btcValue.toFixed(6)} BTC`;
  }
}

/* ================= NAV TOGGLE & CLICK OUTSIDE ================= */

function initNavToggle() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    navMenu.classList.toggle("show");
    navToggle.classList.toggle("active");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("show") && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("show");
      navToggle.classList.remove("active");
    }
  });

  // Close menu on link click
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show");
      navToggle.classList.remove("active");
    });
  });
}

/* ================= AUTH STATE HEADER SYNC ================= */

function syncAuthState() {
  const user = JSON.parse(localStorage.getItem("aura_user") || "null");
  const loginLink = document.getElementById("loginLink");
  const profileLink = document.getElementById("profileLink");
  const profileIcon = document.querySelector(".profile-icon");

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (profileLink) {
      profileLink.style.display = "inline-flex";
      profileLink.textContent = "Profile";
    }
    if (profileIcon) {
      profileIcon.style.display = "inline-flex";
    }
  } else {
    if (loginLink) loginLink.style.display = "inline-flex";
    if (profileLink) profileLink.style.display = "none";
  }

  // Populate profile page if on profile.html
  const profileHeader = document.querySelector(".profile-header");
  if (profileHeader) {
    const nameEl = profileHeader.querySelector("h2");
    const emailEl = profileHeader.querySelector("p");
    if (user) {
      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;
    } else {
      if (nameEl) nameEl.textContent = "Guest User";
      if (emailEl) emailEl.innerHTML = "<a href='login.html' style='color:#00412E; text-decoration:underline;'>Log in to access your account</a>";
    }

    // Sync reward points on profile
    const pointsRows = document.querySelectorAll(".profile-container .ios-row");
    pointsRows.forEach(row => {
      if (row.textContent.includes("Reward Points")) {
        const val = row.querySelector(".ios-value");
        if (val) val.textContent = getRewardPoints().toLocaleString();
      }
    });
  }
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  renderFranchiseRecommendations();
  renderRewardsCrypto();
  initNavToggle();
  syncAuthState();
});
