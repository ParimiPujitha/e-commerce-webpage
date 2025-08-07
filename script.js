// --- Enhanced E-commerce Website Frontend Logic ---

let products = [];
let cart = [];
let wishlist = [];
let currentUser = null;
let currentSlide = 0;
let searchTimeout;
const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    wishlistIcon: document.getElementById('wishlistIcon'),
    wishlistCount: document.getElementById('wishlistCount'),
    userBtn: document.getElementById('userBtn'),
    userText: document.getElementById('userText'),
    userDropdown: document.getElementById('userDropdown'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    closeMobileMenu: document.getElementById('closeMobileMenu'),
    backToTop: document.getElementById('backToTop'),
    heroSlider: document.getElementById('heroSlider'),
    heroIndicators: document.getElementById('heroIndicators'),
    prevSlide: document.getElementById('prevSlide'),
    nextSlide: document.getElementById('nextSlide'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    newsletterForm: document.getElementById('newsletterForm'),
    clearCartBtn: document.getElementById('clearCartBtn')
};

// Modal elements
const modals = {
    cart: document.getElementById('cartModal'),
    login: document.getElementById('loginModal'),
    register: document.getElementById('registerModal'),
    product: document.getElementById('productModal')
};

// Close buttons
const closeButtons = {
    cart: document.getElementById('closeCart'),
    login: document.getElementById('closeLogin'),
    register: document.getElementById('closeRegister'),
    product: document.getElementById('closeProduct')
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    loadCategories();
    setupEventListeners();
    setupHeroSlider();
    setupMobileMenu();
    setupBackToTop();
    updateCartCount();
    updateWishlistCount();
    startDealTimer();
}

function setupEventListeners() {
    // Search functionality
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Cart functionality
    elements.cartIcon.addEventListener('click', openCartModal);
    closeButtons.cart.addEventListener('click', closeCartModal);
    elements.clearCartBtn.addEventListener('click', clearCart);

    // User functionality
    elements.userBtn.addEventListener('click', toggleUserDropdown);
    elements.userDropdown.addEventListener('mouseleave', hideUserDropdown);

    // Wishlist functionality
    elements.wishlistIcon.addEventListener('click', openWishlistModal);

    // Mobile menu
    elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    elements.closeMobileMenu.addEventListener('click', closeMobileMenu);

    // Hero slider controls
    elements.prevSlide.addEventListener('click', () => changeSlide(-1));
    elements.nextSlide.addEventListener('click', () => changeSlide(1));

    // Load more functionality
    elements.loadMoreBtn.addEventListener('click', loadMoreProducts);

    // Newsletter
    elements.newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    // Modal close events
    Object.values(closeButtons).forEach(btn => {
        if (btn) btn.addEventListener('click', function() {
            const modalId = this.id.replace('close', '').toLowerCase();
            closeModal(modals[modalId]);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        Object.values(modals).forEach(modal => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Modal navigation
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(modals.login);
        openModal(modals.register);
    });

    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(modals.register);
        openModal(modals.login);
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.dataset.filter);
        });
    });

    // Scroll events
    window.addEventListener('scroll', handleScroll);
}

