import { Pool } from 'pg';

// استخدام عنوان الاتصال المباشر بقاعدة بيانات Neon
const connectionString = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';

// إنشاء تجمع اتصالات لقاعدة البيانات
const poolInstance = new Pool({
  connectionString,
  max: 20, // زيادة عدد الاتصالات المتزامنة
  idleTimeoutMillis: 30000, // وقت انتظار أطول
  connectionTimeoutMillis: 5000, // مهلة اتصال أقصر
});

// إصدار تجمع الاتصالات للاستخدام في الوظائف الأخرى
export const pool = poolInstance;

// وظيفة مساعدة لتنفيذ استعلامات قاعدة البيانات مع إعادة المحاولة
export async function query(text: string, params?: any[], retries = 3) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    const client = await poolInstance.connect().catch(err => {
      console.error(`فشل الاتصال بقاعدة البيانات (محاولة ${attempt + 1}/${retries}):`, err.message);
      return null;
    });
    
    if (!client) {
      lastError = new Error('تعذر إنشاء اتصال بقاعدة البيانات');
      continue;
    }
    
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`فشل الاستعلام (محاولة ${attempt + 1}/${retries}):`, error.message);
    } finally {
      client.release();
    }
  }
  
  // إذا وصلنا إلى هنا، فقد فشلت جميع المحاولات
  throw lastError || new Error('فشل الاستعلام بعد عدة محاولات');
}

// التحقق من اتصال قاعدة البيانات
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()', [], 1);
    console.log('اتصال ناجح بقاعدة بيانات Neon:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('فشل الاتصال بقاعدة بيانات Neon:', error);
    return false;
  }
}

// وظيفة مساعدة للحصول على بيانات آمنة
export async function safeQuery(text: string, params?: any[], defaultValue: any = []) {
  try {
    const result = await query(text, params);
    return result.rows || defaultValue;
  } catch (error) {
    console.error('فشل الاستعلام، استخدام القيمة الافتراضية:', error);
    return defaultValue;
  }
}