// Product data
const products = [
    {
        id: 1,
        name: "Diamond Solitaire Ring",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "rings",
        rating: 5,
        description: "A timeless solitaire ring featuring a brilliant cut diamond set in 18k white gold. Perfect for engagements and special occasions."
    },
    {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "earrings",
        rating: 4,
        description: "Elegant pearl drop earrings with sterling silver settings. These classic earrings add sophistication to any outfit."
    },
    {
        id: 3,
        name: "Gold Chain Necklace",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "necklaces",
        rating: 5,
        description: "A delicate 14k gold chain necklace with a subtle clasp. This versatile piece can be worn alone or layered with other necklaces."
    },
    {
        id: 4,
        name: "Silver Bangle Bracelet",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "bracelets",
        rating: 4,
        description: "A sleek sterling silver bangle bracelet with a modern design. This piece makes a perfect gift for any occasion."
    },
    {
        id: 5,
        name: "Emerald Cut Diamond Ring",
        price: 1899.99,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "rings",
        rating: 5,
        description: "A stunning emerald cut diamond set in a vintage-inspired platinum band. This ring showcases the diamond's clarity and brilliance."
    },
    {
        id: 6,
        name: "Rose Gold Hoop Earrings",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "earrings",
        rating: 4,
        description: "Modern rose gold hoop earrings with a polished finish. These lightweight hoops are comfortable for all-day wear."
    },
    {
        id: 7,
        name: "Sapphire Pendant Necklace",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "necklaces",
        rating: 5,
        description: "A beautiful blue sapphire pendant suspended from a delicate gold chain. This piece makes a statement while remaining elegant."
    },
    {
        id: 8,
        name: "Tennis Bracelet",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "bracelets",
        rating: 5,
        description: "A classic tennis bracelet featuring a continuous line of brilliant cut diamonds set in white gold. The ultimate in luxury and elegance."
    }
];

// Global variables
let currentFilter = 'all';
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const closeMobileNav = document.getElementById('close-mobile-nav');
const orderForm = document.getElementById('orderForm');

// Display products
function displayProducts(filter = 'all') {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        // Create rating stars
        let ratingStars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= product.rating) {
                ratingStars += '<i class="fas fa-star"></i>';
            } else {
                ratingStars += '<i class="far fa-star"></i>';
            }
        }
        
        productCard.innerHTML = `
            ${product.id % 4 === 0 ? '<div class="product-badge">New</div>' : ''}
            ${product.id % 3 === 0 ? '<div class="product-badge">Sale</div>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${ratingStars}</div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="order-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Order Now</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to Order buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', handleOrder);
    });
}

// Handle order button click
function handleOrder(e) {
    const productName = e.target.getAttribute('data-name');
    const productPrice = e.target.getAttribute('data-price');
    
    // Store product info in localStorage
    localStorage.setItem('selectedProduct', productName);
    localStorage.setItem('selectedPrice', productPrice);
    
    // Redirect to contact page
    window.location.href = 'contact.html';
}

// Prefill order form on contact page
function prefillOrderForm() {
    const productName = localStorage.getItem('selectedProduct');
    const productPrice = localStorage.getItem('selectedPrice');
    
    if (productName && productPrice) {
        document.getElementById('product').value = productName;
        document.getElementById('price').value = productPrice;
        document.getElementById('order-product').value = productName;
        document.getElementById('order-price').value = `$${parseFloat(productPrice).toFixed(2)}`;
        
        // Clear localStorage
        localStorage.removeItem('selectedProduct');
        localStorage.removeItem('selectedPrice');
    }
}

// Filter products
function filterProducts(e) {
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter products
    currentFilter = e.target.getAttribute('data-filter');
    displayProducts(currentFilter);
}

// Show mobile navigation
function showMobileNav() {
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide mobile navigation
function hideMobileNav() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle order form submission
function handleOrderForm(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const phone = formData.get('phone');
    
    // Validate contact info (either email or phone)
    if (!email && !phone) {
        alert('Please provide either an email address or phone number so we can contact you about your order.');
        return false;
    }
    
    // Formspree will handle the submission
    return true;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products on shop page
    if (productGrid) {
        displayProducts();
    }
    
    // Prefill order form on contact page
    if (window.location.pathname.includes('contact.html')) {
        prefillOrderForm();
    }
    
    // Add filter button listeners
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', filterProducts);
        });
    }
    
    // Mobile navigation
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', showMobileNav);
    }
    
    if (closeMobileNav) {
        closeMobileNav.addEventListener('click', hideMobileNav);
    }
    
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', hideMobileNav);
    }
    
    // Order form
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderForm);
    }
});

// Enhanced form label handling
function fixFormLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Check if input has value on page load
            if (input.value.trim() !== '') {
                label.style.top = '-20px';
                label.style.fontSize = '12px';
                label.style.color = 'var(--primary-gold)';
            }
            
            // Also handle readonly fields specifically
            if (input.hasAttribute('readonly') && input.value.trim() !== '') {
                label.style.top = '-20px';
                label.style.fontSize = '12px';
                label.style.color = 'var(--primary-gold)';
            }
        }
    });
}

// Update the prefillOrderForm function
function prefillOrderForm() {
    const productName = localStorage.getItem('selectedProduct');
    const productPrice = localStorage.getItem('selectedPrice');
    
    if (productName && productPrice) {
        document.getElementById('product').value = productName;
        document.getElementById('price').value = productPrice;
        document.getElementById('order-product').value = productName;
        document.getElementById('order-price').value = `$${parseFloat(productPrice).toFixed(2)}`;
        
        // Fix the labels after pre-filling
        setTimeout(fixFormLabels, 100);
        
        // Clear localStorage
        localStorage.removeItem('selectedProduct');
        localStorage.removeItem('selectedPrice');
    }
}

// Update the event listeners to include fixFormLabels
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products on shop page
    if (productGrid) {
        displayProducts();
    }
    
    // Prefill order form on contact page
    if (window.location.pathname.includes('contact.html')) {
        prefillOrderForm();
        // Also fix labels on page load
        setTimeout(fixFormLabels, 200);
    }
    
    // ... rest of your existing code ...
});