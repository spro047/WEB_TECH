// Destination images mapping
const destinationImages = {
    'goa': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
    'manali': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'kerala': 'https://images.unsplash.com/photo-1580730146773-b13ae4e7d110?w=400',
    'rajasthan': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    'darjeeling': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    'shimla': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'
};

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Calculate duration in days and nights
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays - 1;
    return { days: diffDays, nights };
}

// Get destination image
function getDestinationImage(destination) {
    const dest = destination.toLowerCase();
    return destinationImages[dest] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
}

// Format destination name
function formatDestinationName(destination) {
    // Handle multi-word city names (e.g., "new york" -> "New York")
    return destination
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Generate booking ID
function generateBookingId(tripId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const id = tripId.toString().slice(-3);
    return `TP${year}${month}${day}${id}`;
}

// Determine trip status based on dates
function determineTripStatus(trip) {
    if (trip.status === 'cancelled') return 'cancelled';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(trip.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (endDate < today) {
        return 'completed';
    }
    return 'upcoming';
}

// Fetch trips from API
async function fetchTrips() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return [];
    }

    try {
        const response = await fetch('/api/trips', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const trips = await response.json();
            // Update status based on dates
            trips.forEach(trip => {
                const actualStatus = determineTripStatus(trip);
                if (trip.status !== actualStatus && trip.status !== 'cancelled') {
                    trip.status = actualStatus;
                }
            });
            return trips;
        } else {
            console.error('Failed to fetch trips');
            return [];
        }
    } catch (error) {
        console.error('Error fetching trips:', error);
        return [];
    }
}

