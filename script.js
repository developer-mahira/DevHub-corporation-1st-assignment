// Product Data
const products = [
    { id: 1, name: 'T-shirts with multiple colors, for men', price: 10.30, category: 'Clothes and wear', discount: 0, image: "assets/image16.jpeg"},
    { id: 2, name: 'Jeans pants for men blue color', price: 10.30, category: 'Clothes and wear', discount: 0, image: "assets/image18.jpeg" },
    { id: 3, name: 'Brown winter coat medium size', price: 12.50, category: 'Clothes and wear', discount: 0, image: "assets/image16.jpeg" },
    { id: 4, name: "Jeans bag for travel for men", price: 34.00, category: 'Sports and outdoor', discount: 0, image: "assets/image17.jpeg" },
    { id: 5, name: 'Leather wallet for men', price: 99.00, category: 'Sports and outdoor', discount: 0, image: "assets/images19.jpeg" },
    { id: 6, name: 'Canon camera black, 100x zoom', price: 9.99, category: 'Computer and tech', discount: 40, image: "assets/image10.jpeg" },
    { id: 7, name: 'Headset for gaming with mic', price: 8.99, category: 'Computer and tech', discount: 0, image: "assets/image8.jpeg" },
    { id: 8, name: 'Smartwatch silver color modern', price: 10.30, category: 'Computer and tech', discount: 0, image: "assets/image2.jpeg" },
    { id: 9, name: 'Blue wallet for men leather metarlfial', price: 10.30, category: 'Sports and outdoor', discount: 0, image: "assets/images19.jpeg" },
    { id: 10, name: 'Jeans bag for travel for men', price: 80.95, category: 'Sports and outdoor', discount: 0, image: "assets/image11.jpeg" },
];

const dealsProducts = [
    { id: 11, name: 'Smart watches', price: 100, discount: 25, category: 'Computer and tech', image: "assets/image2.jpeg" },
    { id: 12, name: 'Laptops', price: 500, discount: 15, category: 'Computer and tech', image: "assets/image13.jpeg" },
    { id: 13, name: 'GoPro cameras', price: 300, discount: 40, category: 'Computer and tech', image: "assets/image14.jpeg" },
    { id: 14, name: 'Headphones', price: 80, discount: 25, category: 'Computer and tech', image: "assets/image11.jpeg" },
    { id: 15, name: 'Canon cameras', price: 600, discount: 25, category: 'Computer and tech', image: "assets/image10.jpeg" },
];

// Global State
let cart = [];
let currentPage = 'home';
let selectedProduct = null;
let selectedCategory = 'All category';
let selectedSize = '';
let appliedDiscount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderDeals();
    renderRecommended();
    setupEventListeners();
    startDealsCountdown();
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// Cart Functions
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function addToCart(product, size = '') {
    const cartItem = { ...product, size, cartId: Date.now() };
    cart.push(cartItem);
    updateCart();
    toggleCart();
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCart();
}

function updateCart() {
    const cartBadge = document.getElementById('cartBadge');
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartFooter = document.getElementById('cartFooter');

    cartBadge.style.display = cart.length > 0 ? 'block' : 'none';
    cartBadge.textContent = cart.length;
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => {
            const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                        <p class="cart-item-price">$${price.toFixed(2)}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.cartId})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
        cartFooter.style.display = 'block';
    }
    updateCartTotal();
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => {
        const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return sum + price;
    }, 0);
    const total = subtotal * (1 - appliedDiscount / 100);
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function applyDiscount() {
    const code = document.getElementById('discountInput').value.toUpperCase();
    const discountMessage = document.getElementById('discountMessage');

    if (code === 'SAVE10') appliedDiscount = 10;
    else if (code === 'SAVE20') appliedDiscount = 20;
    else appliedDiscount = 0;

    discountMessage.innerHTML = appliedDiscount ? 
        `<p class="discount-applied">Discount: ${appliedDiscount}% OFF</p>` : 
        '<p style="color: #FF3B3B; font-size: 14px;">Invalid discount code</p>';

    updateCartTotal();
}

