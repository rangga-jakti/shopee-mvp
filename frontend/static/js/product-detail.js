// product-detail.js - Product detail page functions

let currentProduct = null;

// Get product ID from URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Load product detail
async function loadProductDetail() {
  const productId = getProductIdFromURL();

  if (!productId) {
    showError();
    return;
  }

  const loadingSpinner = document.getElementById("loadingSpinner");
  const productDetail = document.getElementById("productDetail");
  const errorMessage = document.getElementById("errorMessage");

  try {
    const response = await fetch(`${API_URL}/products/${productId}`);

    if (!response.ok) {
      throw new Error("Product not found");
    }

    const product = await response.json();
    currentProduct = product;

    if (loadingSpinner) loadingSpinner.style.display = "none";
    if (productDetail) productDetail.style.display = "grid";

    displayProductDetail(product);
    loadRelatedProducts(product.category);
  } catch (error) {
    console.error("Error loading product:", error);
    showError();
  }
}

// Display product detail
function displayProductDetail(product) {
  document.title = `${product.name} - Shopee MVP`;

  document.getElementById("breadcrumbCategory").textContent =
    product.category || "Kategori";
  document.getElementById("breadcrumbName").textContent = product.name;

  const productImage = document.getElementById("productImage");
  if (product.image_url) {
    productImage.innerHTML = `<img src="${product.image_url}" alt="${product.name}">`;
  } else {
    productImage.innerHTML = "📦";
  }

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent =
    `Rp ${formatPrice(product.price)}`;

  const stockElement = document.getElementById("productStock");
  const buyBtn = document.getElementById("buyBtn");

  if (product.stock > 0) {
    stockElement.textContent = `Stok: ${product.stock}`;
    stockElement.classList.remove("out-of-stock");
    buyBtn.disabled = false;
    buyBtn.style.opacity = "1";
    buyBtn.style.cursor = "pointer";
  } else {
    stockElement.textContent = "Stok Habis";
    stockElement.classList.add("out-of-stock");
    buyBtn.disabled = true;
    buyBtn.style.opacity = "0.5";
    buyBtn.style.cursor = "not-allowed";
  }

  document.getElementById("productCategory").textContent =
    product.category || "Uncategorized";
  document.getElementById("productDescription").textContent =
    product.description || "Tidak ada deskripsi tersedia.";
  document.getElementById("sellerId").textContent = product.seller_id;
}

// Show error
function showError() {
  document.getElementById("loadingSpinner").style.display = "none";
  document.getElementById("errorMessage").style.display = "block";
}

// Load related products
async function loadRelatedProducts(category) {
  if (!category) return;

  try {
    const response = await fetch(
      `${API_URL}/products/?category=${category}&limit=4`,
    );
    const products = await response.json();

    const relatedProducts = products
      .filter((p) => p.id !== currentProduct.id)
      .slice(0, 3);

    const relatedGrid = document.getElementById("relatedProductsGrid");
    if (relatedGrid) {
      relatedGrid.innerHTML = "";

      relatedProducts.forEach((product) => {
        const card = createProductCard(product);
        relatedGrid.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Error loading related products:", error);
  }
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.cursor = "pointer";
  card.onclick = () => {
    window.location.href = `/product-detail.html?id=${product.id}`;
  };

  const stockStatus = product.stock > 0 ? "in-stock" : "out-of-stock";
  const stockText = product.stock > 0 ? `Stok: ${product.stock}` : "Stok habis";

  card.innerHTML = `
        <div class="product-image">
            ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : "📦"}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category || "Uncategorized"}</span>
            <h4 class="product-name">${product.name}</h4>
            <p class="product-description">${product.description || "Tidak ada deskripsi"}</p>
            <div class="product-price">Rp ${formatPrice(product.price)}</div>
            <div class="product-stock ${stockStatus}">${stockText}</div>
        </div>
    `;

  return card;
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Show notification
function showNotification(message, type = "success") {
  // Remove existing notification
  const existing = document.querySelector(".custom-notification");
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");
  notification.className = `custom-notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === "success" ? "✅" : "❌"}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add to cart
async function addToCart() {
  if (!currentProduct || currentProduct.stock === 0) {
    showNotification("Produk tidak tersedia!", "error");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    showNotification("Silakan login terlebih dahulu!", "error");
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);
    return;
  }

  const buyBtn = document.getElementById("buyBtn");
  const originalText = buyBtn.innerHTML;

  try {
    buyBtn.disabled = true;
    buyBtn.innerHTML = "⏳ Menambahkan...";

    const response = await fetch(`${API_URL}/cart/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: currentProduct.id,
        quantity: 1,
      }),
    });

    if (response.ok) {
      buyBtn.innerHTML = "✅ Berhasil!";
      showNotification("Produk berhasil ditambahkan ke keranjang!", "success");

      // Show action buttons
      showCartActions();
    } else {
      const data = await response.json();
      showNotification("Gagal: " + data.detail, "error");
      buyBtn.innerHTML = originalText;
      buyBtn.disabled = false;
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showNotification("Terjadi kesalahan. Pastikan Anda sudah login.", "error");
    buyBtn.innerHTML = originalText;
    buyBtn.disabled = false;
  }
}

// Show cart action buttons
function showCartActions() {
  const actionsDiv = document.querySelector(".detail-actions");
  if (actionsDiv) {
    actionsDiv.innerHTML = `
            <button onclick="window.location.href='/'" class="btn-secondary btn-large">
                🏠 Lanjut Belanja
            </button>
            <button onclick="window.location.href='/cart.html'" class="btn-primary btn-large">
                🛒 Lihat Keranjang
            </button>
        `;
  }
}

// Buy product
function buyProduct() {
  addToCart();
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail();
});
