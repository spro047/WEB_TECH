document.addEventListener('DOMContentLoaded', () => {
    // Get package ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id') || 'goa'; // Default to Goa

    // Package Data
    const packages = {
        'goa': {
            title: 'Goa Beach Paradise',
            duration: '4 Days / 3 Nights',
            location: 'Goa, India',
            rating: '4.5 (234 Reviews)',
            price: '₹15,999',
            description: 'Experience the perfect blend of sun, sand, and sea with our Goa Beach Paradise package. This 4-day, 3-night getaway takes you to the most beautiful beaches in Goa, where you can relax, unwind, and create unforgettable memories.',
            images: ['images/goa.png', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 'https://images.unsplash.com/photo-1544237256-bd4644da6058?w=800'],
            hotel: {
                name: 'Sea View Resort',
                location: 'Calangute, Goa',
                description: 'A beautiful beachfront resort with modern amenities, swimming pool, and direct beach access.'
            }
        },
        'manali': {
            title: 'Manali Adventure Trip',
            duration: '5 Days / 4 Nights',
            location: 'Manali, Himachal Pradesh',
            rating: '4.7 (189 Reviews)',
            price: '₹22,999',
            description: 'Embark on a thrilling adventure to the snow-capped mountains of Manali. Enjoy skiing, paragliding, and breathtaking views of the Himalayas. Perfect for adventure seekers and nature lovers.',
            images: ['images/manali.png', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', 'https://images.unsplash.com/photo-1589139268676-4768393e2501?w=800'],
            hotel: {
                name: 'Snow Valley Resorts',
                location: 'Manali, HP',
                description: 'Luxury resort nestled in the mountains with spectacular views and premium amenities.'
            }
        },
        'kerala': {
            title: 'Kerala Backwaters',
            duration: '6 Days / 5 Nights',
            location: 'Alleppey, Kerala',
            rating: '4.8 (312 Reviews)',
            price: '₹28,999',
            description: 'Discover the serene backwaters of Kerala on a luxury houseboat. Experience the tranquility of nature, delicious traditional cuisine, and the warm hospitality of God\'s Own Country.',
            images: ['images/kerala.png', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800'],
            hotel: {
                name: 'Lake Palace Resort',
                location: 'Alleppey, Kerala',
                description: 'Heritage resort located on the banks of Vembanad Lake offering authentic Ayurveda treatments.'
            }
        },
        'rajasthan': {
            title: 'Rajasthan Royal Tour',
            duration: '7 Days / 6 Nights',
            location: 'Jaipur, Rajasthan',
            rating: '4.6 (156 Reviews)',
            price: '₹35,999',
            description: 'Experience the grandeur of Rajasthan with visits to majestic forts, palaces, and vibrant markets. A journey through history and culture awaits you in the Land of Kings.',
            images: ['images/rajasthan.png', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', 'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=800'],
            hotel: {
                name: 'Royal Heritage Haveli',
                location: 'Jaipur, Rajasthan',
                description: 'A converted royal residence offering a taste of regal living with modern comforts.'
            }
        },
        'darjeeling': {
            title: 'Darjeeling Delight',
            duration: '3 Days / 2 Nights',
            location: 'Darjeeling, West Bengal',
            rating: '4.4 (120 Reviews)',
            price: '₹12,999',
            description: 'Wake up to the view of Kanchenjunga and enjoy the world-famous Darjeeling tea. A short but sweet escape to the Queen of Hills.',
            images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', 'https://images.unsplash.com/photo-1544634220-42468ec4cc9c?w=600', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'],
            hotel: {
                name: 'Summit Swiss Heritage',
                location: 'Darjeeling',
                description: 'Charming colonial-style hotel with panoramic views of the mountains.'
            }
        },
        'shimla': {
            title: 'Shimla Summer Escape',
            duration: '4 Days / 3 Nights',
            location: 'Shimla, Himachal Pradesh',
            rating: '4.5 (180 Reviews)',
            price: '₹14,999',
            description: 'Beat the heat with a trip to the charming hill station of Shimla. Walk down the Mall Road, visit Jakhu Temple, and enjoy the pleasant weather.',
            images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600', 'https://images.unsplash.com/photo-1626014902874-927a48d25438?w=600', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600'],
            hotel: {
                name: 'The Oberoi Cecil',
                location: 'Shimla',
                description: 'Historic luxury hotel offering refined hospitality and timeless elegance.'
            }
        }
    };

    const pkg = packages[packageId] || packages['goa'];

    // Update Page Content
    document.title = `${pkg.title} - Package Details | TravelPlanner`;

    // Breadcrumb
    const breadcrumbSpan = document.querySelector('.breadcrumb span');
    if (breadcrumbSpan) breadcrumbSpan.textContent = pkg.title;

    // Header
    const headerTitle = document.querySelector('.package-header h1');
    if (headerTitle) headerTitle.textContent = pkg.title;

    const metaSpans = document.querySelectorAll('.package-meta span');
    if (metaSpans.length >= 3) {
        metaSpans[0].innerHTML = `<i class="fas fa-clock"></i> ${pkg.duration}`;
        metaSpans[1].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${pkg.location}`;
        metaSpans[2].innerHTML = `<i class="fas fa-star"></i> ${pkg.rating}`;
    }

    // Gallery
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach((img, index) => {
        if (pkg.images[index]) img.src = pkg.images[index];
    });

    const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
    thumbnails.forEach((img, index) => {
        if (pkg.images[index]) img.src = pkg.images[index];
    });

    // Overview
    const overviewTitle = document.querySelector('.package-content-section h2'); // Usually "Overview"
    // We target P tags inside the first content-block
    const overviewBlock = document.querySelector('.content-block');
    if (overviewBlock) {
        const paragraphs = overviewBlock.querySelectorAll('p');
        if (paragraphs.length > 0) paragraphs[0].textContent = pkg.description;
    }

    // Price Sidebar
    const priceEl = document.querySelector('.booking-sidebar .price');
    if (priceEl) priceEl.textContent = pkg.price;

    const totalEl = document.querySelector('.booking-sidebar .total-amount');
    // Simple logic to set total same as price for now (1 person)
    if (totalEl) totalEl.textContent = pkg.price;

    // Hotel Info
    const hotelName = document.querySelector('.hotel-info h3');
    if (hotelName) hotelName.textContent = pkg.hotel.name;

    const hotelLoc = document.querySelector('.hotel-location');
    if (hotelLoc) hotelLoc.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${pkg.hotel.location}`;

    const hotelDesc = document.querySelector('.hotel-description');
    if (hotelDesc) hotelDesc.textContent = pkg.hotel.description;

});
