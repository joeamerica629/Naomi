// ===== SHOP PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initShopPage();
});

function initShopPage() {
    setupShopEventListeners();
    displayShopProducts();
    updateResultsCount();
}

// ===== FILTERING AND SORTING =====
let currentFilters = {
    category: ['rings', 'necklaces', 'earrings', 'bracelets'],
    price: [],
    material: []
};

let currentSort = 'featured';

function setupShopEventListeners() {
    // Filter checkboxes
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // Pagination
    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', handlePageChange);
    });
    
    document.querySelector('.next-btn').addEventListener('click', handleNextPage);
}

function handleFilterChange(e) {
    const filterType = e.target.name;
    const filterValue = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked) {
        if (!currentFilters[filterType].includes(filterValue)) {
            currentFilters[filterType].push(filterValue);
        }
    } else {
        currentFilters[filterType] = currentFilters[filterType].filter(value => value !== filterValue);
    }
    
    applyFilters();
}

function handleSortChange(e) {
    currentSort = e.target.value;
    applyFilters();
}

function handlePageChange(e) {
    // Remove active class from all page buttons
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    e.target.classList.add('active');
    
    // In a real application, you would load the corresponding page data
    // For now, we'll just simulate pagination
    simulatePagination();
}

function handleNextPage() {
    const activePage = document.querySelector('.page-btn.active');
    const nextPage = activePage.nextElementSibling;
    
    if (nextPage && nextPage.classList.contains('page-btn')) {
        activePage.classList.remove('active');
        nextPage.classList.add('active');
        simulatePagination();
    }
}

function simulatePagination() {
    // Show loading state
    const productGrid = document.getElementById('shop-product-grid');
    productGrid.innerHTML = '<div class="loading">Loading products...</div>';
    
    // Simulate API call delay
    setTimeout(() => {
        applyFilters();
    }, 500);
}

// ===== PRODUCT FILTERING =====
function applyFilters() {
    let filteredProducts = [...window.vmjewels.products];
    
    // Apply category filters
    if (currentFilters.category.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            currentFilters.category.includes(product.category)
        );
    }
    
    // Apply price filters
    if (currentFilters.price.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return currentFilters.price.some(priceRange => {
                switch(priceRange) {
                    case '0-100':
                        return product.price <= 100;
                    case '100-500':
                        return product.price > 100 && product.price <= 500;
                    case '500-1000':
                        return product.price > 500 && product.price <= 1000;
                    case '1000+':
                        return product.price > 1000;
                    default:
                        return true;
                }
            });
        });
    }
    
    // Apply material filters (simulated - you would need material data in products)
    if (currentFilters.material.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            // This is a simplified example - you'd need actual material data
            return currentFilters.material.some(material => 
                product.name.toLowerCase().includes(material.toLowerCase())
            );
        });
    }
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, currentSort);
    
    displayFilteredProducts(filteredProducts);
    updateResultsCount(filteredProducts.length);
}

function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'name':
            return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        case 'newest':
            // Assuming newer products have higher IDs
            return sortedProducts.sort((a, b) => b.id - a.id);
        case 'featured':
        default:
            return sortedProducts;
    }
}

function displayFilteredProducts(filteredProducts) {
    const productGrid = document.getElementById('shop-product-grid');
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <h3>No products found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button class="btn btn-outline" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createShopProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Re-attach event listeners for the new product cards
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', window.vmjewels.addToCart);
        });
        
        document.querySelectorAll('.quick-view').forEach(button => {
            button.addEventListener('click', showQuickView);
        });
    }, 0);
}

function createShopProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    
    const ratingStars = createRatingStars(product.rating);
    const badge = createProductBadge(product.id);
    
    productCard.innerHTML = `
        ${badge}
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">${ratingStars} <span class="rating-count">(${Math.floor(Math.random() * 100) + 20})</span></div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="btn btn-outline quick-view" data-id="${product.id}" style="width: 100%; margin-top: 10px;">Quick View</button>
        </div>
    `;
    
    return productCard;
}

// ===== UTILITY FUNCTIONS =====
function createRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

function createProductBadge(productId) {
    if (productId % 4 === 0) return '<div class="product-badge">New</div>';
    if (productId % 3 === 0) return '<div class="product-badge">Sale</div>';
    return '';
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const actualCount = count !== undefined ? count : window.vmjewels.products.length;
        resultsCount.textContent = actualCount;
    }
}

function resetFilters() {
    // Reset all checkboxes
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
    
    // Reset filter state
    currentFilters = {
        category: ['rings', 'necklaces', 'earrings', 'bracelets'],
        price: [],
        material: []
    };
    
    // Reset sort
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.value = 'featured';
        currentSort = 'featured';
    }
    
    applyFilters();
}

function displayShopProducts() {
    applyFilters();
}

// ===== QUICK VIEW (Extend main.js functionality) =====
function showQuickView(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = window.vmjewels.products.find(p => p.id === productId);
    
    if (!product) return;
    
    // You would typically open a modal or navigate to product page
    // For now, we'll simulate quick view with an alert
    const quickViewModal = document.getElementById('product-modal');
    if (quickViewModal) {
        // Use the main.js modal functionality
        window.vmjewels.currentProductId = productId;
        updateModalContent(product);
        showModal();
    } else {
        // Fallback: show product details
        alert(`Quick View: ${product.name}\nPrice: $${product.price}\n${product.description}`);
    }
}

function updateModalContent(product) {
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalRating = document.getElementById('modal-rating');
    const modalDescription = document.getElementById('modal-description');
    const modalAddToCart = document.getElementById('modal-add-to-cart');
    
    if (modalImg) modalImg.src = product.image;
    if (modalTitle) modalTitle.textContent = product.name;
    if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
    if (modalRating) modalRating.innerHTML = createRatingStars(product.rating);
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalAddToCart) modalAddToCart.setAttribute('data-id', product.id);
}

function showModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}