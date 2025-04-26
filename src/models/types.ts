// Housing Unit related types

// واجهة الخدمة
export interface Service {
  id: string;
  name: string;
  type: string;
  location: string;
  description?: string;
}

// واجهة الغرفة
export interface Room {
  id: string;
  name: string;
  room_number: string;
  type: string; // bedroom, bathroom, kitchen, etc.
  status: 'available' | 'occupied' | 'maintenance';
  area?: number; // المساحة بالمتر المربع
  hasBalcony?: boolean; // وجود شرفة
  services?: Service[]; // الخدمات المرتبطة بالغرفة
}

// واجهة الطابق
export interface Floor {
  id: string;
  number: number;
  rooms: Room[]; // قائمة الغرف في الطابق
  services: Service[]; // قائمة الخدمات المشتركة في الطابق
}

// واجهة المبنى
export interface Building {
  id: string;
  name: string;
  floors: Floor[]; // قائمة الطوابق في المبنى
  address?: string; // عنوان المبنى (اختياري)
  description?: string;
  
  // للتوافق مع التطبيق الحالي
  complex_id: string;
  floors_count?: number; // عدد الطوابق الإجمالي
}

// واجهة المجمع السكني
export interface ResidentialComplex {
  id: string;
  name: string;
  location: string;
  buildings: Building[]; // قائمة المباني في المجمع
  sharedFacilities?: Facility[]; // المرافق المشتركة في المجمع
  description?: string;
  created_at: string;
}

// واجهة المرفق (مطابقة للمرافق المشتركة في المجمع)
export interface Facility {
  id: string;
  complex_id: string;
  building_id?: string;
  name: string;
  type: string; // bathroom, kitchen, laundry, gym, etc.
  location_description: string;
}

// الواجهات القديمة للتوافق مع التطبيق الحالي
export interface OldRoom {
  id: string;
  building_id: string;
  floor: number;
  room_number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance';
}

// Inventory related types
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Item {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  unit: string; // piece, box, kg, etc.
}

export interface Inventory {
  id: string;
  item_id: string;
  quantity: number;
  unit_price?: number;
  last_updated: string;
}

// Maintenance related types
export interface MaintenanceRequest {
  id: string;
  complex_id: string;
  building_id: string;
  room_id?: string;
  facility_id?: string;
  reported_by: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  reported_date: string;
  scheduled_date?: string;
  completion_date?: string;
}

export interface MaintenanceItem {
  id: string;
  maintenance_id: string;
  item_id: string;
  quantity_needed: number;
  quantity_used?: number;
  notes?: string;
}

// Purchase related types
export interface PurchaseOrder {
  id: string;
  order_date: string;
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'received' | 'completed';
  total_amount?: number;
  vendor?: string;
  notes?: string;
  created_by: string;
  approved_by?: string;
}

export interface PurchaseItem {
  id: string;
  purchase_order_id: string;
  item_id: string;
  quantity: number;
  unit_price?: number;
  received_quantity?: number;
  notes?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'maintenance' | 'resident';
}