"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMaintenanceRequests } from '@/lib/services/maintenanceService';
import { getComplexes, getBuildings } from '@/lib/services/housingService';
import { MaintenanceRequest, ResidentialComplex, Building } from '@/models/types';

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
      } catch (err) {
        console.error('Error fetching maintenance requests:', err);
        setError('حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.');
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

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">طلبات الصيانة</h1>
        <Link href="/maintenance/new" className="btn btn-primary">
          طلب صيانة جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">تصفية النتائج</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">المجمع السكني</label>
            <select
              value={filters.complexId}
              onChange={(e) => handleFilterChange('complexId', e.target.value)}
              className="select w-full"
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
            <label className="block mb-2 text-sm font-medium">المبنى</label>
            <select
              value={filters.buildingId}
              onChange={(e) => handleFilterChange('buildingId', e.target.value)}
              className="select w-full"
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
            <label className="block mb-2 text-sm font-medium">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="select w-full"
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
            <label className="block mb-2 text-sm font-medium">الأولوية</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="select w-full"
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
            className="btn bg-gray-500 hover:bg-gray-600"
          >
            إعادة تعيين التصفية
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Maintenance Requests Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg">جاري تحميل البيانات...</p>
          </div>
        ) : maintenanceRequests.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">لا توجد طلبات صيانة مطابقة للمعايير المحددة.</p>
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
                    المجمع / المبنى
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأولوية
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مقدم الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الطلب
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">{request.id.substring(0, 8)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
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
                    <td className="px-4 py-4 whitespace-nowrap">
                      {request.reported_by}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap" dir="ltr">
                      {new Date(request.reported_date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/maintenance/${request.id}`}
                        className="text-secondary hover:underline ml-2"
                      >
                        عرض التفاصيل
                      </Link>
                      <Link 
                        href={`/maintenance/${request.id}/edit`}
                        className="text-primary hover:underline"
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
  const statusColors: Record<MaintenanceRequest['status'], { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'معلق' },
    approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'معتمد' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'مرفوض' },
    in_progress: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'قيد التنفيذ' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'مكتمل' },
  };

  const { bg, text, label } = statusColors[status];

  return (
    <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs`}>
      {label}
    </span>
  );
}

// Helper component for priority badges
function PriorityBadge({ priority }: { priority: MaintenanceRequest['priority'] }) {
  const priorityColors: Record<MaintenanceRequest['priority'], { bg: string; text: string; label: string }> = {
    low: { bg: 'bg-green-100', text: 'text-green-800', label: 'منخفضة' },
    medium: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'متوسطة' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'عالية' },
    emergency: { bg: 'bg-red-100', text: 'text-red-800', label: 'طارئة' },
  };

  const { bg, text, label } = priorityColors[priority];

  return (
    <span className={`${bg} ${text} px-2 py-1 rounded-full text-xs`}>
      {label}
    </span>
  );
}