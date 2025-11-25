// ===== PRODUCT DETAIL PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initProductPage();
});

function initProductPage() {
    setupProductEventListeners();
    setupImageGallery();
    setupProductTabs();
    loadRelatedProducts();
}

// ===== PRODUCT GALLERY =====
function setupImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.src;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ===== PRODUCT OPTIONS =====
function setupProductEventListeners() {
    // Option buttons (metal type, etc.)
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', handleOptionSelection);
    });
    
    // Quantity selector
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');
    
    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => adjustQuantity(-1, qtyInput));
        plusBtn.addEventListener('click', () => adjustQuantity(1, qtyInput));
        qtyInput.addEventListener('change', validateQuantity);
    }
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addProductToCart);
    }
    
    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', toggleWishlist);
    }
    
    // Size selection
    const sizeSelect = document.querySelector('.size-select');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', handleSizeSelection);
    }
}

function handleOptionSelection(e) {
    const button = e.target;
    const optionType = button.getAttribute('data-option');
    const optionValue = button.getAttribute('data-value');
    
    // Remove active class from all buttons in this group
    const allButtons = button.parentElement.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Update product display based on selection
    updateProductVariant(optionType, optionValue);
}

function updateProductVariant(optionType, optionValue) {
    // This would typically update the product image, price, etc.
    // based on the selected variant
    console.log(`Selected ${optionType}: ${optionValue}`);
    
    // Example: Update price for different metal types
    if (optionType === 'metal') {
        const priceElement = document.querySelector('.current-price');
        if (priceElement) {
            const basePrice = 1299.99; // This should come from product data
            let adjustedPrice = basePrice;
            
            switch(optionValue) {
                case 'yellow-gold':
                    adjustedPrice = basePrice;
                    break;
                case 'white-gold':
                    adjustedPrice = basePrice + 100;
                    break;
                case 'rose-gold':
                    adjustedPrice = basePrice + 150;
                    break;
            }
            
            priceElement.textContent = `$${adjustedPrice.toFixed(2)}`;
        }
    }
}

function adjustQuantity(change, inputElement) {
    let currentValue = parseInt(inputElement.value) || 1;
    let newValue = currentValue + change;
    
    // Ensure quantity is between 1 and 10
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    inputElement.value = newValue;
}

function validateQuantity(e) {
    let value = parseInt(e.target.value);
    
    if (isNaN(value) || value < 1) {
        e.target.value = 1;
    } else if (value > 10) {
        e.target.value = 10;
    }
}

function handleSizeSelection(e) {
    const selectedSize = e.target.value;
    
    if (!selectedSize) {
        // Show error or disable add to cart
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.disabled = true;
            addToCartBtn.title = 'Please select a size';
        }
    } else {
        // Enable add to cart
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.disabled = false;
            addToCartBtn.title = '';
        }
    }
}

// ===== ADD TO CART FROM PRODUCT PAGE =====
function addProductToCart() {
    // Get product details from the page
    const productName = document.querySelector('.product-info h1').textContent;
    const productPrice = parseFloat(document.querySelector('.current-price').textContent.replace('$', ''));
    const productImage = document.getElementById('main-product-image').src;
    const quantity = parseInt(document.querySelector('.qty-input').value) || 1;
    
    // Get selected options
    const selectedMetal = document.querySelector('.option-btn[data-option="metal"].active');
    const metalType = selectedMetal ? selectedMetal.getAttribute('data-value') : 'white-gold';
    
    const selectedSize = document.querySelector('.size-select');
    const ringSize = selectedSize ? selectedSize.value : null;
    
    // Validate size selection for rings
    if (productName.toLowerCase().includes('ring') && !ringSize) {
        alert('Please select a ring size before adding to cart.');
        return;
    }
    
    // Create product variant object
    const productVariant = {
        id: generateVariantId(), // In real app, this would come from your backend
        name: productName,
        price: productPrice,
        image: productImage,
        metal: metalType,
        size: ringSize,
        quantity: quantity
    };
    
    // Add to cart
    addVariantToCart(productVariant);
}

function generateVariantId() {
    // This would typically be handled by your backend
    return Date.now(); // Simple timestamp-based ID for demo
}

function addVariantToCart(variant) {
    const cart = window.vmjewels.cart;
    
    // Check if same variant already exists in cart
    const existingItem = cart.find(item => 
        item.id === variant.id && 
        item.metal === variant.metal && 
        item.size === variant.size
    );
    
    if (existingItem) {
        existingItem.quantity += variant.quantity;
    } else {
        cart.push({
            ...variant,
            baseProductId: getBaseProductId() // This would link to the main product
        });
    }
    
    window.vmjewels.updateCart();
    window.vmjewels.saveCartToStorage();
    
    // Show success feedback
    showAddToCartSuccess();
}

function getBaseProductId() {
    // This would extract the base product ID from the URL or data attributes
    // For now, return a mock ID
    return 1;
}

function showAddToCartSuccess() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const originalText = addToCartBtn.textContent;
    
    addToCartBtn.textContent = 'Added to Cart!';
    addToCartBtn.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.style.backgroundColor = '';
        
        // Show cart sidebar
        if (typeof window.vmjewels.showCart === 'function') {
            window.vmjewels.showCart();
        }
    }, 2000);
}

// ===== WISHLIST FUNCTIONALITY =====
function toggleWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const isInWishlist = wishlistBtn.classList.contains('in-wishlist');
    
    if (isInWishlist) {
        removeFromWishlist();
        wishlistBtn.classList.remove('in-wishlist');
        wishlistBtn.textContent = 'Add to Wishlist';
    } else {
        addToWishlist();
        wishlistBtn.classList.add('in-wishlist');
        wishlistBtn.textContent = 'Added to Wishlist';
    }
}

function addToWishlist() {
    const product = getCurrentProductData();
    
    // Get existing wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('vmjewels-wishlist') || '[]');
    
    // Check if product is already in wishlist
    const existingItem = wishlist.find(item => item.id === product.id);
    
    if (!existingItem) {
        wishlist.push(product);
        localStorage.setItem('vmjewels-wishlist', JSON.stringify(wishlist));
    }
    
    showWishlistFeedback('Added to wishlist!');
}

function removeFromWishlist() {
    const product = getCurrentProductData();
    
    const wishlist = JSON.parse(localStorage.getItem('vmjewels-wishlist') || '[]');
    const updatedWishlist = wishlist.filter(item => item.id !== product.id);
    
    localStorage.setItem