function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Auto-slide every 5 seconds
    setInterval(() => changeSlide(1), 5000);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function setupMobileMenu() {
    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function toggleMobileMenu() {
    elements.mobileMenu.classList.toggle('active');
    document.body.style.overflow = elements.mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    elements.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

function setupBackToTop() {
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function handleScroll() {
    // Back to top button visibility
    if (window.pageYOffset > 300) {
        elements.backToTop.classList.add('visible');
    } else {
        elements.backToTop.classList.remove('visible');
    }
}

function handleSearchInput() {
    clearTimeout(searchTimeout);
    const query = elements.searchInput.value.trim();
    
    if (query.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    searchTimeout = setTimeout(() => {
        showSearchSuggestions(query);
    }, 300);
}

function showSearchSuggestions(query) {
    const suggestions = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    elements.searchSuggestions.innerHTML = suggestions.map(product => `
        <div class="suggestion-item" onclick="selectSuggestion('${product.name}')">
            <i class="fas fa-search"></i>
            <span>${product.name}</span>
        </div>
    `).join('');
    
    elements.searchSuggestions.classList.add('active');
}

function hideSearchSuggestions() {
    elements.searchSuggestions.classList.remove('active');
}

function selectSuggestion(productName) {
    elements.searchInput.value = productName;
    hideSearchSuggestions();
    handleSearch();
}

async function loadProducts() {
    try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        products = data.products || data; // Handle both paginated and non-paginated responses
        displayProducts(products.slice(0, 8)); // Show first 8 products initially
    } catch (error) {
        console.error('Error loading products:', error);
        products = getStaticProducts();
        displayProducts(products.slice(0, 8));
    }
}

function loadCategories() {
    const categories = [
        { name: 'Mobile', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop' },
        { name: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop' },
        { name: 'Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop' },
        { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop' },
        { name: 'TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop' },
        { name: 'Tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop' }
    ];
    displayCategories(categories);
    populateCategoriesDropdown(categories);
}

function populateCategoriesDropdown(categories) {
    const dropdown = document.getElementById('categoriesDropdown');
    dropdown.innerHTML = categories.map(category => `
        <a href="#" class="dropdown-item" onclick="filterByCategory('${category.name}')">
            <img src="${category.image}" alt="${category.name}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover;">
            ${category.name}
        </a>
    `).join('');
}

function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    productsToShow.forEach(product => grid.appendChild(createProductCard(product)));
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const isInWishlist = wishlist.some(item => item._id === product._id);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300/f0f0f0/666?text=Product+Image'">
            ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ''}
            <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist('${product._id}')">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">₹${product.price.toLocaleString()}</span>
                ${product.originalPrice > product.price ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="reviews">(${product.reviews} reviews)</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart('${product._id}')">Add to Cart</button>
                <button class="view-details" onclick="viewProductDetails('${product._id}')">View Details</button>
            </div>
        </div>
    `;
    return card;
}

function displayCategories(categories) {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => filterByCategory(category.name);
        card.innerHTML = `
            <img src="${category.image}" alt="${category.name}" onerror="this.src='https://via.placeholder.com/150x150/f0f0f0/666?text=${category.name}'">
            <h3>${category.name}</h3>
        `;
        grid.appendChild(card);
    });
}

function generateStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = 5 - full - (half ? 1 : 0);
    return '<i class="fas fa-star"></i>'.repeat(full) + 
           (half ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(empty);
}

async function handleSearch() {
    const query = elements.searchInput.value.trim();
    if (!query) {
        displayProducts(products.slice(0, 8));
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/products/search/${encodeURIComponent(query)}`);
        const results = await res.json();
        displayProducts(results);
    } catch (error) {
        console.error('Error searching products:', error);
        const results = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.category.toLowerCase().includes(query.toLowerCase())
        );
        displayProducts(results);
    }
    
    hideSearchSuggestions();
}

async function filterByCategory(category) {
    try {
        const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
        const results = await res.json();
        displayProducts(results);
    } catch (error) {
        console.error('Error filtering by category:', error);
        const results = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        displayProducts(results);
    }
}

function filterProducts(filter) {
    let filteredProducts = [];
    
    switch(filter) {
        case 'trending':
            filteredProducts = products.filter(p => p.rating >= 4.5);
            break;
        case 'new':
            filteredProducts = products.slice(0, 4);
            break;
        case 'sale':
            filteredProducts = products.filter(p => p.originalPrice > p.price);
            break;
        default:
            filteredProducts = products.slice(0, 8);
    }
    
    displayProducts(filteredProducts);
}

function loadMoreProducts() {
    const currentProducts = document.querySelectorAll('.product-card').length;
    const nextProducts = products.slice(currentProducts, currentProducts + 4);
    
    if (nextProducts.length > 0) {
        nextProducts.forEach(product => {
            const card = createProductCard(product);
            document.getElementById('productsGrid').appendChild(card);
        });
    }
    
    if (currentProducts + 4 >= products.length) {
        elements.loadMoreBtn.style.display = 'none';
    }
}

async function addToCart(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    try {
        const res = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        if (res.ok) {
            const data = await res.json();
            cart = data.cart || cart;
            updateCartCount();
            showNotification('Product added to cart!', 'success');
        } else {
            addToCartLocal(productId);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        addToCartLocal(productId);
    }
}

function addToCartLocal(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    const existing = cart.find(i => i.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1, product });
    }
    
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function toggleWishlist(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item._id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist!', 'success');
    }
    
    updateWishlistCount();
    updateWishlistButtons();
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.onclick.toString().match(/['"]([^'"]+)['"]/)[1];
        const isInWishlist = wishlist.some(item => item._id === productId);
        btn.classList.toggle('active', isInWishlist);
    });
}

