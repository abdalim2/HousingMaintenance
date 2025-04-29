'use server';

import { pool, query, safeQuery } from '@/lib/neondb';

// Wrapper functions for database operations that can be called from the client
export async function executeQuery(text: string, params?: any[], retries = 3) {
  try {
    const result = await query(text, params, retries);
    return { data: result, error: null };
  } catch (error: any) {
    console.error('خطأ في تنفيذ الاستعلام:', error);
    return { data: null, error: `فشل في تنفيذ الاستعلام: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function executeSafeQuery(text: string, params?: any[], defaultValue: any = []) {
  try {
    const rows = await safeQuery(text, params, defaultValue);
    return { data: rows, error: null };
  } catch (error: any) {
    console.error('خطأ في تنفيذ الاستعلام الآمن:', error);
    return { data: defaultValue, error: `فشل في تنفيذ الاستعلام الآمن: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function testDatabaseConnection() {
  try {
    // Simple test query
    const result = await query('SELECT NOW()', [], 1);
    return { 
      connected: true, 
      timestamp: result.rows[0].now,
      error: null 
    };
  } catch (error: any) {
    console.error('فشل اختبار الاتصال بقاعدة البيانات:', error);
    return { 
      connected: false, 
      timestamp: null,
      error: `فشل اختبار الاتصال بقاعدة البيانات: ${error.message || 'خطأ غير معروف'}` 
    };
  }
}