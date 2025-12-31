// Check Login Status and Update Navigation
function updateNavigationForLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const navActions = document.querySelector('.nav-actions');

    if (navActions) {
        if (isLoggedIn) {
            // Hide login/signup buttons
            const loginBtn = navActions.querySelector('.btn-login');
            const signupBtn = navActions.querySelector('.btn-signup');
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';

            // Create or show user profile dropdown
            let profileDropdown = navActions.querySelector('.user-profile-dropdown');
            if (!profileDropdown) {
                profileDropdown = document.createElement('div');
                profileDropdown.className = 'user-profile-dropdown';
                profileDropdown.innerHTML = `
                    <div class="user-profile-trigger" onclick="toggleProfileDropdown()">
                        <i class="fas fa-user-circle"></i>
                        <span>${userData.name || 'User'}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="profile-dropdown-menu" id="profileDropdown">
                        <a href="profile.html"><i class="fas fa-user"></i> My Profile</a>
                        <a href="my-trips.html"><i class="fas fa-suitcase"></i> My Trips</a>
                        <a href="#" onclick="editProfile()"><i class="fas fa-edit"></i> Edit Profile</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                `;
                navActions.appendChild(profileDropdown);
            }
        } else {
            // Show login/signup buttons
            const loginBtn = navActions.querySelector('.btn-login');
            const signupBtn = navActions.querySelector('.btn-signup');
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';

            // Remove profile dropdown if exists
            const profileDropdown = navActions.querySelector('.user-profile-dropdown');
            if (profileDropdown) profileDropdown.remove();
        }
    }
}

// Toggle Profile Dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    const trigger = document.querySelector('.user-profile-trigger');
    if (dropdown && trigger && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Logout Function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    updateNavigationForLogin();
    window.location.href = 'index.html';
}

// Edit Profile
function editProfile() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const name = prompt('Enter your name:', userData.name || '');
    const email = prompt('Enter your email:', userData.email || '');
    const phone = prompt('Enter your phone:', userData.phone || '');

    if (name && email) {
        const updatedData = {
            name: name,
            email: email,
            phone: phone || userData.phone
        };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        updateNavigationForLogin();
        alert('Profile updated successfully!');
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigationForLogin();
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Search Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Destination Tabs
const destTabs = document.querySelectorAll('.dest-tab');
const destCarousels = document.querySelectorAll('.destinations-carousel');

destTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-dest');

        destTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        destCarousels.forEach(carousel => {
            carousel.classList.add('hidden');
        });

        const targetCarousel = document.getElementById(`${target}-destinations`);
        if (targetCarousel) {
            targetCarousel.classList.remove('hidden');
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation
const searchForm = document.getElementById('holidays-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fromCity = document.getElementById('from-city').value;
        const toDestination = document.getElementById('to-destination').value;
        const travelDate = document.getElementById('travel-date').value;

        if (!fromCity || !toDestination || !travelDate) {
            alert('Please fill in all required fields');
            return;
        }

        // Redirect to holidays page with search params
        window.location.href = `holidays.html?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toDestination)}&date=${travelDate}`;
    });
}

// Package Filter Functions (for holidays page)
function filterPackages() {
    const budgetFilter = document.getElementById('budget-filter')?.value || 'all';
    const durationFilter = document.getElementById('duration-filter')?.value || 'all';
    const typeFilter = document.getElementById('type-filter')?.value || 'all';
    const travelerFilter = document.getElementById('traveler-filter')?.value || 'all';

    const packageCards = document.querySelectorAll('.package-card');
    let visibleCount = 0;

    packageCards.forEach(card => {
        const budget = card.getAttribute('data-budget') || '';
        const duration = card.getAttribute('data-duration') || '';
        const type = card.getAttribute('data-type') || '';
        const traveler = card.getAttribute('data-traveler') || '';

        let show = true;

        if (budgetFilter !== 'all' && budget !== budgetFilter) show = false;
        if (durationFilter !== 'all' && duration !== durationFilter) show = false;
        if (typeFilter !== 'all' && !type.includes(typeFilter)) show = false;
        if (travelerFilter !== 'all' && !traveler.includes(travelerFilter)) show = false;

        if (show) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update results count
    const countElement = document.getElementById('results-count');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
}

// Sort Packages
function sortPackages(sortBy) {
    const container = document.querySelector('.packages-grid');
    if (!container) return;

    const packages = Array.from(container.children);

    packages.sort((a, b) => {
        if (sortBy === 'price-low') {
            const priceA = parseInt(a.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || 0);
            const priceB = parseInt(b.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || 0);
            return priceA - priceB;
        } else if (sortBy === 'price-high') {
            const priceA = parseInt(a.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || 0);
            const priceB = parseInt(b.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || 0);
            return priceB - priceA;
        } else if (sortBy === 'rating') {
            const ratingA = parseFloat(a.querySelector('.package-rating span')?.textContent || 0);
            const ratingB = parseFloat(b.querySelector('.package-rating span')?.textContent || 0);
            return ratingB - ratingA;
        }
        return 0;
    });

    packages.forEach(pkg => container.appendChild(pkg));
}

// Itinerary Accordion
const itineraryItems = document.querySelectorAll('.itinerary-item');
itineraryItems.forEach(item => {
    const header = item.querySelector('.itinerary-header');
    if (header) {
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            itineraryItems.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

// Trip Builder Functions
function updateTripPrice() {
    const hotelPrice = parseInt(document.getElementById('hotel-select')?.selectedOptions[0]?.dataset.price || 0);
    const transportPrice = parseInt(document.getElementById('transport-select')?.selectedOptions[0]?.dataset.price || 0);
    const activities = Array.from(document.querySelectorAll('.activity-checkbox:checked')).reduce((sum, cb) => {
        return sum + parseInt(cb.dataset.price || 0);
    }, 0);

    const basePrice = 5000; // Base package price
    const totalPrice = basePrice + hotelPrice + transportPrice + activities;

    const priceDisplay = document.getElementById('trip-total-price');
    if (priceDisplay) {
        priceDisplay.textContent = `₹${totalPrice.toLocaleString()}`;
    }
}

// Initialize trip builder price updates
document.addEventListener('DOMContentLoaded', () => {
    const hotelSelect = document.getElementById('hotel-select');
    const transportSelect = document.getElementById('transport-select');
    const activityCheckboxes = document.querySelectorAll('.activity-checkbox');

    if (hotelSelect) hotelSelect.addEventListener('change', updateTripPrice);
    if (transportSelect) transportSelect.addEventListener('change', updateTripPrice);
    activityCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateTripPrice);
    });

    updateTripPrice();
});

// Booking Form Validation
function validateBookingForm() {
    const travelerName = document.getElementById('traveler-name')?.value;
    const travelerEmail = document.getElementById('traveler-email')?.value;
    const travelerPhone = document.getElementById('traveler-phone')?.value;

    if (!travelerName || !travelerEmail || !travelerPhone) {
        alert('Please fill in all traveler details');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(travelerEmail)) {
        alert('Please enter a valid email address');
        return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(travelerPhone)) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }

    return true;
}

// Payment Method Selection
const paymentMethods = document.querySelectorAll('.payment-method');
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
    });
});

