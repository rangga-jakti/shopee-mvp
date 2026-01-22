// payment.js - Payment page functions

let orderId = null;
let totalAmount = 0;
let selectedPaymentMethod = null;
let timerInterval = null;

// Get URL parameters
function getURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        order_id: urlParams.get('order_id'),
        amount: urlParams.get('amount')
    };
}

// Initialize payment page
function initPaymentPage() {
    const params = getURLParams();
    
    if (!params.order_id || !params.amount) {
        alert('Data pembayaran tidak valid!');
        window.location.href = '/orders.html';
        return;
    }
    
    orderId = params.order_id;
    totalAmount = parseFloat(params.amount);
    
    // Display order info
    document.getElementById('orderId').textContent = `#${orderId}`;
    document.getElementById('totalAmount').textContent = `Rp ${formatPrice(totalAmount)}`;
    
    // Start payment timer (24 hours from now)
    startPaymentTimer();
}

// Start payment timer
function startPaymentTimer() {
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
    
    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById('paymentTimer').textContent = 'EXPIRED';
            document.getElementById('payButton').disabled = true;
            alert('Waktu pembayaran telah habis!');
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('paymentTimer').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Select payment method - FIX: Remove event dependency
function selectPayment(method) {
    selectedPaymentMethod = method;
    
    console.log('Selected payment method:', method);
    
    // Update radio button
    document.getElementById(method).checked = true;
    
    // Update all payment options visual state
    const allOptions = document.querySelectorAll('.payment-option');
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    const clickedOption = document.getElementById(method).closest('.payment-option');
    if (clickedOption) {
        clickedOption.classList.add('selected');
    }
    
    // Enable pay button
    const payButton = document.getElementById('payButton');
    payButton.disabled = false;
    payButton.textContent = `Bayar dengan ${getPaymentName(method)}`;
    payButton.classList.add('enabled');
}

// Get payment method name
function getPaymentName(method) {
    const names = {
        'gopay': 'GoPay',
        'ovo': 'OVO',
        'dana': 'DANA',
        'shopeepay': 'ShopeePay',
        'bca': 'Bank BCA',
        'mandiri': 'Bank Mandiri',
        'bni': 'Bank BNI',
        'cod': 'Cash on Delivery'
    };
    return names[method] || method;
}

// Process payment
async function processPayment() {
    if (!selectedPaymentMethod) {
        alert('Silakan pilih metode pembayaran!');
        return;
    }
    
    console.log('Processing payment for order:', orderId);
    console.log('Payment method:', selectedPaymentMethod);
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Silakan login terlebih dahulu!');
        window.location.href = '/login.html';
        return;
    }
    
    const payButton = document.getElementById('payButton');
    payButton.disabled = true;
    payButton.textContent = '⏳ Memproses pembayaran...';
    
    try {
        // Show payment processing
        showPaymentProcessing();
        
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update order status to paid
        console.log('Calling API to update order status...');
        
        const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment_method: selectedPaymentMethod
            })
        });
        
        console.log('API Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Payment success:', data);
            showPaymentSuccess();
        } else {
            const errorData = await response.json();
            console.error('Payment failed:', errorData);
            throw new Error(errorData.detail || 'Payment failed');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        
        // Remove processing modal
        const processingModal = document.querySelector('.payment-modal');
        if (processingModal) {
            processingModal.remove();
        }
        
        alert('Pembayaran gagal: ' + error.message);
        payButton.disabled = false;
        payButton.textContent = `Bayar dengan ${getPaymentName(selectedPaymentMethod)}`;
    }
}

// Show payment processing
function showPaymentProcessing() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.id = 'processingModal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-processing">
                <div class="spinner"></div>
                <h3>Memproses Pembayaran</h3>
                <p>Mohon tunggu sebentar...</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Show payment success
function showPaymentSuccess() {
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Remove processing modal
    const processingModal = document.getElementById('processingModal');
    if (processingModal) {
        processingModal.remove();
    }
    
    // Show success modal
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content success">
            <div class="success-icon">✅</div>
            <h2>Pembayaran Berhasil!</h2>
            <p>Pesanan Anda sedang diproses</p>
            <div class="success-details">
                <div class="detail-row">
                    <span>Order ID:</span>
                    <strong>#${orderId}</strong>
                </div>
                <div class="detail-row">
                    <span>Total:</span>
                    <strong>Rp ${formatPrice(totalAmount)}</strong>
                </div>
                <div class="detail-row">
                    <span>Metode:</span>
                    <strong>${getPaymentName(selectedPaymentMethod)}</strong>
                </div>
            </div>
            <button onclick="window.location.href='/orders.html'" class="btn-primary btn-large">
                Lihat Pesanan Saya
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment page loaded');
    initPaymentPage();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});