function updateCartCount() {
    elements.cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function updateWishlistCount() {
    elements.wishlistCount.textContent = wishlist.length;
}

function openCartModal() {
    displayCartItems();
    openModal(modals.cart);
}

function displayCartItems() {
    const container = document.getElementById('cartItems');
    const totalElem = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
                <button class="cta-btn primary" onclick="closeModal(modals.cart)">Start Shopping</button>
            </div>
        `;
        totalElem.textContent = '0';
        return;
    }
    
    let total = 0;
    container.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}" onerror="this.src='https://via.placeholder.com/60x60/f0f0f0/666?text=Product'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.product.name}</div>
                <div class="cart-item-price">₹${item.product.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    totalElem.textContent = total.toLocaleString();
}

async function updateQuantity(productId, newQuantity) {
    try {
        const res = await fetch(`${API_BASE}/cart/update`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity: newQuantity })
        });
        
        if (res.ok) {
            const data = await res.json();
            cart = data.cart || cart;
            updateCartCount();
            displayCartItems();
        } else {
            updateQuantityLocal(productId, newQuantity);
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        updateQuantityLocal(productId, newQuantity);
    }
}

function updateQuantityLocal(productId, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(i => i.productId !== productId);
    } else {
        const item = cart.find(i => i.productId === productId);
        if (item) item.quantity = newQuantity;
    }
    
    updateCartCount();
    displayCartItems();
}

function clearCart() {
    cart = [];
    updateCartCount();
    displayCartItems();
    showNotification('Cart cleared!', 'info');
}

function viewProductDetails(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    document.getElementById('productModalTitle').textContent = product.name;
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    // Create specifications HTML
    let specsHTML = '';
    if (product.specifications) {
        specsHTML = '<div class="product-specifications"><h4>Specifications:</h4><ul>';
        for (const [key, value] of Object.entries(product.specifications)) {
            specsHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        specsHTML += '</ul></div>';
    }
    
    document.getElementById('productModalBody').innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400/f0f0f0/666?text=Product+Image'">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-detail-price">
                    <span>₹${product.price.toLocaleString()}</span>
                    ${product.originalPrice > product.price ? 
                        `<span style='text-decoration:line-through;color:#999;margin-left:10px;'>₹${product.originalPrice.toLocaleString()}</span>` : ''}
                    ${discount > 0 ? `<span style='color:#ff6b6b;margin-left:10px;'>(-${discount}%)</span>` : ''}
                </div>
                <div class="product-detail-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                ${specsHTML}
                <div class="product-detail-actions">
                    <button class="add-to-cart" onclick="addToCart('${product._id}'); closeModal(modals.product);">Add to Cart</button>
                    <button class="view-details" onclick="buyNow('${product._id}')">Buy Now</button>
                </div>
            </div>
        </div>
    `;
    
    openModal(modals.product);
}

function toggleUserDropdown() {
    elements.userDropdown.classList.toggle('active');
}

function hideUserDropdown() {
    elements.userDropdown.classList.remove('active');
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (res.ok) {
            const result = await res.json();
            currentUser = result.user;
            localStorage.setItem('token', result.token);
            closeModal(modals.login);
            showNotification('Login successful!', 'success');
            updateUserButton();
        } else {
            const error = await res.json();
            showNotification(error.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, phone, password })
        });
        
        if (res.ok) {
            closeModal(modals.register);
            showNotification('Registration successful! Please login.', 'success');
        } else {
            const error = await res.json();
            showNotification(error.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

function updateUserButton() {
    if (currentUser) {
        elements.userText.textContent = `Hi, ${currentUser.username}`;
        elements.userBtn.onclick = logout;
    } else {
        elements.userText.textContent = 'Login';
        elements.userBtn.onclick = () => openModal(modals.login);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    updateUserButton();
    showNotification('Logged out successfully!', 'success');
}

function handleCheckout() {
    if (!currentUser) {
        closeModal(modals.cart);
        openModal(modals.login);
        showNotification('Please login to checkout', 'warning');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    showNotification(`Order placed successfully! Total: ₹${total.toLocaleString()}`, 'success');
    cart = [];
    updateCartCount();
    closeModal(modals.cart);
}

function buyNow(productId) {
    if (!currentUser) {
        closeModal(modals.product);
        openModal(modals.login);
        showNotification('Please login to purchase', 'warning');
        return;
    }
    
    const product = products.find(p => p._id === productId);
    if (product) {
        showNotification(`Order placed successfully! Total: ₹${product.price.toLocaleString()}`, 'success');
        closeModal(modals.product);
    }
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showNotification('Thank you for subscribing!', 'success');
    e.target.reset();
}

function startDealTimer() {
    // Simulate countdown timer for deals
    const timerElement = document.getElementById('dealTimer1');
    if (!timerElement) return;
    
    let timeLeft = 7200; // 2 hours in seconds
    
    const timer = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        const timeUnits = timerElement.querySelectorAll('.time-unit');
        timeUnits[0].textContent = hours.toString().padStart(2, '0');
        timeUnits[1].textContent = minutes.toString().padStart(2, '0');
        timeUnits[2].textContent = Math.floor(seconds / 10).toString();
        timeUnits[3].textContent = (seconds % 10).toString();
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            timerElement.innerHTML = '<span class="time-unit">00</span><span class="time-unit">00</span><span class="time-unit">00</span><span class="time-unit">00</span>';
        }
    }, 1000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    const colors = { 
        success: '#4CAF50', 
        error: '#f44336', 
        warning: '#ff9800', 
        info: '#2196F3' 
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .wishlist-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255,255,255,0.9);
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #ccc;
        z-index: 2;
    }
    .wishlist-btn.active {
        color: #ff6b6b;
    }
    .wishlist-btn:hover {
        background: white;
        transform: scale(1.1);
    }
    .product-specifications {
        margin: 1rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
    }
    .product-specifications h4 {
        margin-bottom: 0.5rem;
        color: #333;
    }
    .product-specifications ul {
        list-style: none;
        padding: 0;
    }
    .product-specifications li {
        padding: 0.25rem 0;
        border-bottom: 1px solid #eee;
    }
    .product-specifications li:last-child {
        border-bottom: none;
    }
`;
document.head.appendChild(notificationStyles);

function getStaticProducts() {
    return [
        {
            _id: 1,
            name: "Samsung Galaxy S24 Ultra",
            price: 129999,
            originalPrice: 149999,
            category: "Mobile",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
            description: "Latest Samsung flagship with S Pen, 200MP camera, and AI features. Experience the future of mobile technology with the most advanced smartphone ever created.",
            rating: 4.8,
            reviews: 234,
            inStock: true,
            specifications: {
                "Display": "6.8-inch Dynamic AMOLED 2X",
                "Processor": "Snapdragon 8 Gen 3",
                "RAM": "12GB",
                "Storage": "256GB",
                "Camera": "200MP + 12MP + 50MP + 10MP",
                "Battery": "5000mAh",
                "OS": "Android 14 with One UI 6.1"
            }
        },
        {
            _id: 2,
            name: "Apple iPhone 15 Pro Max",
            price: 149999,
            originalPrice: 159999,
            category: "Mobile",
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
            description: "Premium iPhone with titanium design, A17 Pro chip, and 5x optical zoom. The most powerful iPhone ever with groundbreaking camera capabilities.",
            rating: 4.9,
            reviews: 189,
            inStock: true,
            specifications: {
                "Display": "6.7-inch Super Retina XDR",
                "Processor": "A17 Pro chip",
                "RAM": "8GB",
                "Storage": "256GB",
                "Camera": "48MP + 12MP + 12MP",
                "Battery": "4441mAh",
                "OS": "iOS 17"
            }
        },
        {
            _id: 3,
            name: "MacBook Pro 16-inch M3 Max",
            price: 349999,
            originalPrice: 399999,
            category: "Laptop",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
            description: "Powerful laptop for professionals with M3 Max chip and Liquid Retina XDR display. The ultimate machine for creators and developers.",
            rating: 4.9,
            reviews: 156,
            inStock: true,
            specifications: {
                "Display": "16-inch Liquid Retina XDR",
                "Processor": "M3 Max chip",
                "RAM": "32GB",
                "Storage": "1TB SSD",
                "Graphics": "Integrated 40-core GPU",
                "Battery": "Up to 22 hours",
                "OS": "macOS Sonoma"
            }
        },
        {
            _id: 4,
            name: "Dell XPS 15 9530",
            price: 189999,
            originalPrice: 219999,
            category: "Laptop",
            image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
            description: "Premium Windows laptop with OLED display and RTX 4070 graphics. Perfect for content creators and power users.",
            rating: 4.7,
            reviews: 98,
            inStock: true,
            specifications: {
                "Display": "15.6-inch 3.5K OLED",
                "Processor": "Intel Core i9-13900H",
                "RAM": "32GB DDR5",
                "Storage": "1TB SSD",
                "Graphics": "RTX 4070 8GB",
                "Battery": "86Whr",
                "OS": "Windows 11 Pro"
            }
        },
        {
            _id: 5,
            name: "Sony WH-1000XM5",
            price: 29999,
            originalPrice: 34999,
            category: "Audio",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            description: "Industry-leading noise cancellation with exceptional sound quality. The best wireless headphones for music lovers.",
            rating: 4.8,
            reviews: 267,
            inStock: true,
            specifications: {
                "Type": "Over-ear wireless",
                "Noise Cancellation": "Industry-leading",
                "Battery Life": "30 hours",
                "Connectivity": "Bluetooth 5.2",
                "Weight": "250g",
                "Features": "Touch controls, Quick Charge"
            }
        },
        {
            _id: 6,
            name: "Samsung 65-inch QLED 4K TV",
            price: 129999,
            originalPrice: 149999,
            category: "TV",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
            description: "Quantum HDR with 100% color volume and Object Tracking Sound. Immerse yourself in stunning picture quality.",
            rating: 4.6,
            reviews: 134,
            inStock: true,
            specifications: {
                "Display": "65-inch QLED 4K",
                "Resolution": "3840 x 2160",
                "HDR": "Quantum HDR",
                "Smart TV": "Tizen OS",
                "Connectivity": "4 HDMI, 2 USB",
                "Audio": "Object Tracking Sound"
            }
        },
        {
            _id: 7,
            name: "Canon EOS R6 Mark II",
            price: 189999,
            originalPrice: 209999,
            category: "Camera",
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
            description: "Full-frame mirrorless camera with 24.2MP and 4K video. Perfect for professional photography and videography.",
            rating: 4.7,
            reviews: 89,
            inStock: true,
            specifications: {
                "Sensor": "24.2MP Full-frame CMOS",
                "Video": "4K 60p",
                "AF Points": "1053 AF areas",
                "ISO": "100-102400",
                "Burst": "40 fps",
                "Stabilization": "5-axis IBIS"
            }
        },
        {
            _id: 8,
            name: "Apple iPad Pro 12.9-inch",
            price: 109999,
            originalPrice: 129999,
            category: "Tablet",
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
            description: "M2 chip with Liquid Retina XDR display and Apple Pencil support. The most powerful iPad ever created.",
            rating: 4.8,
            reviews: 145,
            inStock: true,
            specifications: {
                "Display": "12.9-inch Liquid Retina XDR",
                "Processor": "M2 chip",
                "Storage": "256GB",
                "Camera": "12MP + 10MP",
                "Battery": "Up to 10 hours",
                "Features": "Apple Pencil 2 support"
            }
        }
    ];
} 