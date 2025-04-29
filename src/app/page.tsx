"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardData } from './api/server-actions/dashboard-data';
import { MaintenanceRequest, InventoryWithItem, PurchaseOrder } from '@/models/types';

export default function Dashboard() {
  const [pendingMaintenanceCount, setPendingMaintenanceCount] = useState(0);
  const [inProgressMaintenanceCount, setInProgressMaintenanceCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<InventoryWithItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        const data = await getDashboardData();
        
        if (data.error) {
          setError(data.error);
        } else {
          setPendingMaintenanceCount(data.pendingMaintenanceRequests.length);
          setInProgressMaintenanceCount(data.inProgressMaintenanceRequests.length);
          setLowStockItems(data.lowStockItems);
          setRecentOrders(data.recentOrders);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(`فشل في تحميل بيانات لوحة التحكم: ${err.message || 'خطأ غير معروف'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Header section with greeting and summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مرحباً بك في نظام إدارة المجمعات السكنية</h1>
        <p className="text-gray-600 dark:text-gray-400">نظرة عامة على حالة النظام والأنشطة الأخيرة</p>
      </div>
      
      {/* Display error message if any */}
      {error && (
        <div className="mb-6 p-4 border-r-4 border-danger-600 bg-danger-50 dark:bg-danger-900/30 dark:border-danger-500 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-danger-600 dark:text-danger-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-danger-600 dark:text-danger-500">{error}</p>
            </div>
            <button 
              className="mr-auto p-1.5 rounded-md text-danger-600 dark:text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-800" 
              onClick={() => setError(null)}
              aria-label="إغلاق"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Display loading spinner when fetching data */}
      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل البيانات...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats overview section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Pending maintenance requests */}
            <div className="stat-card card-hover">
              <div className="flex justify-between">
                <div>
                  <p className="stat-label">طلبات صيانة معلقة</p>
                  <p className="stat-value text-primary-600 dark:text-primary-400">{pendingMaintenanceCount}</p>
                </div>
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/maintenance?status=pending" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium inline-flex items-center">
                  عرض الطلبات 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* In progress maintenance */}
            <div className="stat-card card-hover">
              <div className="flex justify-between">
                <div>
                  <p className="stat-label">صيانة قيد التنفيذ</p>
                  <p className="stat-value text-secondary-600 dark:text-secondary-400">{inProgressMaintenanceCount}</p>
                </div>
                <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/maintenance?status=in_progress" className="text-sm text-secondary-600 dark:text-secondary-400 hover:underline font-medium inline-flex items-center">
                  المزيد من التفاصيل
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Low stock items */}
            <div className="stat-card card-hover">
              <div className="flex justify-between">
                <div>
                  <p className="stat-label">أصناف منخفضة المخزون</p>
                  <p className="stat-value text-warning-600 dark:text-warning-400">{lowStockItems.length}</p>
                </div>
                <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900/50 text-warning-600 dark:text-warning-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/inventory" className="text-sm text-warning-600 dark:text-warning-400 hover:underline font-medium inline-flex items-center">
                  إدارة المخزون
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Purchase orders */}
            <div className="stat-card card-hover">
              <div className="flex justify-between">
                <div>
                  <p className="stat-label">طلبات الشراء الجديدة</p>
                  <p className="stat-value text-accent-600 dark:text-accent-400">{recentOrders.length}</p>
                </div>
                <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/purchase-orders" className="text-sm text-accent-600 dark:text-accent-400 hover:underline font-medium inline-flex items-center">
                  عرض طلبات الشراء
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-6">إجراءات سريعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link 
                href="/maintenance/new" 
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-primary-50 dark:hover:bg-gray-700/60 transition-colors group"
              >
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm font-medium">طلب صيانة جديد</span>
              </Link>

              <Link 
                href="/purchase-orders/new" 
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-secondary-50 dark:hover:bg-gray-700/60 transition-colors group"
              >
                <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 group-hover:bg-secondary-200 dark:group-hover:bg-secondary-800/50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">طلب شراء جديد</span>
              </Link>

              <Link 
                href="/inventory/file-processor" 
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700/60 transition-colors group"
              >
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-sm font-medium">رفع بيانات المخزون</span>
              </Link>

              <Link 
                href="/housing/management" 
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-700/60 transition-colors group"
              >
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-sm font-medium">إدارة المجمعات</span>
              </Link>

              <Link 
                href="/reports" 
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700/60 transition-colors group"
              >
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">التقارير</span>
              </Link>

              <Link 
                href="/purchase-orders/monthly" 
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-gray-700/60 transition-colors group"
              >
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">طلبات شهرية</span>
              </Link>
            </div>
          </div>
          
          {/* Data Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Maintenance Requests Table */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">أحدث طلبات الصيانة</h2>
                <Link href="/maintenance" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  عرض الكل
                </Link>
              </div>

              {pendingMaintenanceCount === 0 && inProgressMaintenanceCount === 0 ? (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 p-3 mb-4">
                    <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-1">جميع طلبات الصيانة مكتملة</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">لا توجد طلبات صيانة معلقة أو قيد التنفيذ حالياً</p>
                  <Link href="/maintenance/new" className="btn btn-sm btn-primary">
                    إنشاء طلب جديد
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>رقم الطلب</th>
                        <th>الموقع</th>
                        <th>الحالة</th>
                        <th>الأولوية</th>
                        <th>التاريخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* This should be populated with real data from API */}
                      <tr>
                        <td className="font-medium">#a93b50</td>
                        <td>المجمع الشرقي - مبنى 3</td>
                        <td>
                          <span className="badge badge-warning">قيد الانتظار</span>
                        </td>
                        <td>
                          <span className="badge badge-danger">عالية</span>
                        </td>
                        <td dir="ltr">2025-04-25</td>
                      </tr>
                      <tr>
                        <td className="font-medium">#c25e71</td>
                        <td>المجمع الغربي - مبنى 1</td>
                        <td>
                          <span className="badge badge-primary">قيد التنفيذ</span>
                        </td>
                        <td>
                          <span className="badge badge-warning">متوسطة</span>
                        </td>
                        <td dir="ltr">2025-04-24</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Low Stock Items */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">الأصناف منخفضة المخزون</h2>
                <Link href="/inventory" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                  إدارة المخزون
                </Link>
              </div>

              {lowStockItems.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30 p-3 mb-4">
                    <svg className="h-8 w-8 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-1">مستويات المخزون جيدة</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">جميع الأصناف متوفرة بكميات كافية</p>
                  <Link href="/inventory" className="btn btn-sm btn-success">
                    عرض المخزون
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>الصنف</th>
                        <th>الفئة</th>
                        <th>الكمية المتاحة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr key={item.id}>
                          <td className="font-medium">{item.name || 'صنف غير معرف'}</td>
                          <td>{item.category || 'بدون فئة'}</td>
                          <td>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-danger-600 h-2.5 rounded-full" 
                                  style={{ width: `${Math.min(Math.max((item.quantity || 0) * 20, 5), 100)}%` }}
                                ></div>
                              </div>
                              <span>{item.quantity} {item.unit}</span>
                            </div>
                          </td>
                          <td>
                            <Link 
                              href={`/purchase-orders/new?item=${item.item_id}`}
                              className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                            >
                              طلب شراء
                            </Link>
                          </td>
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

// Helper components for status badges could be defined here or imported from a shared component file