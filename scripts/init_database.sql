-- Housing Maintenance System Database Initialization
-- Created: April 26, 2025

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing tables if they exist (uncomment if needed for clean reinstall)
-- DROP TABLE IF EXISTS purchase_items, purchase_orders, maintenance_items, maintenance_requests, inventory, items, categories, facilities, rooms, buildings, residential_complexes, users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'maintenance', 'resident')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Housing Units related tables
CREATE TABLE IF NOT EXISTS residential_complexes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complex_id UUID NOT NULL REFERENCES residential_complexes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  floors INTEGER NOT NULL CHECK (floors > 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  floor INTEGER NOT NULL CHECK (floor >= 0),
  room_number VARCHAR(50) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('available', 'occupied', 'maintenance')) NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (building_id, room_number)
);

CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complex_id UUID NOT NULL REFERENCES residential_complexes(id) ON DELETE CASCADE,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  location_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory related tables
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50) NOT NULL, -- piece, box, kg, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(10, 2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maintenance related tables
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complex_id UUID NOT NULL REFERENCES residential_complexes(id) ON DELETE CASCADE,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')) NOT NULL DEFAULT 'pending',
  priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high', 'emergency')) NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL,
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_location CHECK (room_id IS NOT NULL OR facility_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS maintenance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity_needed DECIMAL(10, 2) NOT NULL,
  quantity_used DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase related tables
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) CHECK (status IN ('draft', 'submitted', 'approved', 'ordered', 'received', 'completed')) NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(12, 2),
  vendor VARCHAR(255),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2),
  received_quantity DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_buildings_complex_id ON buildings(complex_id);
CREATE INDEX idx_rooms_building_id ON rooms(building_id);
CREATE INDEX idx_facilities_complex_id ON facilities(complex_id);
CREATE INDEX idx_facilities_building_id ON facilities(building_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_inventory_item_id ON inventory(item_id);
CREATE INDEX idx_maintenance_requests_building_id ON maintenance_requests(building_id);
CREATE INDEX idx_maintenance_requests_complex_id ON maintenance_requests(complex_id);
CREATE INDEX idx_maintenance_requests_room_id ON maintenance_requests(room_id);
CREATE INDEX idx_maintenance_requests_facility_id ON maintenance_requests(facility_id);
CREATE INDEX idx_maintenance_items_maintenance_id ON maintenance_items(maintenance_id);
CREATE INDEX idx_purchase_items_purchase_order_id ON purchase_items(purchase_order_id);

-- Create function to update timestamps automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_residential_complexes_modtime BEFORE UPDATE ON residential_complexes FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_buildings_modtime BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_rooms_modtime BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_facilities_modtime BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_items_modtime BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_maintenance_requests_modtime BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_maintenance_items_modtime BEFORE UPDATE ON maintenance_items FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_purchase_orders_modtime BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_purchase_items_modtime BEFORE UPDATE ON purchase_items FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert some initial data
-- Insert admin user
INSERT INTO users (email, full_name, role) 
VALUES ('admin@example.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;