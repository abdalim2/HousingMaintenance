'use server';

import { getMaintenanceRequests } from '@/lib/services/maintenanceService';
import { getLowStockItems } from '@/lib/services/inventoryService';
import { getPurchaseOrders } from '@/lib/services/purchaseService';

export async function getDashboardData() {
  try {
    // استخدام Promise.allSettled للتعامل مع الاستعلامات بشكل متوازي
    const [pendingResult, inProgressResult, lowStockResult, ordersResult] = await Promise.allSettled([
      // Get maintenance requests by status
      getMaintenanceRequests(undefined, undefined, 'pending')
        .catch(() => []),
      
      getMaintenanceRequests(undefined, undefined, 'in_progress')
        .catch(() => []),

      // Get low stock items (threshold of 5)
      getLowStockItems(5)
        .catch(() => []),

      // Get recent purchase orders (limit to 5)
      getPurchaseOrders()
        .catch(() => []),
    ]);
    
    // معالجة النتائج وإعادة بيانات منظمة
    return {
      pendingMaintenanceRequests: pendingResult.status === 'fulfilled' ? pendingResult.value : [],
      inProgressMaintenanceRequests: inProgressResult.status === 'fulfilled' ? inProgressResult.value : [],
      lowStockItems: lowStockResult.status === 'fulfilled' ? lowStockResult.value : [],
      recentOrders: ordersResult.status === 'fulfilled' ? ordersResult.value.slice(0, 5) : [],
      error: null,
    };
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return {
      pendingMaintenanceRequests: [],
      inProgressMaintenanceRequests: [],
      lowStockItems: [],
      recentOrders: [],
      error: `فشل في تحميل بيانات لوحة التحكم: ${error.message || 'خطأ غير معروف'}`,
    };
  }
}