# TravelPlanner - Travel Booking Website

A modern, responsive travel booking website similar to MakeMyTrip, built with HTML, CSS, and JavaScript.

## Features

### Core Pages
- **Home Page** - Hero section with search, popular destinations, featured packages, offers, and testimonials
- **Holidays/Packages** - Package listing with filters (budget, duration, type, traveler) and sorting
- **Package Details** - Detailed view with image gallery, day-wise itinerary, inclusions/exclusions, hotel details, and reviews
- **Trip Builder** - Custom trip creation with step-by-step wizard (destination, hotel, transport, activities)
- **Booking Flow** - Multi-step booking process (traveller details, review, payment, confirmation)
- **My Trips** - Dashboard to view upcoming, past, and cancelled trips
- **Login/Sign Up** - Authentication with email/password and OTP options

### Key Features
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern UI with travel-inspired design
- ✅ Smooth animations and transitions
- ✅ Interactive components (carousels, filters, accordions)
- ✅ Search functionality
- ✅ Filter and sort packages
- ✅ Custom trip builder
- ✅ Multi-step booking flow
- ✅ Payment integration UI
- ✅ Trip management dashboard

## Project Structure

```
Travel_Planner/
├── index.html              # Home page
├── holidays.html           # Package listing page
├── package-details.html    # Package details page
├── trip-builder.html       # Custom trip builder
├── booking.html            # Booking flow
├── my-trips.html           # User trips dashboard
├── login.html              # Login page
├── signup.html             # Sign up page
├── css/
│   ├── style.css          # Main stylesheet
│   ├── holidays.css       # Holidays page styles
│   ├── package-details.css # Package details styles
│   ├── trip-builder.css   # Trip builder styles
│   ├── booking.css        # Booking page styles
│   ├── my-trips.css       # My trips styles
│   └── auth.css           # Authentication styles
├── js/
│   ├── main.js            # Main JavaScript
│   ├── trip-builder.js   # Trip builder logic
│   └── booking.js        # Booking flow logic
└── README.md              # Project documentation
```

## Getting Started

1. **Clone or download** this repository
2. **Open** `index.html` in a web browser
3. **Navigate** through the pages using the navigation menu

## Pages Overview

### Home Page (`index.html`)
- Hero section with search form
- Popular destinations carousel (India & International)
- Featured holiday packages
- Special offers section
- Why choose us section
- Customer testimonials

### Holidays Page (`holidays.html`)
- Filter packages by:
  - Budget range
  - Duration (3-5 days, 6-9 days, 10+ days)
  - Destination type (Beach, Hill, Adventure, Spiritual, Heritage)
  - Traveler type (Family, Couple, Solo, Group)
- Sort by: Price, Popularity, Rating
- Package cards with key information

### Package Details Page (`package-details.html`)
- Image gallery with thumbnails
- Day-wise itinerary (accordion style)
- Inclusions & exclusions
- Hotel details with amenities
- Cancellation policy
- Reviews & ratings
- Booking sidebar with price

### Trip Builder (`trip-builder.html`)
- Step 1: Select destination and dates
- Step 2: Choose accommodation (Budget/Standard/Luxury)
- Step 3: Select transport (Flight/Train/Bus/Self Drive)
- Step 4: Add activities
- Step 5: Review and finalize trip
- Live price updates

### Booking Flow (`booking.html`)
- Step 1: Enter traveller details
- Step 2: Review itinerary and apply coupons
- Step 3: Payment (UPI, Card, Net Banking, Wallets)
- Step 4: Booking confirmation

### My Trips (`my-trips.html`)
- View upcoming trips
- View past trips
- View cancelled trips
- Download tickets/invoices
- Modify or cancel bookings

### Authentication (`login.html`, `signup.html`)
- Email/password login
- OTP-based login/signup
- Form validation

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)
- **JavaScript** - Interactivity and dynamic content
- **Font Awesome** - Icons
- **Unsplash** - Sample images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #1e88e5;
    --secondary-color: #ff6b35;
    --accent-color: #43a047;
    /* ... */
}
```

### Content
- Update package information in HTML files
- Modify images (currently using Unsplash)
- Add/remove destinations and packages

## Future Enhancements

- Backend integration (Node.js/Django)
- Database integration (MySQL/MongoDB)
- Real payment gateway integration
- User authentication system
- Admin panel
- Map integration
- Email notifications
- Real-time booking updates

## Notes

- This is a **frontend-only** implementation
- All data is static/simulated
- Payment processing is simulated
- Images are from Unsplash (placeholder)
- Forms submit to prevent default (no backend)

## License

This project is open source and available for educational purposes.

---

**Built with ❤️ for travel enthusiasts**

