// سكريبت تهيئة قاعدة البيانات باستخدام اتصال PostgreSQL مباشر
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// معلومات الاتصال بقاعدة البيانات PostgreSQL
const dbUrl = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';

// قائمة الجداول المطلوب إنشاؤها
const tables = {
  // جدول المستخدمين
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'maintenance', 'resident')) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول المجمعات السكنية
  residential_complexes: `
    CREATE TABLE IF NOT EXISTS residential_complexes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول المباني
  buildings: `
    CREATE TABLE IF NOT EXISTS buildings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      complex_id UUID NOT NULL REFERENCES residential_complexes(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      floors INTEGER NOT NULL CHECK (floors > 0),
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول الغرف
  rooms: `
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
  `,
  
  // جدول المرافق
  facilities: `
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
  `,
  
  // جدول التصنيفات
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول العناصر
  items: `
    CREATE TABLE IF NOT EXISTS items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      unit VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول المخزون
  inventory: `
    CREATE TABLE IF NOT EXISTS inventory (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
      unit_price DECIMAL(10, 2),
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول طلبات الصيانة
  maintenance_requests: `
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
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  // جدول عناصر الصيانة
  maintenance_items: `
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
  `,
  
  // جدول طلبات الشراء
  purchase_orders: `
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
  `,
  
  // جدول عناصر طلبات الشراء
  purchase_items: `
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
  `
};

async function setupDatabase() {
  console.log('بدء إنشاء قاعدة البيانات...');
  
  // إنشاء مثيل جديد للاتصال بقاعدة البيانات
  const client = new Client({
    connectionString: dbUrl,
  });
  
  try {
    // الاتصال بقاعدة البيانات
    await client.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // إنشاء امتداد UUID إذا لم يكن موجوداً
    console.log('تفعيل امتداد UUID...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ تم تفعيل امتداد UUID بنجاح');
    
    // إنشاء الجداول بالترتيب الصحيح
    for (const [tableName, createTableSQL] of Object.entries(tables)) {
      console.log(`إنشاء جدول ${tableName}...`);
      try {
        await client.query(createTableSQL);
        console.log(`✅ تم إنشاء جدول ${tableName} بنجاح`);
      } catch (err) {
        console.error(`❌ خطأ في إنشاء جدول ${tableName}:`, err.message);
      }
    }
    
    // إنشاء مستخدم افتراضي
    console.log('إنشاء مستخدم افتراضي...');
    try {
      await client.query(`
        INSERT INTO users (email, full_name, role) 
        VALUES ('admin@example.com', 'مستخدم النظام', 'admin')
        ON CONFLICT (email) DO NOTHING
      `);
      console.log('✅ تم إنشاء المستخدم الافتراضي بنجاح أو كان موجوداً بالفعل');
    } catch (err) {
      console.error('❌ خطأ في إنشاء المستخدم الافتراضي:', err.message);
    }
    
    console.log('✅ تم الانتهاء من إنشاء قاعدة البيانات بنجاح!');
    
  } catch (err) {
    console.error('❌ حدث خطأ غير متوقع:', err.message);
  } finally {
    // إغلاق الاتصال بقاعدة البيانات
    await client.end();
    console.log('تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تنفيذ الدالة
setupDatabase();