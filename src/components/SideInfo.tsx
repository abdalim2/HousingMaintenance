"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppData } from '@/lib/AppDataContext';

export default function SideInfo() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { pendingMaintenanceCount, lowStockItems, recentOrders, loading } = useAppData();

  useEffect(() => {
    // تحديث التاريخ والوقت كل دقيقة
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // تنسيق التاريخ باللغة العربية
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('ar-SA', options);
  };

  // تنسيق الوقت
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };
  
  // تحويل حالة الطلب إلى اللغة العربية
  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'submitted': return 'مقدم';
      case 'approved': return 'موافق عليه';
      case 'received': return 'مستلم';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* عرض التاريخ والوقت */}
      <div className="card p-4 text-center">
        <h3 className="text-lg font-bold opacity-70">{formatDate(currentDate)}</h3>
        <p className="text-3xl font-bold">{formatTime(currentDate)}</p>
      </div>

      {/* ملخص الصيانة */}
      <div className="card p-4">
        <h3 className="text-xl font-bold mb-3 flex justify-between items-center">
          <span>طلبات الصيانة</span>
          <Link href="/maintenance" className="text-xs text-primary hover:underline">
            عرض الكل
          </Link>
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg mb-2">
              <span className="font-medium">طلبات معلقة</span>
              <span className="badge badge-primary">{pendingMaintenanceCount}</span>
            </div>
            
            <div className="mt-4">
              <Link 
                href="/maintenance/new" 
                className="btn btn-primary btn-sm w-full"
                prefetch={true}
              >
                إنشاء طلب صيانة جديد
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* المخزون المنخفض */}
      {!loading && lowStockItems.length > 0 && (
        <div className="card p-4">
          <h3 className="text-xl font-bold mb-3 flex justify-between items-center">
            <span>مخزون منخفض</span>
            <Link href="/inventory" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </h3>
          
          <div className="mt-2 space-y-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 bg-base-200 rounded-md">
                <div>
                  <p className="font-medium">{item.items?.name || 'غير معرف'}</p>
                  <div className="text-xs opacity-70 flex items-center mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-warning mr-1"></span>
                    {item.quantity} {item.items?.unit || 'قطعة'}
                  </div>
                </div>
                <Link 
                  href={`/purchase-orders/new?item=${item.item_id}`}
                  className="text-xs text-primary hover:underline"
                  prefetch={true}
                >
                  طلب
                </Link>
              </div>
            ))}
            
            <Link 
              href="/purchase-orders/new" 
              className="btn btn-outline btn-sm w-full mt-2"
              prefetch={true}
            >
              إنشاء طلب شراء
            </Link>
          </div>
        </div>
      )}

      {/* آخر طلبات الشراء */}
      {!loading && recentOrders.length > 0 && (
        <div className="card p-4">
          <h3 className="text-xl font-bold mb-3 flex justify-between items-center">
            <span>طلبات الشراء</span>
            <Link href="/purchase-orders" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </h3>
          
          <div className="mt-2 space-y-2">
            {recentOrders.map((order) => (
              <Link 
                href={`/purchase-orders/${order.id}`}
                key={order.id} 
                className="block p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
                prefetch={true}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">طلب #{order.id.substring(0, 6)}</span>
                  <span className="badge badge-sm">
                    {getOrderStatusText(order.status)}
                  </span>
                </div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(order.order_date).toLocaleDateString('ar-SA')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* روابط سريعة */}
      <div className="card p-4">
        <h3 className="text-xl font-bold mb-3">روابط سريعة</h3>
        
        <div className="mt-2 space-y-2">
          <Link 
            href="/housing/management" 
            className="flex items-center p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
            prefetch={true}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span>إدارة المجمعات</span>
          </Link>
          
          <Link 
            href="/inventory/file-processor" 
            className="flex items-center p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
            prefetch={true}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-lg ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <span>رفع المخزون</span>
          </Link>
          
          <Link 
            href="/reports" 
            className="flex items-center p-2 bg-base-200 rounded-md hover:bg-base-300 transition-colors"
            prefetch={true}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg ml-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>التقارير</span>
          </Link>
        </div>
      </div>
    </div>
  );
}