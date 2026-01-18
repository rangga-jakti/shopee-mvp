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

    // Hide loading, show product
    if (loadingSpinner) loadingSpinner.style.display = "none";
    if (productDetail) productDetail.style.display = "grid";

    // Populate product data
    displayProductDetail(product);

    // Load related products
    loadRelatedProducts(product.category);
  } catch (error) {
    console.error("Error loading product:", error);
    showError();
  }
}

// Display product detail
function displayProductDetail(product) {
  // Update page title
  document.title = `${product.name} - Shopee MVP`;

  // Breadcrumb
  document.getElementById("breadcrumbCategory").textContent =
    product.category || "Kategori";
  document.getElementById("breadcrumbName").textContent = product.name;

  // Product image
  const productImage = document.getElementById("productImage");
  if (product.image_url) {
    productImage.innerHTML = `<img src="${product.image_url}" alt="${product.name}">`;
  } else {
    productImage.innerHTML = "📦";
  }

  // Product info
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent =
    `Rp ${formatPrice(product.price)}`;

  // Stock status
  const stockElement = document.getElementById("productStock");
  if (product.stock > 0) {
    stockElement.textContent = `Stok: ${product.stock}`;
    stockElement.classList.remove("out-of-stock");
  } else {
    stockElement.textContent = "Stok Habis";
    stockElement.classList.add("out-of-stock");
    document.getElementById("buyBtn").disabled = true;
    document.getElementById("buyBtn").style.opacity = "0.5";
    document.getElementById("buyBtn").style.cursor = "not-allowed";
  }

  // Category
  document.getElementById("productCategory").textContent =
    product.category || "Uncategorized";

  // Description
  document.getElementById("productDescription").textContent =
    product.description || "Tidak ada deskripsi tersedia.";

  // Seller info
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

    // Filter out current product
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

// Create product card (with click to detail)
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

// Buy product (placeholder)
function buyProduct() {
  if (!currentProduct || currentProduct.stock === 0) {
    alert("Produk tidak tersedia!");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    alert("Silakan login terlebih dahulu untuk membeli produk!");
    window.location.href = "/login.html";
    return;
  }

  // Placeholder untuk fitur pembelian
  alert(
    `Fitur pembelian sedang dalam pengembangan!\n\nProduk: ${currentProduct.name}\nHarga: Rp ${formatPrice(currentProduct.price)}\n\nFitur ini akan segera tersedia.`,
  );
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail();
});
