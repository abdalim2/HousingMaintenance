"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMaintenanceRequests, getMonthlyMaintenanceRequests } from '@/lib/services/maintenanceService';
import { getLowStockItems } from '@/lib/services/inventoryService';
import { getPurchaseOrders } from '@/lib/services/purchaseService';
import { MaintenanceRequest, Inventory, PurchaseOrder } from '@/models/types';

// Extended inventory type with item details
type InventoryWithItem = Inventory & {
  items: {
    id: string;
    name: string;
    category_id: string;
    unit: string;
  };
};

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [maintenanceStats, setMaintenanceStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0,
    averageCompletionDays: 0
  });
  const [inventoryStats, setInventoryStats] = useState({
    lowStockCount: 0,
    lowStockItems: [] as InventoryWithItem[]
  });
  const [purchaseStats, setPurchaseStats] = useState({
    total: 0,
    totalAmount: 0,
    pending: 0,
    completed: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the current date and previous periods
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Calculate date ranges based on selected timeframe
  const getDateRange = () => {
    let startDate = new Date();
    
    if (timeframe === 'month') {
      startDate = new Date(currentYear, currentMonth, 1);
    } else if (timeframe === 'quarter') {
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      startDate = new Date(currentYear, quarterStartMonth, 1);
    } else if (timeframe === 'year') {
      startDate = new Date(currentYear, 0, 1);
    }
    
    return {
      start: startDate,
      end: currentDate
    };
  };
  
  // Load report data based on the selected timeframe
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const dateRange = getDateRange();
        
        // Fetch maintenance data
        const maintenanceData = await getMaintenanceRequests();
        
        // Filter maintenance requests by date range
        const filteredMaintenance = maintenanceData.filter(request => {
          const requestDate = new Date(request.reported_date);
          return requestDate >= dateRange.start && requestDate <= dateRange.end;
        });
        
        // Calculate maintenance statistics
        const totalRequests = filteredMaintenance.length;
        const pendingRequests = filteredMaintenance.filter(req => 
          req.status === 'pending' || req.status === 'approved'
        ).length;
        const inProgressRequests = filteredMaintenance.filter(req => req.status === 'in_progress').length;
        const completedRequests = filteredMaintenance.filter(req => req.status === 'completed').length;
        const completionRate = totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;
        
        // Calculate average completion time in days
        let totalCompletionDays = 0;
        let completedRequestsWithDates = 0;
        
        filteredMaintenance.forEach(req => {
          if (req.status === 'completed' && req.completion_date) {
            const reportedDate = new Date(req.reported_date);
            const completedDate = new Date(req.completion_date);
            const daysToComplete = Math.floor((completedDate.getTime() - reportedDate.getTime()) / (1000 * 60 * 60 * 24));
            
            totalCompletionDays += daysToComplete;
            completedRequestsWithDates++;
          }
        });
        
        const averageCompletionDays = completedRequestsWithDates > 0 
          ? Math.round(totalCompletionDays / completedRequestsWithDates) 
          : 0;
        
        setMaintenanceStats({
          total: totalRequests,
          pending: pendingRequests,
          inProgress: inProgressRequests,
          completed: completedRequests,
          completionRate: parseFloat(completionRate.toFixed(1)),
          averageCompletionDays
        });
        
        // Fetch low stock items
        const lowStock = await getLowStockItems(5);
        setInventoryStats({
          lowStockCount: lowStock.length,
          lowStockItems: lowStock as InventoryWithItem[]
        });
        
        // Fetch purchase orders
        const purchaseOrders = await getPurchaseOrders();
        
        // Filter purchase orders by date range
        const filteredPurchases = purchaseOrders.filter(order => {
          const orderDate = new Date(order.order_date);
          return orderDate >= dateRange.start && orderDate <= dateRange.end;
        });
        
        const totalOrders = filteredPurchases.length;
        const pendingOrders = filteredPurchases.filter(order => 
          order.status === 'draft' || order.status === 'submitted' || order.status === 'approved' || order.status === 'ordered'
        ).length;
        const completedOrders = filteredPurchases.filter(order => 
          order.status === 'received' || order.status === 'completed'
        ).length;
        
        // Calculate total purchase amount
        const totalAmount = filteredPurchases.reduce((sum, order) => {
          return sum + (order.total_amount || 0);
        }, 0);
        
        setPurchaseStats({
          total: totalOrders,
          totalAmount,
          pending: pendingOrders,
          completed: completedOrders
        });
      } catch (err) {
        // Improved error handling with proper formatting
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching report data:', errorMessage);
        setError('حدث خطأ أثناء تحميل بيانات التقارير. الرجاء المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [timeframe]);
  
  return (
    <div className="container mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">التقارير والإحصائيات</h1>
      
      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}
      
      {/* Time Period Selection */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">الفترة الزمنية</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'month' 
                ? 'bg-teal-600 text-white dark:bg-teal-700' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            شهري
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'quarter' 
                ? 'bg-teal-600 text-white dark:bg-teal-700' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            ربع سنوي
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'year' 
                ? 'bg-teal-600 text-white dark:bg-teal-700' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
            }`}
          >
            سنوي
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10 dark:text-gray-300">
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          {/* Maintenance Statistics */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 dark:bg-gray-800">
            <div className="bg-teal-50 p-4 border-b border-teal-100 dark:bg-teal-900/20 dark:border-teal-900/30">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-teal-800 dark:text-teal-300">إحصائيات طلبات الصيانة</h2>
                <Link href="/reports/maintenance" className="text-teal-600 hover:underline dark:text-teal-400">
                  عرض التقرير المفصل
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold dark:text-white">{maintenanceStats.total}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
                  <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">قيد الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{maintenanceStats.pending}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">قيد التنفيذ</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{maintenanceStats.inProgress}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">مكتملة</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{maintenanceStats.completed}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                  <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">معدل الإنجاز</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{maintenanceStats.completionRate}%</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg dark:bg-indigo-900/20">
                  <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">متوسط مدة الإنجاز</p>
                  <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{maintenanceStats.averageCompletionDays} يوم</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Inventory and Purchase Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Inventory Status */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
              <div className="bg-blue-50 p-4 border-b border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300">حالة المخزون</h2>
                  <Link href="/inventory" className="text-blue-600 hover:underline dark:text-blue-400">
                    إدارة المخزون
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium dark:text-white">الأصناف منخفضة المخزون</h3>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs dark:bg-red-900/30 dark:text-red-300">
                      {inventoryStats.lowStockCount} صنف
                    </span>
                  </div>
                  
                  {inventoryStats.lowStockItems.length > 0 ? (
                    <ul className="divide-y dark:divide-gray-700">
                      {inventoryStats.lowStockItems.slice(0, 5).map(item => (
                        <li key={item.id} className="py-2 flex justify-between dark:text-gray-300">
                          <span>{item.items.name}</span>
                          <span className="font-bold text-red-600 dark:text-red-400">{item.quantity} {item.items.unit}</span>
                        </li>
                      ))}
                      {inventoryStats.lowStockItems.length > 5 && (
                        <li className="py-2 text-center text-blue-600 hover:underline dark:text-blue-400">
                          <Link href="/inventory?showLowStock=true">
                            عرض الكل ({inventoryStats.lowStockItems.length})
                          </Link>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-4 dark:text-gray-400">
                      لا توجد أصناف منخفضة المخزون
                    </p>
                  )}
                </div>
                
                <Link href="/inventory/report" className="btn bg-blue-600 hover:bg-blue-700 text-white w-full py-2 px-4 rounded-md block text-center dark:bg-blue-700 dark:hover:bg-blue-600">
                  تقرير المخزون الشامل
                </Link>
              </div>
            </div>
            
            {/* Purchase Orders Status */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
              <div className="bg-purple-50 p-4 border-b border-purple-100 dark:bg-purple-900/20 dark:border-purple-900/30">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-300">حالة المشتريات</h2>
                  <Link href="/purchase-orders" className="text-purple-600 hover:underline dark:text-purple-400">
                    عرض طلبات الشراء
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">إجمالي الطلبات</p>
                    <p className="text-2xl font-bold dark:text-white">{purchaseStats.total}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                    <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">المبلغ الإجمالي</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{purchaseStats.totalAmount.toLocaleString()} ريال</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
                    <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">قيد الإجراء</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{purchaseStats.pending}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                    <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">مكتملة</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{purchaseStats.completed}</p>
                  </div>
                </div>
                
                <Link href="/reports/purchases" className="btn bg-purple-600 hover:bg-purple-700 text-white w-full py-2 px-4 rounded-md block text-center dark:bg-purple-700 dark:hover:bg-purple-600">
                  تقرير المشتريات الشامل
                </Link>
              </div>
            </div>
          </div>
          
          {/* Monthly Reports Links */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8 dark:bg-gray-800">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">التقارير الشهرية</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href={`/reports/monthly/${currentYear}/${currentMonth + 1}/maintenance`}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 flex flex-col items-center dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 mb-2 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-center font-medium dark:text-white">تقرير الصيانة الشهري</span>
                </Link>
                
                <Link 
                  href={`/reports/monthly/${currentYear}/${currentMonth + 1}/inventory`}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 flex flex-col items-center dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="text-center font-medium dark:text-white">تقرير حركة المخزون</span>
                </Link>
                
                <Link 
                  href={`/reports/monthly/${currentYear}/${currentMonth + 1}/purchases`}
                  className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 flex flex-col items-center dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-center font-medium dark:text-white">تقرير المشتريات الشهري</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Export Reports */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-white">تصدير التقارير</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 dark:text-gray-400">
                يمكنك تصدير التقارير بصيغ مختلفة للطباعة أو المشاركة أو الأرشفة.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md dark:bg-green-700 dark:hover:bg-green-600">
                  تصدير إلى Excel
                </button>
                <button className="btn bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md dark:bg-red-700 dark:hover:bg-red-600">
                  تصدير إلى PDF
                </button>
                <button className="btn bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md dark:bg-gray-700 dark:hover:bg-gray-600">
                  طباعة التقرير
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}