// =====================
// PRODUCTS DATA
// =====================
const products = [
    { name: "Carton of Cherries",     price: 4,  quantity: 0, productId: 100, image: "cherry.jpg" },
    { name: "Carton of Strawberries", price: 5,  quantity: 0, productId: 101, image: "strawberry.jpg" },
    { name: "Bag of Oranges",         price: 10, quantity: 0, productId: 102, image: "orange.jpg" },
    { name: "Watermelon",             price: 8,  quantity: 0, productId: 103, image: "watermelon.jpg" },
    { name: "Mango",                  price: 6,  quantity: 0, productId: 104, image: "mango.jpg" },
    { name: "Red Grapes",             price: 7,  quantity: 0, productId: 105, image: "Rgrapes.jpg" },
    { name: "Bananas",                price: 3,  quantity: 0, productId: 106, image: "Bananas.jpeg" },
    { name: "Fresh Lemons",           price: 4,  quantity: 0, productId: 107, image: "Lemons.avif" },
    { name: "Peach",                  price: 5,  quantity: 0, productId: 108, image: "Peach.jpg" },
];

// =====================
// CART STATE
// =====================
const cart = [];
let totalPaid = 0;

// =====================
// HELPER FUNCTIONS
// =====================
function getProductById(id) {
    return products.find(function(p) { return p.productId === id; });
}

function getCartProductById(id) {
    return cart.find(function(p) { return p.productId === id; });
}

// =====================
// CART FUNCTIONS
// =====================
function addProductToCart(id) {
    let product = getProductById(id);
    if (!product) return;

    let cartProduct = getCartProductById(id);
    if (cartProduct) {
        cartProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
}

function increaseQuantity(id) {
    let product = getCartProductById(id);
    if (product) product.quantity += 1;
}

function decreaseQuantity(id) {
    let product = getCartProductById(id);
    if (!product) return;
    product.quantity -= 1;
    if (product.quantity === 0) removeProductFromCart(id);
}

function removeProductFromCart(id) {
    let product = getCartProductById(id);
    if (!product) return;
    product.quantity = 0;
    let index = cart.findIndex(function(item) { return item.productId === id; });
    if (index !== -1) cart.splice(index, 1);
}

function cartTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    return total;
}

function emptyCart() {
    for (let i = 0; i < cart.length; i++) {
        cart[i].quantity = 0;
    }
    cart.length = 0;
}

function pay(amount) {
    totalPaid += amount;
    let change = totalPaid - cartTotal();
    if (change >= 0) {
        emptyCart();
        totalPaid = 0;
    }
    return change;
}

// =====================
// EXPORTS (for Jest tests)
// =====================
if (typeof module !== 'undefined') {
    module.exports = {
        products,
        cart,
        addProductToCart,
        increaseQuantity,
        decreaseQuantity,
        removeProductFromCart,
        cartTotal,
        pay,
        emptyCart,
    };
}