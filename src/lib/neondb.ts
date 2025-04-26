import { Pool } from 'pg';

// استخدام عنوان الاتصال المباشر بقاعدة بيانات Neon
const connectionString = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';

// إنشاء تجمع اتصالات لقاعدة البيانات
export const pool = new Pool({
  connectionString,
});

// وظيفة مساعدة لتنفيذ استعلامات قاعدة البيانات
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// التحقق من اتصال قاعدة البيانات
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('اتصال ناجح بقاعدة بيانات Neon:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('فشل الاتصال بقاعدة بيانات Neon:', error);
    return false;
  }
}