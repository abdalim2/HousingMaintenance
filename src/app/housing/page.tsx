"use client";

import { useEffect, useState } from 'react';
import { 
  getComplexes, 
  getBuildings, 
  getRooms, 
  getFacilities,
  createComplex,
  testDatabaseConnection
} from '@/lib/services/housingService';
import { ResidentialComplex, Building, Room, Facility } from '@/models/types';

export default function HousingPage() {
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [selectedComplex, setSelectedComplex] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'facilities'>('rooms');
  
  const [showAddComplexModal, setShowAddComplexModal] = useState(false);
  const [newComplex, setNewComplex] = useState({ name: '', location: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safe data fetching utility that handles errors properly
  const safeDataFetch = async <T,>(
    fetchFn: () => Promise<T>,
    errorMessage: string,
    onSuccess?: (data: T) => void
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchComplexes = async () => {
      await safeDataFetch(
        async () => {
          const data = await getComplexes();
          setComplexes(data);
          if (data.length > 0) {
            setSelectedComplex(data[0].id);
          }
          return data;
        },
        'فشل في جلب المجمعات السكنية. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
      );
    };

    fetchComplexes();
  }, []);

  useEffect(() => {
    if (selectedComplex) {
      const fetchBuildings = async () => {
        await safeDataFetch(
          async () => {
            const data = await getBuildings(selectedComplex);
            setBuildings(data);
            setSelectedBuilding(data.length > 0 ? data[0].id : null);
            return data;
          },
          'فشل في جلب المباني. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
        );
      };

      fetchBuildings();
    }
  }, [selectedComplex]);

  useEffect(() => {
    if (selectedBuilding) {
      const fetchRoomsAndFacilities = async () => {
        await safeDataFetch(
          async () => {
            const [roomsData, facilitiesData] = await Promise.all([
              getRooms(selectedBuilding),
              getFacilities(selectedComplex || undefined, selectedBuilding || undefined)
            ]);
            
            setRooms(roomsData);
            setFacilities(facilitiesData);
            return { rooms: roomsData, facilities: facilitiesData };
          },
          'فشل في جلب الغرف والمرافق. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
        );
      };

      fetchRoomsAndFacilities();
    }
  }, [selectedBuilding, selectedComplex]);

  const handleAddComplex = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComplex.name || !newComplex.location) {
      setError('يرجى ملء الحقول المطلوبة');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('بيانات المجمع المراد إضافته:', newComplex);
      
      // اختبار الاتصال بقاعدة البيانات أولاً
      const connectionSuccess = await testDatabaseConnection();
      if (!connectionSuccess) {
        throw new Error('فشل الاتصال بقاعدة البيانات');
      }
      
      const complex = await createComplex({
        name: newComplex.name,
        location: newComplex.location,
        description: newComplex.description || ''
      });
      
      if (!complex) {
        throw new Error('لم يتم إرجاع بيانات بعد إضافة المجمع');
      }
      
      console.log('تمت إضافة المجمع بنجاح:', complex);
      
      // تحديث واجهة المستخدم
      setComplexes(prev => [...prev, complex]);
      setSelectedComplex(complex.id);
      setNewComplex({ name: '', location: '', description: '' });
      setShowAddComplexModal(false);
    } catch (err: any) {
      console.error('خطأ في إضافة المجمع:', err);
      
      // تحسين عرض رسائل الخطأ
      let errorMessage = 'فشل في إنشاء المجمع السكني';
      
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoomStatusClass = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusLabel = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'متاح';
      case 'occupied':
        return 'مشغول';
      case 'maintenance':
        return 'صيانة';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">إدارة الوحدات السكنية</h1>

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

      {loading && complexes.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          <div className="card mb-6 p-4">
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
              <div className="w-full md:w-1/3">
                <label className="block text-gray-700 mb-2">اختر المجمع السكني:</label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedComplex || ''}
                  onChange={(e) => setSelectedComplex(e.target.value)}
                  disabled={complexes.length === 0}
                >
                  {complexes.length === 0 ? (
                    <option disabled>لا توجد مجمعات سكنية</option>
                  ) : (
                    complexes.map(complex => (
                      <option key={complex.id} value={complex.id}>
                        {complex.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="w-full md:w-1/3">
                <label className="block text-gray-700 mb-2">اختر المبنى:</label>
                <select 
                  className="select select-bordered w-full"
                  value={selectedBuilding || ''}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  disabled={!selectedComplex || buildings.length === 0}
                >
                  {buildings.length === 0 ? (
                    <option disabled>لا توجد مباني متاحة</option>
                  ) : (
                    buildings.map(building => (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="w-full md:w-1/3 self-end md:text-left mt-4 md:mt-0">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddComplexModal(true)}
                >
                  إضافة مجمع جديد
                </button>
              </div>
            </div>
          </div>

          <div className="tabs tabs-boxed mb-6">
            <button 
              className={`tab ${activeTab === 'rooms' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              الغرف
            </button>
            <button 
              className={`tab ${activeTab === 'facilities' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('facilities')}
            >
              المرافق
            </button>
          </div>

          {activeTab === 'rooms' ? (
            <div className="card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">الغرف</h2>
                <button className="btn btn-sm btn-primary" disabled={!selectedBuilding}>إضافة غرفة</button>
              </div>

              {loading ? (
                <p className="text-center py-4">جاري تحميل الغرف...</p>
              ) : !selectedBuilding ? (
                <p className="text-gray-500 text-center py-4">يرجى اختيار مبنى لعرض الغرف.</p>
              ) : rooms.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد غرف مسجلة لهذا المبنى.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="text-right">رقم الغرفة</th>
                        <th className="text-right">الطابق</th>
                        <th className="text-right">النوع</th>
                        <th className="text-right">الحالة</th>
                        <th className="text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map(room => (
                        <tr key={room.id}>
                          <td>{room.room_number}</td>
                          <td>{room.floor}</td>
                          <td>{room.type}</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs ${getRoomStatusClass(room.status)}`}>
                              {getRoomStatusLabel(room.status)}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button className="btn btn-xs btn-ghost">تعديل</button>
                              <button className="btn btn-xs btn-ghost text-red-500">حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">المرافق</h2>
                <button className="btn btn-sm btn-primary" disabled={!selectedBuilding}>إضافة مرفق</button>
              </div>

              {loading ? (
                <p className="text-center py-4">جاري تحميل المرافق...</p>
              ) : !selectedBuilding ? (
                <p className="text-gray-500 text-center py-4">يرجى اختيار مبنى لعرض المرافق.</p>
              ) : facilities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد مرافق مسجلة لهذا المبنى.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="text-right">الاسم</th>
                        <th className="text-right">النوع</th>
                        <th className="text-right">الموقع</th>
                        <th className="text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilities.map(facility => (
                        <tr key={facility.id}>
                          <td>{facility.name}</td>
                          <td>{facility.type}</td>
                          <td>{facility.location_description}</td>
                          <td>
                            <div className="flex gap-2">
                              <button className="btn btn-xs btn-ghost">تعديل</button>
                              <button className="btn btn-xs btn-ghost text-red-500">حذف</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showAddComplexModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowAddComplexModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold mb-6 text-right">إضافة مجمع سكني جديد</h3>
            
            <form onSubmit={handleAddComplex}>
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  اسم المجمع <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className="input input-bordered w-full"
                  value={newComplex.name}
                  onChange={(e) => setNewComplex({...newComplex, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  className="input input-bordered w-full"
                  value={newComplex.location}
                  onChange={(e) => setNewComplex({...newComplex, location: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-right mb-2">
                  الوصف
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full"
                  value={newComplex.description}
                  onChange={(e) => setNewComplex({...newComplex, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn btn-ghost ml-2"
                  onClick={() => setShowAddComplexModal(false)}
                  disabled={isSubmitting}
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جاري الإضافة...' : 'إضافة المجمع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}