// cart.js - Shopping cart functions

let cartData = null;

// Check if user is logged in
function checkLoginForCart() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    alert("Silakan login terlebih dahulu untuk mengakses keranjang!");
    window.location.href = "/login.html";
    return false;
  }

  return true;
}

// Load cart
async function loadCart() {
  if (!checkLoginForCart()) return;

  const token = localStorage.getItem("token");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const emptyCart = document.getElementById("emptyCart");
  const cartContent = document.getElementById("cartContent");

  try {
    const response = await fetch(`${API_URL}/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load cart");
    }

    const data = await response.json();
    cartData = data;

    if (loadingSpinner) loadingSpinner.style.display = "none";

    if (data.total_items === 0) {
      if (emptyCart) emptyCart.style.display = "block";
      if (cartContent) cartContent.style.display = "none";
    } else {
      if (emptyCart) emptyCart.style.display = "none";
      if (cartContent) cartContent.style.display = "grid";
      displayCart(data);
    }
  } catch (error) {
    console.error("Error loading cart:", error);
    if (loadingSpinner) loadingSpinner.style.display = "none";
    alert("Gagal memuat keranjang. Silakan refresh halaman.");
  }
}

// Display cart items
function displayCart(data) {
  const cartItemsList = document.getElementById("cartItemsList");

  if (cartItemsList) {
    cartItemsList.innerHTML = "";

    data.items.forEach((item) => {
      const cartItemElement = createCartItem(item);
      cartItemsList.appendChild(cartItemElement);
    });
  }

  // Update summary
  document.getElementById("totalItems").textContent = data.total_items;
  document.getElementById("totalQuantity").textContent = data.total_quantity;
  document.getElementById("totalPrice").textContent =
    `Rp ${formatPrice(data.total_price)}`;
}

// Create cart item element
function createCartItem(item) {
  const div = document.createElement("div");
  div.className = "cart-item";
  div.id = `cart-item-${item.id}`;

  const product = item.product;

  div.innerHTML = `
        <div class="cart-item-image">
            ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}">` : "📦"}
        </div>
        <div class="cart-item-info">
            <h4 class="cart-item-name">${product.name}</h4>
            <div class="cart-item-price">Rp ${formatPrice(product.price)}</div>
            <div class="cart-item-stock">Stok tersedia: ${product.stock}</div>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-control">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1}, ${product.stock})" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1}, ${product.stock})" ${item.quantity >= product.stock ? "disabled" : ""}>+</button>
            </div>
            <button class="btn-remove" onclick="removeItem(${item.id}, '${product.name}')">🗑️ Hapus</button>
        </div>
    `;

  return div;
}

// Update quantity
async function updateQuantity(itemId, newQuantity, maxStock) {
  if (newQuantity < 1 || newQuantity > maxStock) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      await loadCart(); // Reload cart
    } else {
      const data = await response.json();
      alert("Gagal update quantity: " + data.detail);
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Terjadi kesalahan saat update quantity");
  }
}

// Remove item from cart
async function removeItem(itemId, productName) {
  if (!confirm(`Hapus "${productName}" dari keranjang?`)) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      await loadCart(); // Reload cart
    } else {
      const data = await response.json();
      alert("Gagal menghapus item: " + data.detail);
    }
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Terjadi kesalahan saat menghapus item");
  }
}

// Clear cart
async function clearCart() {
  if (!confirm("Yakin ingin mengosongkan seluruh keranjang?")) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/cart/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      await loadCart(); // Reload cart
    } else {
      alert("Gagal mengosongkan keranjang");
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    alert("Terjadi kesalahan");
  }
}

// Show checkout modal
function showCheckoutModal() {
  if (!cartData || cartData.total_items === 0) {
    alert("Keranjang kosong!");
    return;
  }

  // Populate checkout items
  const checkoutItems = document.getElementById("checkoutItems");
  if (checkoutItems) {
    checkoutItems.innerHTML = "";

    cartData.items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "checkout-item";
      div.innerHTML = `
                <div>
                    <div class="checkout-item-name">${item.product.name}</div>
                    <div class="checkout-item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">Rp ${formatPrice(item.product.price * item.quantity)}</div>
            `;
      checkoutItems.appendChild(div);
    });
  }

  // Update total
  document.getElementById("checkoutTotal").textContent =
    `Rp ${formatPrice(cartData.total_price)}`;

  // Show modal
  document.getElementById("checkoutModal").style.display = "block";
}

// Close checkout modal
function closeCheckoutModal() {
  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("checkoutForm").reset();
  document.getElementById("checkoutError").classList.remove("show");
  document.getElementById("checkoutSuccess").classList.remove("show");
}

// Handle checkout
async function handleCheckout(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const shippingAddress = document.getElementById("shippingAddress").value;
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutError = document.getElementById("checkoutError");
  const checkoutSuccess = document.getElementById("checkoutSuccess");

  // Validate address
  if (shippingAddress.length < 10) {
    checkoutError.textContent = "Alamat pengiriman minimal 10 karakter";
    checkoutError.classList.add("show");
    return;
  }

  // Prepare order data
  const orderData = {
    shipping_address: shippingAddress,
    items: cartData.items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    })),
  };

  try {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "⏳ Memproses...";

    const response = await fetch(`${API_URL}/orders/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok) {
      checkoutSuccess.textContent = `Pesanan berhasil dibuat! Order ID: ${data.id}`;
      checkoutSuccess.classList.add("show");
      checkoutError.classList.remove("show");

      // Clear cart after successful order
      await fetch(`${API_URL}/cart/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setTimeout(() => {
        closeCheckoutModal();
        window.location.href = "/orders.html";
      }, 2000);
    } else {
      checkoutError.textContent = data.detail || "Gagal membuat pesanan";
      checkoutError.classList.add("show");
      checkoutSuccess.classList.remove("show");
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = "Buat Pesanan";
    }
  } catch (error) {
    console.error("Error creating order:", error);
    checkoutError.textContent = "Terjadi kesalahan. Silakan coba lagi.";
    checkoutError.classList.add("show");
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Buat Pesanan";
  }
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("checkoutModal");
  if (event.target === modal) {
    closeCheckoutModal();
  }
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
});
