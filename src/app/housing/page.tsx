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
import HousingVisualization from '@/components/HousingVisualization';

export default function HousingPage() {
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [selectedComplex, setSelectedComplex] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visualization' | 'rooms' | 'facilities'>('visualization');
  
  const [showAddComplexModal, setShowAddComplexModal] = useState(false);
  const [newComplex, setNewComplex] = useState({ name: '', location: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safe data fetching utility that handles errors properly
  const safeDataFetch = async <T,>(fetchFn: () => Promise<T>, errorMessage: string): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError(null);
      return await fetchFn();
    } catch (err) {
      console.error(err);
      setError(errorMessage);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // Load all complexes on component mount
  useEffect(() => {
    const loadComplexes = async () => {
      await safeDataFetch(
        async () => {
          const data = await getComplexes();
          setComplexes(data);
          return data;
        },
        'فشل في جلب المجمعات السكنية. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
      );
    };

    loadComplexes();
  }, []);

  // Load buildings when a complex is selected
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

  // Load rooms and facilities when a building is selected
  useEffect(() => {
    if (selectedBuilding) {
      const fetchRoomsAndFacilities = async () => {
        await safeDataFetch(
          async () => {
            const [roomsData, facilitiesData] = await Promise.all([
              getRooms(selectedBuilding),
              selectedComplex ? getFacilities(selectedComplex) : Promise.resolve([])
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
      setError('الاسم والموقع مطلوبان');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdComplex = await createComplex({
        ...newComplex,
        buildings: []
      });
      setComplexes(prev => [...prev, createdComplex]);
      setNewComplex({ name: '', location: '', description: '' });
      setShowAddComplexModal(false);
    } catch (error) {
      console.error('Error creating complex:', error);
      setError('حدث خطأ أثناء إنشاء المجمع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectComplex = (complexId: string) => {
    setSelectedComplex(complexId);
  };

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuilding(buildingId);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <div>
            <button className="btn btn-primary" onClick={() => setShowAddComplexModal(true)}>
              إضافة مجمع جديد
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-right">إدارة السكن</h1>
      </div>

      {loading && <div className="loading loading-spinner loading-lg"></div>}

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
          <button className="btn btn-sm" onClick={() => setError(null)}>إغلاق</button>
        </div>
      )}

      <div className="flex justify-between mb-6">
        <div>
          <label className="mr-2">المجمع السكني:</label>
          <select 
            className="select select-bordered" 
            value={selectedComplex || ''}
            onChange={e => setSelectedComplex(e.target.value || null)}
          >
            <option value="">اختر مجمع سكني</option>
            {complexes.map(complex => (
              <option key={complex.id} value={complex.id}>{complex.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'visualization' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('visualization')}
        >
          عرض الهيكل
        </a>
        <a 
          className={`tab ${activeTab === 'rooms' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          الغرف
        </a>
        <a 
          className={`tab ${activeTab === 'facilities' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          المرافق
        </a>
      </div>

      {/* Visualization Tab */}
      {activeTab === 'visualization' && (
        <div className="bg-base-200 rounded-lg p-4 mb-4">
          <HousingVisualization 
            complexes={complexes} 
            onSelectComplex={handleSelectComplex} 
            onSelectBuilding={handleSelectBuilding}
          />
        </div>
      )}

      {/* Rooms Tab */}
      {activeTab === 'rooms' && selectedBuilding && (
        <div className="bg-base-200 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-right">الغرف</h2>
          {rooms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-right">رقم الغرفة</th>
                    <th className="text-right">النوع</th>
                    <th className="text-right">الحالة</th>
                    <th className="text-right">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td className="text-right">{room.room_number}</td>
                      <td className="text-right">{room.type}</td>
                      <td className="text-right">{
                        room.status === 'available' ? 'متاحة' :
                        room.status === 'occupied' ? 'مشغولة' : 'صيانة'
                      }</td>
                      <td>
                        <button className="btn btn-xs btn-primary">تفاصيل</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card p-4">
              <p className="text-center">لا توجد غرف في هذا المبنى</p>
            </div>
          )}
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && selectedComplex && (
        <div className="bg-base-200 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 text-right">المرافق</h2>
          {facilities.length > 0 ? (
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
                      <td className="text-right">{facility.name}</td>
                      <td className="text-right">{facility.type}</td>
                      <td className="text-right">{facility.location_description}</td>
                      <td>
                        <button className="btn btn-xs btn-primary">تفاصيل</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card p-4">
              <p className="text-center">لا توجد مرافق في هذا المجمع</p>
            </div>
          )}
        </div>
      )}

      {/* Add Complex Modal */}
      {showAddComplexModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-right">إضافة مجمع سكني جديد</h2>
            <form onSubmit={handleAddComplex} className="text-right">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">اسم المجمع</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newComplex.name}
                  onChange={e => setNewComplex({...newComplex, name: e.target.value})}
                  placeholder="ادخل اسم المجمع السكني"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">الموقع</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newComplex.location}
                  onChange={e => setNewComplex({...newComplex, location: e.target.value})}
                  placeholder="ادخل موقع المجمع"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">الوصف (اختياري)</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={newComplex.description}
                  onChange={e => setNewComplex({...newComplex, description: e.target.value})}
                  placeholder="وصف إضافي للمجمع"
                  rows={3}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddComplexModal(false)}
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