// تهيئة قاعدة البيانات باستخدام مكتبة pg مباشرة
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// معلومات الاتصال بقاعدة البيانات
const connectionString = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';

// إنشاء تجمع اتصالات
const pool = new Pool({
  connectionString,
});

async function initDatabase() {
  console.log('بدء تهيئة قاعدة البيانات...');
  
  try {
    // قراءة ملف SQL
    const sqlFilePath = path.join(__dirname, 'init_database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('تم قراءة ملف SQL بنجاح.');
    console.log('جاري تنفيذ الاستعلامات...');
    
    // الاتصال بقاعدة البيانات
    const client = await pool.connect();
    
    try {
      // تنفيذ ملف SQL كاملاً
      await client.query(sqlScript);
      console.log('تم تهيئة قاعدة البيانات بنجاح!');
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('حدث خطأ أثناء تهيئة قاعدة البيانات:', error);
  } finally {
    // إغلاق تجمع الاتصالات
    await pool.end();
  }
}

// تنفيذ عملية التهيئة
initDatabase();