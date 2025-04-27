"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMaintenanceRequests } from '@/lib/services/maintenanceService';
import { getComplexes, getBuildings } from '@/lib/services/housingService';
import { MaintenanceRequest, ResidentialComplex, Building } from '@/models/types';
import { supabase } from '@/lib/supabase';

export default function MaintenanceRequestsPage() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    complexId: '',
    buildingId: '',
    status: '',
    priority: ''
  });

  // تحقق من وجود جدول maintenance_requests وإنشاؤه إذا لزم الأمر
  const setupMaintenanceTable = async () => {
    try {
      // التحقق من وجود الجدول
      const { data: tableExists, error: checkError } = await supabase
        .from('maintenance_requests')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        // الجدول غير موجود، نقوم بتشغيل سكريبت إعداد قاعدة البيانات
        console.log('جدول maintenance_requests غير موجود. سيتم إنشاؤه الآن...');
        
        // تنفيذ سكريبت إنشاء قاعدة البيانات
        const response = await fetch('/api/diagnostics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'setup_database' }),
        });
        
        if (response.ok) {
          console.log('تم إعداد قاعدة البيانات بنجاح');
          return true;
        } else {
          const errorData = await response.json();
          throw new Error(`فشل إعداد قاعدة البيانات: ${errorData.error || 'خطأ غير معروف'}`);
        }
      } else if (checkError) {
        throw checkError;
      }
      
      return true;
    } catch (err: any) {
      console.error('خطأ في التحقق من جدول maintenance_requests:', err);
      return false;
    }
  };

  // Fetch all complexes on component mount
  useEffect(() => {
    const fetchComplexes = async () => {
      try {
        const complexesData = await getComplexes();
        setComplexes(complexesData);
      } catch (err) {
        console.error('Error fetching complexes:', err);
      }
    };

    fetchComplexes();
  }, []);

  // Fetch buildings when complex filter changes
  useEffect(() => {
    if (filters.complexId) {
      const fetchBuildings = async () => {
        try {
          const buildingsData = await getBuildings(filters.complexId);
          setBuildings(buildingsData);
          
          // Reset building filter if selected complex changes
          setFilters(prev => ({
            ...prev,
            buildingId: ''
          }));
        } catch (err) {
          console.error('Error fetching buildings:', err);
        }
      };

      fetchBuildings();
    } else {
      setBuildings([]);
    }
  }, [filters.complexId]);

  // Fetch maintenance requests with filters
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // التحقق من وجود جدول maintenance_requests وإنشاؤه إذا لزم الأمر
        await setupMaintenanceTable();
        
        const requests = await getMaintenanceRequests(
          filters.complexId || undefined,
          filters.buildingId || undefined,
          filters.status as MaintenanceRequest['status'] || undefined
        );
        
        // Apply priority filter in-memory if needed
        const filteredRequests = filters.priority 
          ? requests.filter(request => request.priority === filters.priority)
          : requests;
          
        setMaintenanceRequests(filteredRequests);
      } catch (err: any) {
        console.error('Error fetching maintenance requests:', err);
        // Show more detailed error message to help with debugging
        setError(`حدث خطأ أثناء تحميل البيانات: ${err.message || 'خطأ غير معروف'}. الرجاء المحاولة مرة أخرى.`);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      complexId: '',
      buildingId: '',
      status: '',
      priority: ''
    });
  };

  // إعادة تهيئة قاعدة البيانات يدويًا
  const handleDatabaseSetup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // تنفيذ سكريبت إعداد قاعدة البيانات
      const response = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'setup_database' }),
      });
      
      if (response.ok) {
        // إعادة تحميل البيانات بعد إعداد قاعدة البيانات
        const requests = await getMaintenanceRequests();
        setMaintenanceRequests(requests);
      } else {
        const errorData = await response.json();
        throw new Error(`فشل إعداد قاعدة البيانات: ${errorData.error || 'خطأ غير معروف'}`);
      }
    } catch (err: any) {
      console.error('Error setting up database:', err);
      setError(`فشل إعداد قاعدة البيانات: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">طلبات الصيانة</h1>
        <Link href="/maintenance/new" className="btn btn-primary bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded dark:bg-teal-700 dark:hover:bg-teal-600">
          طلب صيانة جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 dark:bg-gray-800">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">تصفية النتائج</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">المجمع السكني</label>
            <select
              value={filters.complexId}
              onChange={(e) => handleFilterChange('complexId', e.target.value)}
              className="select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">جميع المجمعات</option>
              {complexes.map(complex => (
                <option key={complex.id} value={complex.id}>
                  {complex.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">المبنى</label>
            <select
              value={filters.buildingId}
              onChange={(e) => handleFilterChange('buildingId', e.target.value)}
              className="select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!filters.complexId}
            >
              <option value="">جميع المباني</option>
              {buildings.map(building => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="approved">معتمد</option>
              <option value="rejected">مرفوض</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">الأولوية</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">جميع الأولويات</option>
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">عالية</option>
              <option value="emergency">طارئة</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="btn bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700 mr-2"
          >
            إعادة تعيين التصفية
          </button>
          <button
            type="button"
            onClick={handleDatabaseSetup}
            className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            إعادة تهيئة قاعدة البيانات
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Maintenance Requests Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
        {loading ? (
          <div className="text-center py-10 dark:text-gray-300">
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        ) : maintenanceRequests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 dark:text-gray-400">لا توجد طلبات صيانة مطابقة للمعايير المحددة.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    رقم الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    المجمع / المبنى
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    الأولوية
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    مقدم الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    تاريخ الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {maintenanceRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap dark:text-gray-300">{request.id.substring(0, 8)}</td>
                    <td className="px-4 py-4 whitespace-nowrap dark:text-gray-300">
                      {/* This would show actual complex and building names in a real app */}
                      المجمع: {request.complex_id.substring(0, 8)}
                      <br />
                      المبنى: {request.building_id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <PriorityBadge priority={request.priority} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap dark:text-gray-300">
                      {request.reported_by}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap dark:text-gray-300" dir="ltr">
                      {new Date(request.reported_date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/maintenance/${request.id}`}
                        className="text-blue-600 hover:underline ml-2 dark:text-blue-400"
                      >
                        عرض التفاصيل
                      </Link>
                      <Link 
                        href={`/maintenance/${request.id}/edit`}
                        className="text-teal-600 hover:underline dark:text-teal-400"
                      >
                        تحرير
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
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: MaintenanceRequest['status'] }) {
  const statusColors: Record<MaintenanceRequest['status'], { bg: string; text: string; label: string; darkBg: string; darkText: string }> = {
    pending: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      darkBg: 'dark:bg-yellow-900/30', 
      darkText: 'dark:text-yellow-300', 
      label: 'معلق' 
    },
    approved: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      darkBg: 'dark:bg-blue-900/30', 
      darkText: 'dark:text-blue-300', 
      label: 'معتمد' 
    },
    rejected: { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      darkBg: 'dark:bg-red-900/30', 
      darkText: 'dark:text-red-300', 
      label: 'مرفوض' 
    },
    in_progress: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-800', 
      darkBg: 'dark:bg-purple-900/30', 
      darkText: 'dark:text-purple-300', 
      label: 'قيد التنفيذ' 
    },
    completed: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      darkBg: 'dark:bg-green-900/30', 
      darkText: 'dark:text-green-300', 
      label: 'مكتمل' 
    },
  };

  const { bg, text, darkBg, darkText, label } = statusColors[status];

  return (
    <span className={`${bg} ${text} ${darkBg} ${darkText} px-2 py-1 rounded-full text-xs`}>
      {label}
    </span>
  );
}

// Helper component for priority badges
function PriorityBadge({ priority }: { priority: MaintenanceRequest['priority'] }) {
  const priorityColors: Record<MaintenanceRequest['priority'], { bg: string; text: string; darkBg: string; darkText: string; label: string }> = {
    low: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      darkBg: 'dark:bg-green-900/30', 
      darkText: 'dark:text-green-300', 
      label: 'منخفضة' 
    },
    medium: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      darkBg: 'dark:bg-blue-900/30', 
      darkText: 'dark:text-blue-300', 
      label: 'متوسطة' 
    },
    high: { 
      bg: 'bg-orange-100', 
      text: 'text-orange-800', 
      darkBg: 'dark:bg-orange-900/30', 
      darkText: 'dark:text-orange-300', 
      label: 'عالية' 
    },
    emergency: { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      darkBg: 'dark:bg-red-900/30', 
      darkText: 'dark:text-red-300', 
      label: 'طارئة' 
    },
  };

  const { bg, text, darkBg, darkText, label } = priorityColors[priority];

  return (
    <span className={`${bg} ${text} ${darkBg} ${darkText} px-2 py-1 rounded-full text-xs`}>
      {label}
    </span>
  );
}