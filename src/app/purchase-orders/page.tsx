"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPurchaseOrders } from '@/lib/services/purchaseService';
import { PurchaseOrder } from '@/models/types';

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });

  // Load purchase orders
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const orders = await getPurchaseOrders(
          filterStatus as PurchaseOrder['status'] || undefined
        );
        setPurchaseOrders(orders);
      } catch (err: any) {
        console.error('Error fetching purchase orders:', err.message || JSON.stringify(err));
        setError(`حدث خطأ أثناء تحميل طلبات الشراء: ${err.message || 'خطأ غير معروف'}. الرجاء المحاولة مرة أخرى.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterStatus]);

  // Filter by date range
  const filteredOrders = purchaseOrders.filter(order => {
    let includeOrder = true;
    
    // Apply date filters if they exist
    if (dateRange.start) {
      includeOrder = includeOrder && new Date(order.order_date) >= new Date(dateRange.start);
    }
    
    if (dateRange.end) {
      includeOrder = includeOrder && new Date(order.order_date) <= new Date(dateRange.end);
    }
    
    return includeOrder;
  });

  // Calculate statistics
  const pendingCount = purchaseOrders.filter(order => 
    order.status === 'draft' || order.status === 'submitted'
  ).length;
  
  const receivedCount = purchaseOrders.filter(order => 
    order.status === 'received'
  ).length;
  
  const completedCount = purchaseOrders.filter(order => 
    order.status === 'completed'
  ).length;

  // Monthly purchase orders (group by month)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const thisMonthOrders = purchaseOrders.filter(order => {
    const orderDate = new Date(order.order_date);
    return orderDate.getMonth() === currentMonth && 
           orderDate.getFullYear() === currentYear;
  });

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">طلبات الشراء</h1>
        <div className="flex gap-3">
          <Link href="/purchase-orders/monthly" className="btn btn-secondary">
            إنشاء طلب شهري
          </Link>
          <Link href="/purchase-orders/new" className="btn btn-primary">
            إنشاء طلب شراء
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-700">إجمالي الطلبات</h3>
          <p className="mt-2 text-3xl font-bold">{purchaseOrders.length}</p>
        </div>
        
        <div className="card bg-yellow-50 border-r-4 border-yellow-500">
          <h3 className="text-lg font-medium text-gray-700">طلبات معلقة</h3>
          <p className="mt-2 text-3xl font-bold">{pendingCount}</p>
        </div>
        
        <div className="card bg-blue-50 border-r-4 border-blue-500">
          <h3 className="text-lg font-medium text-gray-700">تم الاستلام</h3>
          <p className="mt-2 text-3xl font-bold">{receivedCount}</p>
        </div>
        
        <div className="card bg-green-50 border-r-4 border-green-500">
          <h3 className="text-lg font-medium text-gray-700">مكتملة</h3>
          <p className="mt-2 text-3xl font-bold">{completedCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">تصفية طلبات الشراء</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">الحالة</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select w-full"
            >
              <option value="">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="submitted">مقدم</option>
              <option value="approved">معتمد</option>
              <option value="ordered">تم الطلب</option>
              <option value="received">تم الاستلام</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">من تاريخ</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input w-full"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">إلى تاريخ</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">طلبات الشهر الحالي ({thisMonthOrders.length})</h2>
          {thisMonthOrders.length > 0 && (
            <Link href={`/reports/monthly/${currentYear}/${currentMonth + 1}`} className="text-primary hover:underline">
              عرض التقرير الشهري
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thisMonthOrders.slice(0, 3).map(order => (
            <div key={order.id} className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">طلب #{order.id.substring(0, 8)}</h3>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-gray-600 text-sm mb-2" dir="ltr">
                {new Date(order.order_date).toLocaleDateString('ar-SA')}
              </p>
              <p className="text-gray-700">
                {order.total_amount ? `${order.total_amount} ريال` : 'المبلغ غير محدد'}
              </p>
              <div className="mt-3">
                <Link href={`/purchase-orders/${order.id}`} className="text-primary hover:underline text-sm">
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
          
          {thisMonthOrders.length === 0 && (
            <div className="col-span-3 bg-gray-50 p-4 rounded-md text-center text-gray-500">
              لا توجد طلبات شراء لهذا الشهر
            </div>
          )}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-lg">جميع طلبات الشراء</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">لا توجد طلبات شراء مطابقة للمعايير المحددة.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المبلغ الإجمالي
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المورد
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    منشئ الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" dir="ltr">
                      {new Date(order.order_date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {order.total_amount ? `${order.total_amount} ريال` : 'غير محدد'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {order.vendor || 'غير محدد'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {order.created_by}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/purchase-orders/${order.id}`}
                        className="text-secondary hover:underline ml-2"
                      >
                        عرض
                      </Link>
                      
                      {(order.status === 'draft' || order.status === 'submitted') && (
                        <Link 
                          href={`/purchase-orders/${order.id}/edit`}
                          className="text-primary hover:underline ml-2"
                        >
                          تحرير
                        </Link>
                      )}
                      
                      {order.status === 'ordered' && (
                        <Link 
                          href={`/purchase-orders/${order.id}/receive`}
                          className="text-accent hover:underline"
                        >
                          استلام
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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