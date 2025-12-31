// Trip Builder Step Navigation
function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.builder-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all step indicators
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Show selected step
    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Mark step as active
    const stepIndicator = document.querySelector(`.step[data-step="${stepNumber}"]`);
    if (stepIndicator) {
        stepIndicator.classList.add('active');
    }

    // Mark previous steps as completed
    for (let i = 1; i < stepNumber; i++) {
        const prevStep = document.querySelector(`.step[data-step="${i}"]`);
        if (prevStep) {
            prevStep.classList.add('completed');
        }
    }

    // Update summary if on review step
    if (stepNumber === 5) {
        updateTripSummary();
    }
}

// Update Trip Summary
function updateTripSummary() {
    const fromCity = document.getElementById('from-city-select')?.value || 'Not selected';
    const destination = document.getElementById('destination-select')?.value || 'Not selected';
    const tripDate = document.getElementById('trip-date')?.value || 'Not selected';
    const returnDate = document.getElementById('return-date')?.value || 'Not selected';
    const travelers = document.getElementById('trip-travelers')?.value || 'Not selected';

    const selectedHotel = document.querySelector('input[name="hotel"]:checked');
    const hotelText = selectedHotel ? selectedHotel.nextElementSibling.querySelector('h3').textContent : 'Not selected';

    const selectedTransport = document.querySelector('input[name="transport"]:checked');
    const transportText = selectedTransport ? selectedTransport.nextElementSibling.querySelector('h3').textContent : 'Not selected';

    const selectedActivities = Array.from(document.querySelectorAll('.activity-checkbox:checked'));
    const activitiesText = selectedActivities.length > 0
        ? selectedActivities.map(cb => cb.nextElementSibling.querySelector('h3').textContent).join(', ')
        : 'No activities selected';

    // Update summary display
    let destText = destination.charAt(0).toUpperCase() + destination.slice(1);
    if (fromCity !== 'Not selected' && destination !== 'Not selected' && typeof showDistanceBetween === 'function') {
        const distance = showDistanceBetween(fromCity, destination);
        if (distance && typeof formatDistance === 'function') {
            destText += ` (${formatDistance(distance)} from ${fromCity.charAt(0).toUpperCase() + fromCity.slice(1)})`;
        }
    }
    document.getElementById('summary-destination').textContent = destText;
    document.getElementById('summary-dates').textContent = `${tripDate} to ${returnDate}`;
    document.getElementById('summary-travelers').textContent = travelers;
    document.getElementById('summary-hotel').textContent = hotelText;
    document.getElementById('summary-transport').textContent = transportText;
    document.getElementById('summary-activities').textContent = activitiesText;

    // Update price
    updateTripPrice();
}

// Update Trip Price
function updateTripPrice() {
    // 1. Calculate Duration
    const startDateInput = document.getElementById('trip-date');
    const returnDateInput = document.getElementById('return-date');
    let nights = 1;

    if (startDateInput && returnDateInput && startDateInput.value && returnDateInput.value) {
        const start = new Date(startDateInput.value);
        const end = new Date(returnDateInput.value);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        nights = diffDays > 0 ? diffDays : 1;
    }

    // 2. Hotel Price (Per Night * Nights)
    const selectedHotel = document.querySelector('input[name="hotel"]:checked');
    const hotelRate = selectedHotel ? parseInt(selectedHotel.dataset.price || 0) : 0;
    const totalHotelPrice = hotelRate * nights;

    // 3. Transport Price
    const selectedTransport = document.querySelector('input[name="transport"]:checked');
    const transportPrice = selectedTransport ? parseInt(selectedTransport.dataset.price || 0) : 0;

    // 4. Activity Prices
    const selectedActivities = document.querySelectorAll('.activity-checkbox:checked');
    let activityPrice = 0;
    selectedActivities.forEach(cb => {
        activityPrice += parseInt(cb.dataset.price || 0);
    });

    // 5. Calculate Total Per Person
    // Base platform fee could be 0 or small, let's say 0 for now as previously implicit 5000 was wrong context
    const totalPerPerson = totalHotelPrice + transportPrice + activityPrice;

    // 6. Update Display
    const priceDisplay = document.getElementById('trip-total-price');
    if (priceDisplay) {
        priceDisplay.textContent = `₹${totalPerPerson.toLocaleString()}`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tripDateInput = document.getElementById('trip-date');
    const returnDateInput = document.getElementById('return-date');

    if (tripDateInput) {
        tripDateInput.setAttribute('min', tomorrow.toISOString().split('T')[0]);
        tripDateInput.addEventListener('change', () => {
            if (returnDateInput && tripDateInput.value) {
                const selectedDate = new Date(tripDateInput.value);
                selectedDate.setDate(selectedDate.getDate() + 1);
                returnDateInput.setAttribute('min', selectedDate.toISOString().split('T')[0]);
            }
        });
    }

    if (returnDateInput) {
        returnDateInput.setAttribute('min', nextWeek.toISOString().split('T')[0]);
    }

    // Add event listeners for hotel and transport selection
    document.querySelectorAll('input[name="hotel"]').forEach(radio => {
        radio.addEventListener('change', updateTripPrice);
    });

    document.querySelectorAll('input[name="transport"]').forEach(radio => {
        radio.addEventListener('change', updateTripPrice);
    });
});

