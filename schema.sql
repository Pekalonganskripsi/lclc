-- LCious Database Schema for PostgreSQL (Supabase)
-- Table: rooms
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: lcs
CREATE TABLE lcs (
    lc_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lc_fee DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    traits TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: bookings
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    lc_id INT NULL,
    start_time TIMESTAMP NOT NULL,
    duration_hours INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    FOREIGN KEY (lc_id) REFERENCES lcs(lc_id)
);

-- Insert sample rooms
INSERT INTO rooms (name, capacity, price_per_hour, status) VALUES
('VIP Room A', 6, 250000.00, 'Available'),
('VIP Room B', 8, 300000.00, 'Available'),
('Premium Room C', 4, 150000.00, 'Available'),
('Premium Room D', 6, 180000.00, 'Available'),
('Standard Room E', 4, 100000.00, 'Available');

-- Insert sample LCs
INSERT INTO lcs (name, lc_fee, rating, traits, is_available) VALUES
('Sakura', 100000.00, 4.8, 'Energetic, Fun, Flirty', TRUE),
('Luna', 120000.00, 4.9, 'Sultry, Elegant, Sweet', TRUE),
('Mika', 90000.00, 4.6, 'Playful, Kawaii, Cheerful', TRUE),
('Aya', 130000.00, 4.7, 'Sophisticated, Mature, Calm', TRUE);

-- Insert admin user
INSERT INTO users (email, password, role) VALUES 
('admin@lcious.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample bookings
INSERT INTO bookings (user_id, room_id, lc_id, start_time, duration_hours, total_amount, status) VALUES
(1, 1, 1, '2025-12-15 20:00:00', 2, 450000.00, 'Confirmed'),
(1, 2, 2, '2025-12-20 21:00:00', 3, 660000.00, 'Pending');