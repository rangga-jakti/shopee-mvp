// auth.js - Authentication functions

// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && user) {
    // User is logged in
    document.getElementById("loginBtn")?.style.setProperty("display", "none");
    document
      .getElementById("registerBtn")
      ?.style.setProperty("display", "none");

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.style.display = "block";
      logoutBtn.textContent = `Logout (${user.username})`;
    }

    // Show seller dashboard if user is seller
    if (user.is_seller) {
      const sellerBtn = document.getElementById("sellerBtn");
      if (sellerBtn) sellerBtn.style.display = "block";
    }

    return true;
  }
  return false;
}

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token and user data
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home
      window.location.href = "/";
    } else {
      errorMessage.textContent = data.detail || "Login gagal";
      errorMessage.classList.add("show");
    }
  } catch (error) {
    errorMessage.textContent = "Terjadi kesalahan. Pastikan server berjalan.";
    errorMessage.classList.add("show");
    console.error("Login error:", error);
  }
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const fullName = document.getElementById("fullName").value;
  const phone = document.getElementById("phone").value;
  const isSeller = document.getElementById("isSeller").checked;

  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  const registerData = {
    email,
    username,
    password,
    full_name: fullName || null,
    phone: phone || null,
    is_seller: isSeller,
  };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.textContent = "Register berhasil! Redirecting to login...";
      successMessage.classList.add("show");
      errorMessage.classList.remove("show");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2000);
    } else {
      errorMessage.textContent = data.detail || "Register gagal";
      errorMessage.classList.add("show");
      successMessage.classList.remove("show");
    }
  } catch (error) {
    errorMessage.textContent = "Terjadi kesalahan. Pastikan server berjalan.";
    errorMessage.classList.add("show");
    console.error("Register error:", error);
  }
}

// Initialize auth state on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  // Add logout event listener
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
});
