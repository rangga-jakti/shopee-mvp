// seller.js - Seller dashboard functions

let currentEditingProductId = null;

// Check if user is seller
function checkSellerAccess() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.is_seller) {
    alert("Akses ditolak! Hanya seller yang bisa mengakses halaman ini.");
    window.location.href = "/";
    return false;
  }

  // Update welcome message
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.textContent = `Selamat datang, ${user.full_name || user.username}!`;
  }

  return true;
}

// Load seller's products
async function loadMyProducts() {
  if (!checkSellerAccess()) return;

  const token = localStorage.getItem("token");
  const myProductsGrid = document.getElementById("myProductsGrid");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const noProducts = document.getElementById("noProducts");

  if (loadingSpinner) loadingSpinner.style.display = "block";
  if (myProductsGrid) myProductsGrid.innerHTML = "";
  if (noProducts) noProducts.style.display = "none";

  try {
    const response = await fetch(`${API_URL}/products/my/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();

    if (loadingSpinner) loadingSpinner.style.display = "none";

    if (products.length === 0) {
      if (noProducts) noProducts.style.display = "block";
      updateStats(products);
      return;
    }

    products.forEach((product) => {
      const productCard = createSellerProductCard(product);
      if (myProductsGrid) myProductsGrid.appendChild(productCard);
    });

    // Update stats
    updateStats(products);
  } catch (error) {
    console.error("Error loading products:", error);
    if (loadingSpinner) loadingSpinner.style.display = "none";
    if (myProductsGrid) {
      myProductsGrid.innerHTML =
        '<p style="color: red; text-align: center;">Gagal memuat produk.</p>';
    }
  }
}

// Create product card with edit/delete buttons
function createSellerProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

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
        <div class="product-card-actions">
            <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteProduct(${product.id}, '${product.name}')">🗑️ Hapus</button>
        </div>
    `;

  return card;
}

// Update dashboard stats
function updateStats(products) {
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("totalStock").textContent = totalStock;
  document.getElementById("totalValue").textContent =
    `Rp ${formatPrice(totalValue)}`;
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Show add product modal
function showAddProductModal() {
  currentEditingProductId = null;
  document.getElementById("modalTitle").textContent = "Tambah Produk Baru";
  document.getElementById("productForm").reset();
  document.getElementById("submitBtn").textContent = "Tambah Produk";
  document.getElementById("productModal").style.display = "block";
}

// Edit product
async function editProduct(productId) {
  currentEditingProductId = productId;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/products/${productId}`);
    const product = await response.json();

    document.getElementById("modalTitle").textContent = "Edit Produk";
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value =
      product.description || "";
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
    document.getElementById("productCategory").value =
      product.category || "Elektronik";
    document.getElementById("productImage").value = product.image_url || "";
    document.getElementById("submitBtn").textContent = "Update Produk";

    document.getElementById("productModal").style.display = "block";
  } catch (error) {
    console.error("Error loading product:", error);
    alert("Gagal memuat data produk");
  }
}

// Delete product
async function deleteProduct(productId, productName) {
  if (!confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Produk berhasil dihapus!");
      loadMyProducts();
    } else {
      const data = await response.json();
      alert("Gagal menghapus produk: " + data.detail);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Terjadi kesalahan saat menghapus produk");
  }
}

// Handle product form submit (add or edit)
async function handleProductSubmit(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const modalError = document.getElementById("modalError");
  const modalSuccess = document.getElementById("modalSuccess");

  const productData = {
    name: document.getElementById("productName").value,
    description: document.getElementById("productDescription").value || null,
    price: parseFloat(document.getElementById("productPrice").value),
    stock: parseInt(document.getElementById("productStock").value),
    category: document.getElementById("productCategory").value,
    image_url: document.getElementById("productImage").value || null,
  };

  try {
    let response;

    if (currentEditingProductId) {
      // Update existing product
      response = await fetch(`${API_URL}/products/${currentEditingProductId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
    } else {
      // Create new product
      response = await fetch(`${API_URL}/products/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
    }

    const data = await response.json();

    if (response.ok) {
      modalSuccess.textContent = currentEditingProductId
        ? "Produk berhasil diupdate!"
        : "Produk berhasil ditambahkan!";
      modalSuccess.classList.add("show");
      modalError.classList.remove("show");

      setTimeout(() => {
        closeProductModal();
        loadMyProducts();
      }, 1500);
    } else {
      modalError.textContent = data.detail || "Gagal menyimpan produk";
      modalError.classList.add("show");
      modalSuccess.classList.remove("show");
    }
  } catch (error) {
    console.error("Error saving product:", error);
    modalError.textContent = "Terjadi kesalahan. Pastikan server berjalan.";
    modalError.classList.add("show");
  }
}

// Close product modal
function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
  document.getElementById("productForm").reset();
  document.getElementById("modalError").classList.remove("show");
  document.getElementById("modalSuccess").classList.remove("show");
  currentEditingProductId = null;
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeProductModal();
  }
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  if (checkSellerAccess()) {
    loadMyProducts();
  }
});
