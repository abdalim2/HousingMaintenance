// استخدام CommonJS لسهولة التنفيذ
const { Pool } = require('pg');

// معلومات الاتصال بقاعدة البيانات (نفس المعلومات الموجودة في neondb.ts)
const connectionString = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';

// إنشاء تجمع اتصالات
const pool = new Pool({
  connectionString,
});

// وظيفة استعلام مشابهة للوظيفة الموجودة في neondb.ts
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function createAATable() {
  try {
    console.log('بدء إنشاء جدول AA...');
    
    // إنشاء جدول AA
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS AA (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await query(createTableQuery);
    console.log('تم إنشاء جدول AA بنجاح!');
    
    // إضافة بعض البيانات الاختبارية
    const insertDataQuery = `
      INSERT INTO AA (name, description) 
      VALUES 
        ('عنصر 1', 'وصف للعنصر الأول'),
        ('عنصر 2', 'وصف للعنصر الثاني');
    `;
    
    await query(insertDataQuery);
    console.log('تم إضافة بيانات اختبارية إلى جدول AA');
    
    // التحقق من البيانات
    const checkDataQuery = 'SELECT * FROM AA;';
    const result = await query(checkDataQuery);
    console.log('بيانات الجدول AA:', result.rows);
    
  } catch (error) {
    console.error('حدث خطأ أثناء إنشاء جدول AA:', error);
  } finally {
    // إغلاق اتصال قاعدة البيانات
    await pool.end();
  }
}

// تنفيذ الدالة
createAATable();