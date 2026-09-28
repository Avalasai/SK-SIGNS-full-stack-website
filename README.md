# SK SIGNS - Full Stack Website

## Stack
- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js + Express
- Database: SQLite via better-sqlite3
- File uploads: Multer
- Responsive/mobile-first layout

## Included
- Home
- About Us
- Services
- Our Work
- Gallery
- Why Choose Us
- Contact / Free Quote form
- WhatsApp button
- One-tap calling
- Google Maps embed
- SQLite quote storage
- Optional project photo upload
- Protected quote-list API

## Run locally

1. Install Node.js 18+.
2. Open this folder in terminal.
3. Run:
   npm install
4. Copy `.env.example` to `.env` and change `ADMIN_KEY`.
5. Run:
   npm start
6. Open:
   http://localhost:3000

## View submitted quote requests

Use the admin key from `.env`:

GET `/api/quotes?key=YOUR_ADMIN_KEY`

For production, put the site behind HTTPS and a reverse proxy such as Nginx, use a strong admin key, and configure a real business email/domain.

## Important business details to verify before publishing

- Phone: +91 90423 25792
- Address: 21/13, V.V Giri Street, Devi Nagar, Avadi, Chennai-600109
- Email is currently set to `info@sksigns.in` as a domain-style placeholder. Replace it with the real SK SIGNS email before launch.
- Customer testimonials should be replaced with verified real reviews before publishing.
