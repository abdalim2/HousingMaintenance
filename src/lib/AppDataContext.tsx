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
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
}

// إنشاء السياق مع قيم افتراضية
const AppDataContext = createContext<AppDataContextType>({
  pendingMaintenanceCount: 0,
  lowStockItems: [],
  recentOrders: [],
  loading: true,
  refreshData: async () => {},
  lastUpdated: null,
});

// مقدم السياق (Provider)
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [pendingMaintenanceCount, setPendingMaintenanceCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<InventoryWithItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // دالة لتحديث البيانات
  const refreshData = async () => {
    setLoading(true);
    
    try {
      // طلبات الصيانة المعلقة
      try {
        const pendingRequests = await getMaintenanceRequests(undefined, undefined, 'pending');
        setPendingMaintenanceCount(pendingRequests.length);
      } catch (err) {
        console.warn('لم نتمكن من تحميل بيانات الصيانة:', err);
      }

      // العناصر منخفضة المخزون
      try {
        const lowStock = await getLowStockItems(5);
        setLowStockItems(lowStock.slice(0, 3));
      } catch (err) {
        console.warn('لم نتمكن من تحميل بيانات المخزون:', err);
      }

      // طلبات الشراء الحديثة
      try {
        const orders = await getPurchaseOrders();
        setRecentOrders(orders.slice(0, 2));
      } catch (err) {
        console.warn('لم نتمكن من تحميل بيانات طلبات الشراء:', err);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('خطأ أثناء تحديث بيانات التطبيق:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    refreshData();
    
    // تحديث البيانات كل 5 دقائق
    const intervalId = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        pendingMaintenanceCount,
        lowStockItems,
        recentOrders,
        loading,
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