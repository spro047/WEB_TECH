// Booking Step Navigation
function goToBookingStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });

    // Remove active class from all step indicators
    document.querySelectorAll('.booking-steps .step').forEach(step => {
        step.classList.remove('active');
    });

    // Show selected step
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Mark step as active
    const stepIndicator = document.querySelectorAll('.booking-steps .step')[stepNumber - 1];
    if (stepIndicator) {
        stepIndicator.classList.add('active');
    }

    // Mark previous steps as completed
    for (let i = 0; i < stepNumber - 1; i++) {
        const prevStep = document.querySelectorAll('.booking-steps .step')[i];
        if (prevStep) {
            prevStep.classList.add('completed');
        }
    }
}

// Add Additional Traveller
// Add Additional Traveller
let travelerCount = 0;

function getPlannedTravelerCount() {
    const tripData = JSON.parse(localStorage.getItem('currentTrip'));
    return tripData ? (parseInt(tripData.travelers) || 1) : 1;
}

function addTraveler() {
    const maxTravelers = getPlannedTravelerCount();

    // We start with 1 primary traveler. travelerCount tracks *additional* travelers.
    // So total current travelers = 1 + travelerCount.
    // If we want to add one more, valid if (1 + travelerCount + 1) <= maxTravelers

    if (1 + travelerCount >= maxTravelers) {
        alert(`You can only add details for ${maxTravelers} traveler(s) as per your selection.`);
        return;
    }

    travelerCount++;
    const container = document.getElementById('additional-travelers');
    const travelerDiv = document.createElement('div');
    travelerDiv.className = 'form-section';
    travelerDiv.innerHTML = `
        <h4>Traveller ${travelerCount + 1}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" required>
            </div>
            <div class="form-group">
                <label>Date of Birth</label>
                <input type="date">
            </div>
        </div>
        <button type="button" class="btn-remove-traveler" onclick="removeTraveler(this)">
            <i class="fas fa-times"></i> Remove
        </button>
    `;
    container.appendChild(travelerDiv);
}

function validateTravelers() {
    const maxTravelers = getPlannedTravelerCount();
    const currentTotal = 1 + travelerCount; // Primary + Additional

    if (currentTotal !== maxTravelers) {
        alert(`Please add details for all ${maxTravelers} travelers.`);
        return;
    }

    goToBookingStep(2);
}

function removeTraveler(button) {
    button.closest('.form-section').remove();
    travelerCount--;
}

// Select Payment Method
// Select Payment Method
function selectPaymentMethod(methodType, element) {
    // Update selected visual state
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    element.classList.add('selected');

    // Show appropriate form
    document.querySelectorAll('.payment-specific-form').forEach(form => {
        form.style.display = 'none';
    });

    const targetForm = document.getElementById(`${methodType}-form`);
    if (targetForm) {
        targetForm.style.display = 'block';
    }

    // Store current method
    localStorage.setItem('selectedPaymentMethod', methodType);
}

// Toggle Bank Details
function toggleBankDetails() {
    const bankSelect = document.getElementById('bank-select');
    const bankDetails = document.getElementById('bank-details');

    if (bankSelect && bankDetails) {
        if (bankSelect.value) {
            bankDetails.style.display = 'block';
        } else {
            bankDetails.style.display = 'none';
        }
    }
}

// Process Payment
async function processPayment() {
    // Get current payment method
    const normalizeVisible = (id) => {
        const el = document.getElementById(id);
        return el && el.style.display !== 'none';
    };

    let isValid = false;

    // Validate based on visible form
    if (normalizeVisible('card-form') || !document.querySelector('.payment-specific-form[style*="block"]')) {
        // Default to card
        const cardNumber = document.getElementById('card-number')?.value;
        const cardExpiry = document.getElementById('card-expiry')?.value;
        const cardCvv = document.getElementById('card-cvv')?.value;
        const cardName = document.getElementById('card-name')?.value;

        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
            alert('Please enter a valid 16-digit card number');
            return;
        }
        if (!cardExpiry) {
            alert('Please enter expiry date');
            return;
        }
        if (!cardCvv || cardCvv.length < 3) {
            alert('Please enter a valid CVV');
            return;
        }
        if (!cardName) {
            alert('Please enter cardholder name');
            return;
        }
        isValid = true;
    } else if (normalizeVisible('upi-form')) {
        const upiId = document.getElementById('upi-id')?.value;
        if (!upiId || !upiId.includes('@')) {
            alert('Please enter a valid UPI ID (e.g., user@bank)');
            return;
        }
        isValid = true;
    } else if (normalizeVisible('netbanking-form')) {
        const bankSelect = document.getElementById('bank-select');
        const userId = document.getElementById('bank-user-id')?.value;
        const password = document.getElementById('bank-password')?.value;

        if (!bankSelect || !bankSelect.value) {
            alert('Please select your bank');
            return;
        }
        if (!userId) {
            alert('Please enter your Customer ID / User ID');
            return;
        }
        if (!password) {
            alert('Please enter your Password');
            return;
        }
        isValid = true;
    }

    if (!isValid) return;

    // Check if logged in
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to book a trip');
        window.location.href = 'login.html';
        return;
    }

    // Get trip data
    const tripData = JSON.parse(localStorage.getItem('currentTrip'));
    if (!tripData) {
        alert('No trip details found. Please build a trip first.');
        window.location.href = 'trip-builder.html';
        return;
    }

    const payButton = document.querySelector('.btn-pay-now');
    if (payButton) {
        payButton.textContent = 'Processing...';
        payButton.disabled = true;
    }

    try {
        const response = await fetch('/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tripData)
        });

        if (response.ok) {
            // Success
            localStorage.removeItem('currentTrip');
            goToBookingStep(4);
        } else {
            const data = await response.json();
            if (response.status === 401) {
                alert('Session expired or invalid. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            } else {
                alert('Booking failed: ' + (data.message || 'Unknown error'));
            }
        }
    } catch (e) {
        console.error(e);
        alert('Error connecting to server. Please ensure the backend is running.');
    } finally {
        if (payButton) {
            payButton.textContent = 'Pay Now';
            payButton.disabled = false;
        }
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateNavigationForLogin === 'function') {
        updateNavigationForLogin();
    }
});

// Populate Booking Details
function populateBookingDetails() {
    const tripData = JSON.parse(localStorage.getItem('currentTrip'));
    if (!tripData) return;

    // Update Package Name
    const packageNameElement = document.getElementById('package-name');
    if (packageNameElement && tripData.destination) {
        if (tripData.isPackageBooking) {
            packageNameElement.textContent = tripData.destination;
        } else {
            // Capitalize destination
            const destination = tripData.destination.charAt(0).toUpperCase() + tripData.destination.slice(1);
            packageNameElement.textContent = `${destination} Trip Package`;
        }
    }

    // Update Prices
    if (tripData.totalPrice) {
        const basePriceElement = document.getElementById('base-price');
        const finalPriceElement = document.getElementById('final-price');

        const formattedPrice = `₹${tripData.totalPrice.toLocaleString()}`;

        if (basePriceElement) basePriceElement.textContent = formattedPrice;
        if (finalPriceElement) finalPriceElement.textContent = formattedPrice;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Populate booking details from localStorage
    populateBookingDetails();

    // Date validation logic: Explicitly remove 'min' attribute to allow any date for DOB
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.removeAttribute('min');
    });
});

