-- ==========================================================
-- Agricultural Supply Chain Management System
-- Database Schema & Sample Data for MySQL
-- ==========================================================

DROP DATABASE IF EXISTS agri_supply_chain;
CREATE DATABASE agri_supply_chain;
USE agri_supply_chain;

-- 1. Farmers Table
CREATE TABLE farmers (
    farmer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(150) NOT NULL,
    farm_size_acres DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crops Table
CREATE TABLE crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    category ENUM('Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices', 'Cash Crops') DEFAULT 'Grains',
    base_price_per_kg DECIMAL(8,2) NOT NULL
);

-- 3. Batches Table (Core Supply Chain Unit)
CREATE TABLE batches (
    batch_id VARCHAR(50) PRIMARY KEY,
    farmer_id INT NOT NULL,
    crop_id INT NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    harvest_date DATE NOT NULL,
    quality_grade ENUM('Grade A (Export)', 'Grade B (Premium)', 'Grade C (Standard)') DEFAULT 'Grade A (Export)',
    current_status ENUM('Harvested', 'Cold Storage', 'In Transit', 'Distributed', 'Retail Shelved', 'Sold') DEFAULT 'Harvested',
    storage_temp_celsius DECIMAL(4,1) DEFAULT 18.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(crop_id) ON DELETE CASCADE
);

-- 4. Logistics & Tracking Table
CREATE TABLE logistics (
    logistics_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id VARCHAR(50) NOT NULL,
    transporter_name VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(30) NOT NULL,
    pickup_location VARCHAR(150) NOT NULL,
    drop_location VARCHAR(150) NOT NULL,
    dispatch_date DATE NOT NULL,
    arrival_date DATE,
    transit_status ENUM('Scheduled', 'In Transit', 'Reached Destination', 'Delayed') DEFAULT 'Scheduled',
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE
);

-- 5. Retailers & Orders Table
CREATE TABLE retail_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    batch_id VARCHAR(50) NOT NULL,
    retailer_name VARCHAR(120) NOT NULL,
    retailer_city VARCHAR(100) NOT NULL,
    quantity_ordered_kg DECIMAL(10,2) NOT NULL,
    selling_price_per_kg DECIMAL(8,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    order_date DATE NOT NULL,
    order_status ENUM('Pending', 'Confirmed', 'Dispatched', 'Delivered') DEFAULT 'Confirmed',
    FOREIGN KEY (batch_id) REFERENCES batches(batch_id) ON DELETE CASCADE
);

-- ==========================================================
-- Seed Data for Demonstration
-- ==========================================================

INSERT INTO farmers (name, phone, location, farm_size_acres) VALUES
('Ramesh Kumar', '+91 98765 43210', 'Punjab, District Ludhiana', 15.5),
('Sita Devi', '+91 98112 23344', 'Nashik, Maharashtra', 8.2),
('Balwinder Singh', '+91 94567 89012', 'Karnal, Haryana', 22.0),
('Arun Patel', '+91 97234 56789', 'Anand, Gujarat', 12.0);

INSERT INTO crops (crop_name, category, base_price_per_kg) VALUES
('Basmati Rice 1121', 'Grains', 85.00),
('Organic Wheat (Sharbati)', 'Grains', 42.00),
('Alphonso Mango', 'Fruits', 250.00),
('Red Onion', 'Vegetables', 28.00),
('Turmeric (Organic)', 'Spices', 140.00);

INSERT INTO batches (batch_id, farmer_id, crop_id, quantity_kg, harvest_date, quality_grade, current_status, storage_temp_celsius) VALUES
('BATCH-2026-RICE-01', 1, 1, 5000.00, '2026-10-15', 'Grade A (Export)', 'In Transit', 20.0),
('BATCH-2026-WHEAT-02', 3, 2, 8500.00, '2026-10-18', 'Grade A (Export)', 'Cold Storage', 18.0),
('BATCH-2026-MANGO-03', 2, 3, 1200.00, '2026-10-22', 'Grade A (Export)', 'Distributed', 12.5),
('BATCH-2026-ONION-04', 4, 4, 3000.00, '2026-10-25', 'Grade B (Premium)', 'Retail Shelved', 22.0);

INSERT INTO logistics (batch_id, transporter_name, vehicle_number, pickup_location, drop_location, dispatch_date, arrival_date, transit_status) VALUES
('BATCH-2026-RICE-01', 'Kisan Express Cargo', 'PB-10-CX-4521', 'Ludhiana Mandi', 'Delhi Central Distribution Hub', '2026-10-27', '2026-10-29', 'In Transit'),
('BATCH-2026-MANGO-03', 'Sahyadri Cold Logistics', 'MH-15-TR-9988', 'Nashik Farm Gate', 'Mumbai APMC Terminal', '2026-10-24', '2026-10-25', 'Reached Destination');

INSERT INTO retail_orders (batch_id, retailer_name, retailer_city, quantity_ordered_kg, selling_price_per_kg, total_amount, order_date, order_status) VALUES
('BATCH-2026-MANGO-03', 'Nature Fresh Supermarkets', 'Mumbai', 500.00, 290.00, 145000.00, '2026-10-26', 'Delivered'),
('BATCH-2026-ONION-04', 'Daily Greens Mart', 'Ahmedabad', 1200.00, 35.00, 42000.00, '2026-10-28', 'Confirmed');
