// orders.js - Order history functions

// Check login
function checkLoginForOrders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    alert("Silakan login terlebih dahulu!");
    window.location.href = "/login.html";
    return false;
  }

  return true;
}

// Load orders
async function loadOrders() {
  if (!checkLoginForOrders()) return;

  const token = localStorage.getItem("token");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const emptyOrders = document.getElementById("emptyOrders");
  const ordersList = document.getElementById("ordersList");

  try {
    // Use extended endpoint to get product info
    const response = await fetch(`${API_URL}/orders/extended/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load orders");
    }

    const orders = await response.json();

    if (loadingSpinner) loadingSpinner.style.display = "none";

    if (orders.length === 0) {
      if (emptyOrders) emptyOrders.style.display = "block";
    } else {
      displayOrders(orders);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    if (loadingSpinner) loadingSpinner.style.display = "none";
    alert("Gagal memuat pesanan");
  }
}

// Display orders
function displayOrders(orders) {
  const ordersList = document.getElementById("ordersList");

  if (ordersList) {
    ordersList.innerHTML = "";

    orders.forEach((order) => {
      const orderCard = createOrderCard(order);
      ordersList.appendChild(orderCard);
    });
  }
}

// Create order card - WITH PRODUCT INFO
function createOrderCard(order) {
  const div = document.createElement("div");
  div.className = "order-card";

  const statusClass = getStatusClass(order.status);
  const statusText = getStatusText(order.status);

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  div.innerHTML = `
        <div class="order-header">
            <div class="order-id">
                <strong>Order #${order.id}</strong>
                <span class="order-date">${formattedDate}</span>
            </div>
            <span class="order-status ${statusClass}">${statusText}</span>
        </div>
        
        <div class="order-items-visual">
            ${order.items
              .map(
                (item) => `
                <div class="order-item-visual">
                    <div class="order-item-image">
                        ${
                          item.product.image_url
                            ? `<img src="${item.product.image_url}" alt="${item.product.name}">`
                            : "📦"
                        }
                    </div>
                    <div class="order-item-details">
                        <h4>${item.product.name}</h4>
                        <p>Rp ${formatPrice(item.price)} × ${item.quantity}</p>
                        <p class="item-subtotal">Subtotal: Rp ${formatPrice(item.price * item.quantity)}</p>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        
        <div class="order-footer">
            <div class="order-address">
                <strong>📍 Alamat Pengiriman:</strong>
                <p>${order.shipping_address}</p>
            </div>
            <div class="order-total">
                <div class="total-label">Total Pembayaran:</div>
                <div class="total-amount">Rp ${formatPrice(order.total_amount)}</div>
                ${
                  order.status === "pending"
                    ? `
                    <button onclick="payOrder(${order.id}, ${order.total_amount})" class="btn-pay">
                        💳 Bayar Sekarang
                    </button>
                `
                    : ""
                }
            </div>
        </div>
    `;

  return div;
}

// Get status class
function getStatusClass(status) {
  const classes = {
    pending: "status-pending",
    paid: "status-paid",
    shipped: "status-shipped",
    delivered: "status-delivered",
    cancelled: "status-cancelled",
  };
  return classes[status] || "status-pending";
}

// Get status text
function getStatusText(status) {
  const texts = {
    pending: "⏳ Menunggu Pembayaran",
    paid: "✅ Sudah Dibayar",
    shipped: "🚚 Sedang Dikirim",
    delivered: "📦 Selesai",
    cancelled: "❌ Dibatalkan",
  };
  return texts[status] || status;
}

// Pay order - PLACEHOLDER for payment
function payOrder(orderId, amount) {
  // For now, redirect to payment simulation page
  window.location.href = `/payment.html?order_id=${orderId}&amount=${amount}`;
}

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID").format(price);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
});
