// =====================
// DRAW FUNCTIONS
// =====================

function drawProducts() {
    let productList = document.querySelector('.products');
    let html = '';

    products.forEach(function(p) {
        html += `
            <div class="product-card" data-productId="${p.productId}">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-card-body">
                    <h3>${p.name}</h3>
                    <div class="product-footer">
                        <div class="price">$${p.price}<small>/unit</small></div>
                        <button class="add-to-cart" title="Add to cart">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    productList.innerHTML = html;
    document.getElementById('product-count').textContent = products.length + ' items available';
}

function drawCart() {
    let cartList = document.querySelector('.cart');
    let html = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="cart-empty-msg">Your cart is empty — add some fresh fruits!</p>';
    } else {
        cart.forEach(function(p) {
            let itemTotal = (p.price * p.quantity).toFixed(2);
            html += `
                <div class="cart-item" data-productId="${p.productId}">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="cart-item-info">
                        <h4>${p.name}</h4>
                        <span>$${p.price} each</span>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qdown">−</button>
                        <span class="qty-num">${p.quantity}</span>
                        <button class="qup">+</button>
                    </div>
                    <div class="cart-item-total">$${itemTotal}</div>
                    <button class="remove" title="Remove">✕</button>
                </div>
            `;
        });
        cartList.innerHTML = html;
    }

    // Update cart count badge in header
    let totalItems = 0;
    cart.forEach(function(p) { totalItems += p.quantity; });
    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('stat-items').textContent = totalItems;
}

function drawCheckout() {
    let total = cartTotal();
    let allTotals = document.querySelectorAll('.cart-total-amount');
    allTotals.forEach(function(el) {
        el.textContent = '$' + total.toFixed(2);
    });
}

// =====================
// INITIAL RENDER
// =====================
drawProducts();
drawCart();
drawCheckout();

// =====================
// EVENT LISTENERS
// =====================

// Add to cart
document.querySelector('.products').addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        let card = e.target.closest('[data-productId]');
        let productId = card.getAttribute('data-productId') * 1;
        addProductToCart(productId);
        drawCart();
        drawCheckout();

        // Button feedback
        e.target.textContent = '✓';
        setTimeout(function() { e.target.textContent = '+'; }, 800);
    }
});

// Cart item controls (increase / decrease / remove)
document.querySelector('.cart').addEventListener('click', function(e) {
    let item = e.target.closest('[data-productId]');
    if (!item) return;

    let productId = item.getAttribute('data-productId') * 1;

    if (e.target.classList.contains('qup')) {
        increaseQuantity(productId);
    } else if (e.target.classList.contains('qdown')) {
        decreaseQuantity(productId);
    } else if (e.target.classList.contains('remove')) {
        removeProductFromCart(productId);
    }

    drawCart();
    drawCheckout();
});

// Clear entire cart
document.querySelector('.empty-cart-btn').addEventListener('click', function() {
    emptyCart();
    drawCart();
    drawCheckout();
});

// Payment
document.querySelector('.pay').addEventListener('click', function(e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let amount = document.querySelector('.received').value * 1;

    if (amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    let cashReturn = pay(amount);
    let summary = document.querySelector('.pay-summary');
    let div = document.createElement('div');

    if (cashReturn >= 0) {
        div.className = 'pay-summary-msg msg-success';
        div.innerHTML = '→ Payment complete!<br>Cash: $' + amount.toFixed(2) + ' | Change: $' + cashReturn.toFixed(2) + '<br>Thank you!';
        drawCart();
        drawCheckout();
    } else {
        div.className = 'pay-summary-msg msg-warning';
        div.innerHTML = 'Not enough cash<br>Received: $' + amount.toFixed(2) + ' | Still owed: $' + Math.abs(cashReturn).toFixed(2);
    }

    summary.prepend(div);
    document.querySelector('.received').value = '';
});

// Shop Now button - scroll to products
document.querySelector('.hero-text button').addEventListener('click', function() {
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
});

// Sidebar filter buttons
document.querySelector('.sidebar').addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

       
      
        // Price: Low to High
        if (e.target.textContent === 'Price: Low to High') {
            products.sort(function(a, b) { return a.price - b.price; });
            drawProducts();
        }

        // Top Rated - Price: High to Low
        if (e.target.textContent === 'Price: High to Low') {
            products.sort(function(a, b) { return b.price - a.price; });
            drawProducts();
        }

        // Bestsellers - default
        if (e.target.textContent === 'Default') {
            products.sort(function(a, b) { return a.productId - b.productId; });
            drawProducts();
        }
    }
});