// products.js - Product display functions

// Load all products
async function loadProducts(category = null) {
  console.log("🔄 Loading products...");

  const productsGrid = document.getElementById("productsGrid");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const noProducts = document.getElementById("noProducts");

  console.log("Elements found:", {
    productsGrid: !!productsGrid,
    loadingSpinner: !!loadingSpinner,
    noProducts: !!noProducts,
  });

  if (loadingSpinner) loadingSpinner.style.display = "block";
  if (productsGrid) productsGrid.innerHTML = "";
  if (noProducts) noProducts.style.display = "none";

  try {
    let url = `${API_URL}/products/`;
    if (category) {
      url += `?category=${category}`;
    }

    console.log("📡 Fetching from:", url);

    const response = await fetch(url);
    console.log("📥 Response status:", response.status);

    const products = await response.json();
    console.log("📦 Products received:", products.length, products);

    if (loadingSpinner) loadingSpinner.style.display = "none";

    if (products.length === 0) {
      console.log("⚠️ No products found");
      if (noProducts) noProducts.style.display = "block";
      return;
    }

    products.forEach((product) => {
      console.log("✅ Creating card for:", product.name);
      const productCard = createProductCard(product);
      if (productsGrid) productsGrid.appendChild(productCard);
    });

    console.log("✅ Products loaded successfully!");
  } catch (error) {
    console.error("❌ Error loading products:", error);
    if (loadingSpinner) loadingSpinner.style.display = "none";
    if (productsGrid) {
      productsGrid.innerHTML =
        '<p style="color: red; text-align: center;">Gagal memuat produk. Pastikan server berjalan.</p>';
    }
  }
}

// Create product card element WITH CLICKABLE FUNCTION
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Make card clickable
  card.style.cursor = "pointer";
  card.style.transition = "transform 0.3s";

  // Add click event
  card.addEventListener("click", function (e) {
    console.log("🖱️ Card clicked! Product ID:", product.id);
    window.location.href = `/product-detail.html?id=${product.id}`;
  });

  // Add hover effect
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });

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

// Format price with thousand separator
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Filter products by category
function filterProducts() {
  const categoryFilter = document.getElementById("categoryFilter");
  const category = categoryFilter ? categoryFilter.value : null;
  loadProducts(category);
}

// Initialize products page
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM loaded, initializing...");

  // Load products if we're on index page
  if (document.getElementById("productsGrid")) {
    console.log("✅ productsGrid found, loading products...");
    loadProducts();
  } else {
    console.log("❌ productsGrid NOT found");
  }
});
