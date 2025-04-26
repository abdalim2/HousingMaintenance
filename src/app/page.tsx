"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMaintenanceRequests } from '@/lib/services/maintenanceService';
import { getLowStockItems } from '@/lib/services/inventoryService';
import { getPurchaseOrders } from '@/lib/services/purchaseService';
import { MaintenanceRequest, Inventory, PurchaseOrder } from '@/models/types';

export default function Dashboard() {
  const [pendingMaintenanceCount, setPendingMaintenanceCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get pending maintenance requests
        const pendingRequests = await getMaintenanceRequests(undefined, undefined, 'pending');
        setPendingMaintenanceCount(pendingRequests.length);

        // Get low stock items (threshold of 5)
        const lowStockItems = await getLowStockItems(5);
        setLowStockCount(lowStockItems.length);

        // Get recent purchase orders (limit to 5)
        const recentPurchaseOrders = await getPurchaseOrders();
        setRecentOrders(recentPurchaseOrders.slice(0, 5));
        
        // Clear any previous errors on success
        setError(null);
      } catch (err) {
        // Avoid console.error and instead set the error state
        setError('فشل في تحميل بيانات لوحة التحكم. يرجى التحقق من الاتصال والمحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      
      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
          <button 
            className="ml-auto" 
            onClick={() => setError(null)} 
            aria-label="dismiss"
          >
            ✕
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="card text-center py-10">
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-primary/10 border-r-4 border-primary p-6">
              <h3 className="text-lg font-medium text-gray-700">طلبات الصيانة المعلقة</h3>
              <p className="mt-2 text-3xl font-bold">{pendingMaintenanceCount}</p>
              <Link href="/maintenance" className="mt-4 inline-block text-primary hover:underline">
                عرض جميع الطلبات
              </Link>
            </div>
            
            <div className="card bg-secondary/10 border-r-4 border-secondary p-6">
              <h3 className="text-lg font-medium text-gray-700">أصناف منخفضة المخزون</h3>
              <p className="mt-2 text-3xl font-bold">{lowStockCount}</p>
              <Link href="/inventory" className="mt-4 inline-block text-secondary hover:underline">
                إدارة المخزون
              </Link>
            </div>
            
            <div className="card bg-accent/10 border-r-4 border-accent p-6">
              <h3 className="text-lg font-medium text-gray-700">طلبات الشراء</h3>
              <p className="mt-2 text-3xl font-bold">{recentOrders.length}</p>
              <Link href="/purchase-orders" className="mt-4 inline-block text-accent hover:underline">
                عرض طلبات الشراء
              </Link>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card mb-8 p-6">
            <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/maintenance/new" className="btn btn-primary">
                إنشاء طلب صيانة جديد
              </Link>
              <Link href="/purchase-orders/new" className="btn btn-secondary">
                إنشاء طلب شراء جديد
              </Link>
              <Link href="/reports" className="btn btn-accent">
                عرض التقارير
              </Link>
            </div>
          </div>
          
          {/* Recent Maintenance Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">أحدث طلبات الصيانة</h2>
                <Link href="/maintenance" className="text-primary hover:underline">
                  عرض الكل
                </Link>
              </div>
              {pendingMaintenanceCount === 0 ? (
                <p className="text-gray-500">لا توجد طلبات صيانة معلقة حالياً.</p>
              ) : (
                <div className="overflow-x-auto">
                  {/* Table would be populated with actual data */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-right">المجمع</th>
                        <th className="px-4 py-2 text-right">المبنى</th>
                        <th className="px-4 py-2 text-right">الأولوية</th>
                        <th className="px-4 py-2 text-right">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Sample placeholder rows */}
                      <tr>
                        <td className="px-4 py-2">مجمع العمال الشرقي</td>
                        <td className="px-4 py-2">مبنى 3</td>
                        <td className="px-4 py-2">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">عالية</span>
                        </td>
                        <td className="px-4 py-2" dir="ltr">2025-04-25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Recent Purchase Orders */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">أحدث طلبات الشراء</h2>
                <Link href="/purchase-orders" className="text-primary hover:underline">
                  عرض الكل
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500">لا توجد طلبات شراء حديثة.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-right">رقم الطلب</th>
                        <th className="px-4 py-2 text-right">التاريخ</th>
                        <th className="px-4 py-2 text-right">الحالة</th>
                        <th className="px-4 py-2 text-right">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order, index) => (
                        <tr key={order.id || index}>
                          <td className="px-4 py-2">#{order.id.substring(0, 8)}</td>
                          <td className="px-4 py-2" dir="ltr">{new Date(order.order_date).toLocaleDateString('ar-SA')}</td>
                          <td className="px-4 py-2">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-2">{order.total_amount || 0} ريال</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: PurchaseOrder['status'] }) {
  const statusColors: Record<PurchaseOrder['status'], { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'مسودة' },
    submitted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'مقدم' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'معتمد' },
    ordered: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'تم الطلب' },
    received: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'تم الاستلام' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'مكتمل' },
  };

  const { bg, text, label } = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

  return (
    <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs`}>
      {label}
    </span>
  );
}