// Render trip card
function renderTripCard(trip) {
    const duration = calculateDuration(trip.startDate, trip.endDate);
    const status = determineTripStatus(trip);
    const statusClass = status === 'completed' ? 'completed' : status === 'cancelled' ? 'cancelled' : 'upcoming';
    const statusText = status === 'completed' ? 'Completed' : status === 'cancelled' ? 'Cancelled' : 'Upcoming';

    const bookingId = generateBookingId(trip._id);
    const destinationName = formatDestinationName(trip.destination);
    const imageUrl = getDestinationImage(trip.destination);

    const activitiesList = trip.activities && trip.activities.length > 0
        ? trip.activities.join(', ')
        : 'No activities selected';

    let actionButtons = '';
    if (status === 'upcoming') {
        actionButtons = `
            <button class="btn-download" onclick="downloadTicket('${trip._id}')">
                <i class="fas fa-download"></i> Download Ticket
            </button>
            <button class="btn-modify" onclick="modifyTrip('${trip._id}')">
                <i class="fas fa-edit"></i> Modify
            </button>
            <button class="btn-cancel" onclick="cancelTrip('${trip._id}')">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    } else if (status === 'completed') {
        actionButtons = `
            <button class="btn-download" onclick="downloadInvoice('${trip._id}')">
                <i class="fas fa-file-invoice"></i> Download Invoice
            </button>
            <button class="btn-review" onclick="writeReview('${trip._id}')">
                <i class="fas fa-star"></i> Write Review
            </button>
            <button class="btn-book-again" onclick="bookAgain('${trip.destination}')">
                <i class="fas fa-redo"></i> Book Again
            </button>
        `;
    } else {
        actionButtons = `
            <button class="btn-download" onclick="downloadInvoice('${trip._id}')">
                <i class="fas fa-file-invoice"></i> Download Invoice
            </button>
        `;
    }

    return `
        <div class="trip-card">
            <div class="trip-image">
                <img src="${imageUrl}" alt="${destinationName}">
                <span class="trip-status ${statusClass}">${statusText}</span>
            </div>
            <div class="trip-details">
                <div class="trip-header">
                    <h3>${destinationName} Trip</h3>
                    <span class="booking-id">Booking ID: ${bookingId}</span>
                </div>
                <div class="trip-info">
                    <p><i class="fas fa-map-marker-alt"></i> <strong>From:</strong> ${formatDestinationName(trip.fromCity)}</p>
                    <p><i class="fas fa-map-marker-alt"></i> <strong>To:</strong> ${destinationName}</p>
                    <p><i class="fas fa-calendar"></i> <strong>Travel Date:</strong> ${formatDate(trip.startDate)}</p>
                    <p><i class="fas fa-calendar"></i> <strong>Return Date:</strong> ${formatDate(trip.endDate)}</p>
                    <p><i class="fas fa-clock"></i> <strong>Duration:</strong> ${duration.days} Days / ${duration.nights} Nights</p>
                    <p><i class="fas fa-users"></i> <strong>Travelers:</strong> ${trip.travelers} ${trip.travelers === 1 ? 'Person' : 'People'}</p>
                    ${trip.hotel ? `<p><i class="fas fa-hotel"></i> <strong>Hotel:</strong> ${trip.hotel}</p>` : ''}
                    ${trip.transport ? `<p><i class="fas fa-plane"></i> <strong>Transport:</strong> ${trip.transport}</p>` : ''}
                    ${trip.activities && trip.activities.length > 0 ? `<p><i class="fas fa-star"></i> <strong>Activities:</strong> ${activitiesList}</p>` : ''}
                </div>
                <div class="trip-actions">
                    <div class="trip-price">
                        <span class="price-label">Total Amount</span>
                        <span class="price">₹${trip.totalPrice ? trip.totalPrice.toLocaleString('en-IN') : '0'}</span>
                    </div>
                    <div class="action-buttons">
                        ${actionButtons}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load and display trips
async function loadTrips() {
    const trips = await fetchTrips();

    const upcomingTrips = trips.filter(trip => determineTripStatus(trip) === 'upcoming');
    const pastTrips = trips.filter(trip => determineTripStatus(trip) === 'completed');
    const cancelledTrips = trips.filter(trip => trip.status === 'cancelled');

    const upcomingContainer = document.getElementById('upcoming-trips');
    const pastContainer = document.getElementById('past-trips');
    const cancelledContainer = document.getElementById('cancelled-trips');

    // Clear existing content
    upcomingContainer.innerHTML = '';
    pastContainer.innerHTML = '';
    cancelledContainer.innerHTML = '';

    // Render upcoming trips
    if (upcomingTrips.length > 0) {
        upcomingTrips.forEach(trip => {
            upcomingContainer.innerHTML += renderTripCard(trip);
        });
    } else {
        upcomingContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>No Upcoming Trips</h3>
                <p>You don't have any upcoming trips. Start planning your next adventure!</p>
                <a href="trip-builder.html" class="btn-primary">Plan a Trip</a>
            </div>
        `;
    }

    // Render past trips
    if (pastTrips.length > 0) {
        pastTrips.forEach(trip => {
            pastContainer.innerHTML += renderTripCard(trip);
        });
    } else {
        pastContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No Past Trips</h3>
                <p>You haven't completed any trips yet.</p>
            </div>
        `;
    }

    // Render cancelled trips
    if (cancelledTrips.length > 0) {
        cancelledTrips.forEach(trip => {
            cancelledContainer.innerHTML += renderTripCard(trip);
        });
    } else {
        cancelledContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ban"></i>
                <h3>No Cancelled Trips</h3>
                <p>You don't have any cancelled trips yet.</p>
            </div>
        `;
    }
}

// Download ticket
function downloadTicket(tripId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to download tickets');
        return;
    }

    fetch(`/api/trips`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(trips => {
            const trip = trips.find(t => t._id === tripId);
            if (!trip) {
                alert('Trip not found');
                return;
            }

            // Create ticket content
            const duration = calculateDuration(trip.startDate, trip.endDate);
            const ticketContent = `
TRAVEL PLANNER - TRAVEL TICKET
================================

Booking ID: ${generateBookingId(tripId)}
Destination: ${formatDestinationName(trip.destination)}
From: ${formatDestinationName(trip.fromCity)}
Travel Date: ${formatDate(trip.startDate)}
Return Date: ${formatDate(trip.endDate)}
Duration: ${duration.days} Days / ${duration.nights} Nights
Travelers: ${trip.travelers} ${trip.travelers === 1 ? 'Person' : 'People'}
${trip.hotel ? `Hotel: ${trip.hotel}` : ''}
${trip.transport ? `Transport: ${trip.transport}` : ''}
${trip.activities && trip.activities.length > 0 ? `Activities: ${trip.activities.join(', ')}` : ''}

Total Amount: ₹${trip.totalPrice ? trip.totalPrice.toLocaleString('en-IN') : '0'}

Thank you for choosing TravelPlanner!
        `;

            // Create and download file
            const blob = new Blob([ticketContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${generateBookingId(tripId)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading ticket:', error);
            alert('Failed to download ticket');
        });
}

// Download invoice
function downloadInvoice(tripId) {
    downloadTicket(tripId); // Same functionality for now
}

// Modify trip
function modifyTrip(tripId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to modify trips');
        return;
    }

    fetch(`/api/trips`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(trips => {
            const trip = trips.find(t => t._id === tripId);
            if (!trip) {
                alert('Trip not found');
                return;
            }

            // Store trip data for modification
            localStorage.setItem('modifyTrip', JSON.stringify(trip));
            window.location.href = 'trip-builder.html';
        })
        .catch(error => {
            console.error('Error fetching trip:', error);
            alert('Failed to load trip details');
        });
}

// Cancel trip
async function cancelTrip(tripId) {
    if (!confirm('Are you sure you want to cancel this trip? This action cannot be undone.')) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to cancel trips');
        return;
    }

    try {
        const response = await fetch(`/api/trips/${tripId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Trip cancelled successfully');
            loadTrips(); // Reload trips
        } else {
            const data = await response.json();
            alert('Failed to cancel trip: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error cancelling trip:', error);
        alert('Error cancelling trip');
    }
}

// Write review
function writeReview(tripId) {
    alert('Review functionality coming soon!');
}

// Book again
function bookAgain(destination) {
    window.location.href = `trip-builder.html?destination=${destination}`;
}

// Show trips by type
function showTrips(type) {
    // Hide all trip lists
    document.querySelectorAll('.trips-list').forEach(list => {
        list.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.trip-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected trip list
    document.getElementById(`${type}-trips`).classList.add('active');

    // Mark tab as active
    event.target.classList.add('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateNavigationForLogin === 'function') {
        updateNavigationForLogin();
    }
    loadTrips();
});