// Coupon Code Application
function applyCoupon() {
    const couponCode = document.getElementById('coupon-code')?.value;
    if (!couponCode) {
        alert('Please enter a coupon code');
        return;
    }

    // Simulate coupon validation
    const validCoupons = {
        'SAVE20': 20,
        'SUMMER30': 30,
        'WELCOME10': 10
    };

    if (validCoupons[couponCode.toUpperCase()]) {
        const discountPercent = validCoupons[couponCode.toUpperCase()];
        alert(`Coupon applied! You saved ${discountPercent}%`);
        updatePriceWithDiscount(discountPercent, couponCode.toUpperCase());
    } else {
        alert('Invalid coupon code');
    }
}

function updatePriceWithDiscount(discountPercent, couponCode) {
    const basePriceElement = document.getElementById('base-price');
    const finalPriceElement = document.getElementById('final-price');
    const discountRow = document.getElementById('discount-row');
    const discountAmountElement = document.getElementById('discount-amount');
    const appliedCouponElement = document.getElementById('applied-coupon-code');

    if (basePriceElement && finalPriceElement) {
        // Parse base price (remove non-numeric chars)
        const basePrice = parseInt(basePriceElement.textContent.replace(/[^\d]/g, ''));

        // Calculate discount amount
        const discountAmount = Math.round(basePrice * (discountPercent / 100));
        const finalPrice = basePrice - discountAmount;

        // Update UI
        if (discountRow) discountRow.style.display = 'flex';
        if (appliedCouponElement) appliedCouponElement.textContent = couponCode;
        if (discountAmountElement) discountAmountElement.textContent = `-₹${discountAmount.toLocaleString()}`;

        finalPriceElement.textContent = `₹${finalPrice.toLocaleString()}`;
    }
}

// Date Picker initialization removed to allow flexibility for DOB fields


// Image Gallery (for package details)
let currentImageIndex = 0;
const galleryImages = document.querySelectorAll('.gallery-image');

function showGalleryImage(index) {
    galleryImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    currentImageIndex = index;
}

function nextGalleryImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showGalleryImage(currentImageIndex);
}

function prevGalleryImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showGalleryImage(currentImageIndex);
}

// Initialize gallery if it exists
if (galleryImages.length > 0) {
    showGalleryImage(0);
    setInterval(nextGalleryImage, 5000); // Auto-rotate every 5 seconds
}

// Scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    transition: all 0.3s ease;
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// Handle Package Booking from Details Page
function handlePackageBooking(packageName, basePrice, durationDays = 1) {
    const dateInput = document.getElementById('booking-date');
    const travelersSelect = document.getElementById('booking-travelers');

    if (!dateInput || !dateInput.value) {
        alert('Please select a travel date.');
        return;
    }

    // Parse travelers (assuming format "X Travelers" or "X Traveler")
    let travelers = 1;
    if (travelersSelect) {
        const val = travelersSelect.value;
        const match = val.match(/(\d+)/);
        if (match) travelers = parseInt(match[1]);
    }

    const price = parseInt(basePrice.toString().replace(/[^\d]/g, ''));
    const total = price * travelers;

    // Calculate endDate
    const start = new Date(dateInput.value);
    const end = new Date(start);
    end.setDate(end.getDate() + (durationDays - 1));
    const endDateStr = end.toISOString().split('T')[0];

    const tripData = {
        destination: packageName,
        fromCity: "Package Start Point", // Default required field
        startDate: dateInput.value,
        endDate: endDateStr,          // Calculated required field
        travelers: travelers,
        totalPrice: total,
        packageType: "Holiday Package",
        isPackageBooking: true,
        hotel: "Included in Package",
        transport: "Included in Package"
    };

    localStorage.setItem('currentTrip', JSON.stringify(tripData));
    window.location.href = 'booking.html';
}

function customizePackage(destination) {
    const tripData = {
        destination: destination
    };
    localStorage.setItem('modifyTrip', JSON.stringify(tripData));
    window.location.href = 'trip-builder.html';
}
