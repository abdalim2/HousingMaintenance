"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMaintenanceRequests } from './services/maintenanceService';
import { getLowStockItems } from './services/inventoryService';
import { getPurchaseOrders } from './services/purchaseService';
import { MaintenanceRequest, InventoryWithItem, PurchaseOrder } from '@/models/types';

// تعريف نوع البيانات للسياق
interface AppDataContextType {
  pendingMaintenanceCount: number;
  lowStockItems: InventoryWithItem[];
  recentOrders: PurchaseOrder[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

// إنشاء السياق مع قيم افتراضية
const AppDataContext = createContext<AppDataContextType>({
  pendingMaintenanceCount: 0,
  lowStockItems: [],
  recentOrders: [],
  loading: true,
  error: null,
  refreshData: async () => {},
  lastUpdated: null,
});

// مقدم السياق (Provider)
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [pendingMaintenanceCount, setPendingMaintenanceCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<InventoryWithItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // دالة لتحديث البيانات
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // تحميل كافة البيانات بشكل متوازي لتحسين الأداء
      const [maintenanceResult, inventoryResult, purchaseResult] = await Promise.allSettled([
        // طلبات الصيانة المعلقة
        getMaintenanceRequests(undefined, undefined, 'pending')
          .catch(err => {
            console.warn('لم نتمكن من تحميل بيانات الصيانة:', err);
            return [];
          }),
        
        // العناصر منخفضة المخزون
        getLowStockItems(5)
          .catch(err => {
            console.warn('لم نتمكن من تحميل بيانات المخزون:', err);
            return [];
          }),
        
        // طلبات الشراء الحديثة
        getPurchaseOrders()
          .catch(err => {
            console.warn('لم نتمكن من تحميل بيانات طلبات الشراء:', err);
            return [];
          })
      ]);

      // تحديث البيانات بناء على النتائج
      if (maintenanceResult.status === 'fulfilled') {
        setPendingMaintenanceCount(maintenanceResult.value.length);
      }

      if (inventoryResult.status === 'fulfilled') {
        setLowStockItems(inventoryResult.value.slice(0, 3));
      }

      if (purchaseResult.status === 'fulfilled') {
        setRecentOrders(purchaseResult.value.slice(0, 2));
      }
      
      // تحديث وقت آخر تحديث
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('خطأ أثناء تحديث بيانات التطبيق:', err);
      setError(`فشل تحديث البيانات: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        await refreshData();
      } catch (err) {
        // تجاهل الخطأ إذا تم إلغاء تحميل المكون
        if (isMounted) {
          console.error('فشل التحميل الأولي للبيانات:', err);
        }
      }
    };
    
    loadInitialData();
    
    // تحديث البيانات كل 5 دقائق
    const intervalId = setInterval(() => {
      if (isMounted) refreshData();
    }, 5 * 60 * 1000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        pendingMaintenanceCount,
        lowStockItems,
        recentOrders,
        loading,
        error,
        refreshData,
        lastUpdated
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

// Hook لاستخدام سياق بيانات التطبيق
export function useAppData() {
  return useContext(AppDataContext);
}