// Render Functions
function renderDeals() {
    const dealsGrid = document.getElementById('dealsGrid');
    dealsGrid.innerHTML = dealsProducts.map(product => `
        <div class="deal-card" onclick="showProductDetail(${product.id})">
            <div class="deal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p class="deal-discount">-${product.discount}%</p>
        </div>
    `).join('');
}

function renderRecommended() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    recommendedGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-name">${product.name}</p>
        </div>
    `).join('');
}

function renderProductsGrid() {
    const productsGridPage = document.getElementById('productsGridPage');
    const allProducts = [...products, ...dealsProducts];
    let filteredProducts = allProducts;

    if (selectedCategory !== 'All category') {
        filteredProducts = allProducts.filter(p => p.category === selectedCategory);
    }

    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQuery));
    }

    productsGridPage.innerHTML = filteredProducts.map(product => {
        const hasDiscount = product.discount > 0;
        const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

        return `
            <div class="product-card-page" onclick="showProductDetail(${product.id})">
                <div class="product-image-page">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <div class="price-row">
                    ${hasDiscount ? `
                        <span class="original-price">$${product.price.toFixed(2)}</span>
                        <span class="discount-price">$${finalPrice.toFixed(2)}</span>
                        <span class="discount-badge">-${product.discount}%</span>
                    ` : `<span class="price">$${product.price.toFixed(2)}</span>`}
                </div>
                <button class="buy-btn" onclick="event.stopPropagation(); addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Buy Now</button>
            </div>
        `;
    }).join('');
}

function renderRelatedProducts() {
    const relatedGrid = document.getElementById('relatedGrid');
    const relatedProducts = products.slice(0, 4);

    relatedGrid.innerHTML = relatedProducts.map(product => `
        <div class="related-card" onclick="showProductDetail(${product.id})">
            <div class="related-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <p class="related-name">${product.name}</p>
            <p class="related-price">$${product.price.toFixed(2)}</p>
        </div>
    `).join('');
}

// Page Navigation
function showPage(page) {
    currentPage = page;
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('productsPage').style.display = 'none';
    document.getElementById('productDetailPage').style.display = 'none';

    if (page === 'home') document.getElementById('homePage').style.display = 'block';
    else if (page === 'products') {
        document.getElementById('productsPage').style.display = 'block';
        renderProductsGrid();
    } else if (page === 'product-detail') {
        document.getElementById('productDetailPage').style.display = 'block';
    }
}

function filterCategory(category) {
    selectedCategory = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) btn.classList.add('active');
    });
    showPage('products');
}

function handleSearch() {
    if (currentPage === 'products') renderProductsGrid();
}

// Product Detail Functions
function showProductDetail(productId) {
    const allProducts = [...products, ...dealsProducts];
    selectedProduct = allProducts.find(p => p.id === productId);
    if (!selectedProduct) return;

    document.getElementById('detailName').textContent = selectedProduct.name;
    const priceSection = document.getElementById('detailPriceSection');
    const hasDiscount = selectedProduct.discount > 0;
    const finalPrice = hasDiscount ? selectedProduct.price * (1 - selectedProduct.discount / 100) : selectedProduct.price;

    priceSection.innerHTML = hasDiscount ? `
        <span class="detail-original-price">$${selectedProduct.price.toFixed(2)}</span>
        <span class="detail-discount-price">$${finalPrice.toFixed(2)}</span>
        <span class="detail-discount-badge">-${selectedProduct.discount}% OFF</span>
    ` : `<span class="detail-price">$${selectedProduct.price.toFixed(2)}</span>`;

    renderRelatedProducts();
    showPage('product-detail');
}

function selectSize(size) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === size) btn.classList.add('active');
    });
}

function addToCartFromDetail() {
    if (selectedProduct) addToCart(selectedProduct, selectedSize);
}

// Deals Countdown Timer
function startDealsCountdown() {
    let dealEndTime = localStorage.getItem('dealEndTime');
    if (!dealEndTime) {
        dealEndTime = Date.now() + (4 * 24 * 60 * 60 * 1000);
        localStorage.setItem('dealEndTime', dealEndTime);
    }

    function updateCountdown() {
        const now = Date.now();
        const diff = dealEndTime - now;
        if (diff <= 0) {
            localStorage.removeItem('dealEndTime');
            startDealsCountdown();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}
