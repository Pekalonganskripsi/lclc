# LCious - Karaoke Room & LC Booking System (Node.js Version)

LCious is a complete web application for booking karaoke rooms and entertainment companions (LCs). The application features a modern disco glassmorphism design and is built with Node.js/Express and MySQL, designed to be deployed on Vercel using serverless functions.

## 🎯 Features

### User Features
- Browse available karaoke rooms with detailed information
- View entertainment companions (LCs) with ratings and traits
- Book rooms with optional LC selection
- Real-time price calculation
- Booking confirmation system

### Admin Features
- Admin dashboard with booking overview
- Manage all bookings with status updates
- Financial reports and analytics
- Top LCs and room popularity reports
- Revenue tracking by date

## 🎨 Design Theme - Disco Glassmorphism

The application features a unique disco glassmorphism theme with:
- Vibrant neon colors (#FF0077, #00FFFF)
- Glass-like UI elements with blur effects
- Animated disco elements
- Modern, clean interface

## 🏗️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (via mysql2)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Custom CSS with glassmorphism effects
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (Node.js runtime)

## 📁 Project Structure

```
lcious-nodejs/
├── api/                    # Express API routes
│   ├── booking.js          # Booking-related routes
│   └── admin.js            # Admin-related routes
├── controllers/            # Business logic
│   ├── bookingController.js
│   └── adminController.js
├── public/                 # Public-facing pages
│   ├── index.html          # Homepage
│   ├── rooms.html          # Browse rooms
│   ├── lcs.html            # Browse LCs
│   ├── booking.html        # Booking form
│   └── success.html        # Booking confirmation
├── admin/                  # Admin interface
│   ├── login.html          # Admin login
│   ├── dashboard.html      # Admin dashboard
│   ├── bookings.html       # Manage bookings
│   └── reports.html        # Admin reports
├── assets/                 # Static assets
│   ├── styles.css          # Disco glassmorphism theme
│   └── script.js           # JavaScript functionality
├── config/                 # Configuration files
│   └── db.js               # Database connection
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
├── vercel.json             # Vercel configuration
└── README.md
```

## 🛠️ Installation

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lcious-nodejs.git
   cd lciou-nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a MySQL database named `lcious`
   - Import the schema from your original PHP application (or create the tables manually)

4. Create a `.env` file in the root directory:
   ```
   DB_HOST=localhost
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_NAME=lcious
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. The application will be available at `http://localhost:3000`

### Database Schema

You'll need to set up the same database schema as in the original PHP application:

```sql
-- Rooms table
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    status ENUM('Available', 'Booked') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LCs table
CREATE TABLE lcs (
    lc_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lc_fee DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    traits TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    lc_id INT NULL,
    start_time DATETIME NOT NULL,
    duration_hours INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    FOREIGN KEY (lc_id) REFERENCES lcs(lc_id)
);
```

## 🔐 Admin Access

- **Email**: `admin@lcious.com`
- **Password**: `Disco70s!`

## 🚀 Deployment to Vercel

1. Fork this repository
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your forked repository
4. Configure environment variables in your Vercel dashboard:
   - `DB_HOST` - Your MySQL host
   - `DB_USERNAME` - Database username
   - `DB_PASSWORD` - Database password
   - `DB_NAME` - Database name
   - `JWT_SECRET` - Secret for JWT tokens
   - `SESSION_SECRET` - Secret for sessions
5. Click "Deploy"

**Note**: You'll need to set up a MySQL database (like PlanetScale, AWS RDS, etc.) for production use.

## 📊 API Endpoints

### Booking Routes
- `POST /api/booking/create` - Create a new booking
- `GET /api/booking/list` - Get all bookings (with optional user filter)
- `GET /api/booking/rooms` - Get all rooms
- `GET /api/booking/lcs` - Get all available LCs

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/reports` - Get admin reports
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:bookingId` - Update booking status
- `DELETE /api/admin/bookings/:bookingId` - Delete booking

## 🤖 Environment Variables

Required environment variables:

```
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=lcious
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

## 🎭 Screenshots

*Coming soon - Sample screenshots of the application*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues, please open an issue in the repository or contact the development team.