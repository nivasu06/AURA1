// AURA Authentication & Toast System

function showToast(message, type = "success") {
  let toast = document.getElementById("auraToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "auraToast";
    toast.className = "aura-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `aura-toast ${type === "error" ? "toast-error" : "toast-success"} show`;
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Seed demo user if no users exist
(function initDefaultUser() {
  const users = JSON.parse(localStorage.getItem("auraUsers") || "[]");
  if (users.length === 0) {
    users.push({
      name: "Aarav Sharma",
      email: "demo@aura.com",
      password: "password123"
    });
    localStorage.setItem("auraUsers", JSON.stringify(users));
  }
})();

const Auth = {
  // REGISTER NEW USER
  register() {
    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const terms = document.getElementById("termsCheck");

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // Validate input fields
    if (!name || !email || !password) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!terms || !terms.checked) {
      showToast("Please accept the Terms & Conditions and Privacy Policy.", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must contain at least 8 characters.", "error");
      return;
    }

    // Retrieve existing registered users
    const users = JSON.parse(
      localStorage.getItem("auraUsers") || "[]"
    );

    // Check whether the email already exists
    const existingUser = users.find(
      user => user.email.toLowerCase() === email
    );

    if (existingUser) {
      showToast("This email is already registered. Please log in.", "error");
      return;
    }

    // Create a new user
    const newUser = {
      name: name,
      email: email,
      password: password
    };

    // Save registered users
    users.push(newUser);
    localStorage.setItem("auraUsers", JSON.stringify(users));

    showToast("Registration successful! Redirecting to login...", "success");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  },

  // LOGIN EXISTING USER
  login() {
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {
      showToast("Login form fields not found.", "error");
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      showToast("Please enter your email and password.", "error");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("auraUsers") || "[]"
    );

    const matchedUser = users.find(
      user => user.email.toLowerCase() === email &&
              user.password === password
    );

    if (!matchedUser) {
      showToast("Invalid email or password. Please try again.", "error");
      return;
    }

    // Save current user session
    const loggedInUser = {
      name: matchedUser.name,
      email: matchedUser.email
    };

    localStorage.setItem("aura_user", JSON.stringify(loggedInUser));
    localStorage.setItem("auth_user", JSON.stringify(loggedInUser));

    showToast(`Welcome back, ${matchedUser.name}!`, "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  },

  // LOGOUT
  logout() {
    localStorage.removeItem("aura_user");
    localStorage.removeItem("auth_user");
    showToast("Logged out successfully.", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  },

  // GET CURRENT USER
  getUser() {
    return JSON.parse(
      localStorage.getItem("aura_user") || "null"
    );
  },

  // CHECK LOGIN STATUS
  isLoggedIn() {
    return !!this.getUser();
  }
};