// Product data
const products = [
    {
        id: 1,
        name: "Diamond Solitaire Ring",
        price: 1299.99,
        image: "images/product-1.jpg",
        category: "rings",
        rating: 5,
        description: "A timeless solitaire ring featuring a brilliant cut diamond set in 18k white gold. Perfect for engagements and special occasions."
    },
    {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 299.99,
        image: "images/product-2.jpg",
        category: "earrings",
        rating: 4,
        description: "Elegant pearl drop earrings with sterling silver settings. These classic earrings add sophistication to any outfit."
    },
    {
        id: 3,
        name: "Gold Chain Necklace",
        price: 599.99,
        image: "images/product-3.jpg",
        category: "necklaces",
        rating: 5,
        description: "A delicate 14k gold chain necklace with a subtle clasp. This versatile piece can be worn alone or layered with other necklaces."
    },
    {
        id: 4,
        name: "Silver Bangle Bracelet",
        price: 199.99,
        image: "images/product-4.jpg",
        category: "bracelets",
        rating: 4,
        description: "A sleek sterling silver bangle bracelet with a modern design. This piece makes a perfect gift for any occasion."
    },
    {
        id: 5,
        name: "Emerald Cut Diamond Ring",
        price: 1899.99,
        image: "images/product-5.jpg",
        category: "rings",
        rating: 5,
        description: "A stunning emerald cut diamond set in a vintage-inspired platinum band. This ring showcases the diamond's clarity and brilliance."
    },
    {
        id: 6,
        name: "Rose Gold Hoop Earrings",
        price: 149.99,
        image: "images/product-6.jpg",
        category: "earrings",
        rating: 4,
        description: "Modern rose gold hoop earrings with a polished finish. These lightweight hoops are comfortable for all-day wear."
    },
    {
        id: 7,
        name: "Sapphire Pendant Necklace",
        price: 799.99,
        image: "images/product-7.jpg",
        category: "necklaces",
        rating: 5,
        description: "A beautiful blue sapphire pendant suspended from a delicate gold chain. This piece makes a statement while remaining elegant."
    },
    {
        id: 8,
        name: "Tennis Bracelet",
        price: 1299.99,
        image: "images/product-8.jpg",
        category: "bracelets",
        rating: 5,
        description: "A classic tennis bracelet featuring a continuous line of brilliant cut diamonds set in white gold. The ultimate in luxury and elegance."
    }
];

// Global variables
let currentFilter = 'all';
let currentImageIndex = 0;
let productImages = [];
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const closeMobileNav = document.getElementById('close-mobile-nav');
const orderForm = document.getElementById('orderForm');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Display products
function displayProducts(filter = 'all') {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    // Reset product images array
    productImages = filteredProducts.map(product => ({
        src: product.image,
        alt: product.name,
        name: product.name,
        price: product.price
    }));
    
    filteredProducts.forEach((product, index) => {
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
            <img src="${product.image}" alt="${product.name}" class="product-img" data-index="${index}">
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
    
    // Add event listeners to product images for lightbox
    document.querySelectorAll('.product-img').forEach(img => {
        img.addEventListener('click', openLightbox);
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
    
    // Always fix labels on contact page load
    setTimeout(fixFormLabels, 100);
}

// Enhanced form label handling
function fixFormLabels() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Check if input has value on page load
            if (input.value.trim() !== '') {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        }
    });
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
    if (mobileNav) {
        mobileNav.classList.add('active');
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide mobile navigation
function hideMobileNav() {
    if (mobileNav) {
        mobileNav.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Handle order form submission
function handleOrderForm(e) {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const email = form.querySelector('#order-email').value;
    const phone = form.querySelector('#order-phone').value;
    
    // Validate contact info (either email or phone)
    if (!email && !phone) {
        alert('Please provide either an email address or phone number so we can contact you about your order.');
        return false;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting Order...';
    submitBtn.disabled = true;
    
    // Submit to Formspree using fetch API
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success - show confirmation
            showOrderSuccess();
            form.reset();
            fixFormLabels(); // Reset labels
        } else {
            // Error
            showOrderError();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showOrderError();
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
    
    return false;
}

// Show success message
function showOrderSuccess() {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Order Submitted Successfully!</h3>
            <p>Thank you for your order. We will contact you shortly to confirm your order details and discuss delivery options.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn">OK</button>
        </div>
    `;
    
    document.body.appendChild(successMessage);
}

// Show error message
function showOrderError() {
    alert('There was an error submitting your order. Please try again or contact us directly at +234 701 124 9065.');
}

// Lightbox Functions
function openLightbox(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    currentImageIndex = index;
    showImage(currentImageIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showImage(index) {
    if (productImages.length === 0) return;
    
    const image = productImages[index];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = `${image.name} - $${image.price.toFixed(2)}`;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    showImage(currentImageIndex);
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    showImage(currentImageIndex);
}

// Add keyboard navigation for lightbox
function handleKeydown(e) {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
}

// Initialize form field interactions
function initializeFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Handle input events
            input.addEventListener('input', function() {
                if (this.value) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
            
            // Handle focus events
            input.addEventListener('focus', function() {
                label.classList.add('active');
            });
            
            // Handle blur events
            input.addEventListener('blur', function() {
                if (!this.value) {
                    label.classList.remove('active');
                }
            });
        }
    });
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
        initializeFormFields();
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
    
    // Lightbox event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    // Close lightbox when clicking on background
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
});