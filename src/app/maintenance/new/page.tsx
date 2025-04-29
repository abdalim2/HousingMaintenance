"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getComplexes, getBuildings, getRooms, getFacilities } from '@/lib/services/housingService';
import { getItems } from '@/lib/services/inventoryService';
import { createMaintenanceRequest, createMaintenanceItem } from '@/lib/services/maintenanceService';
import { ResidentialComplex, Building, Room, Facility, Item, MaintenanceItem } from '@/models/types';

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  
  // Form data state
  const [formData, setFormData] = useState({
    complex_id: '',
    building_id: '',
    room_id: '',
    facility_id: '',
    reported_by: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
    description: ''
  });
  
  // Select options state
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  // Items needed for maintenance
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    id: string;
    item_id: string;
    quantity: number;
    notes: string;
  }[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch complexes and items separately to better handle potential errors
        let complexesData: ResidentialComplex[] = [];
        let itemsData: Item[] = [];
        
        try {
          complexesData = await getComplexes();
        } catch (complexError) {
          console.error('Error fetching complexes:', complexError);
        }
        
        try {
          itemsData = await getItems();
        } catch (itemsError) {
          console.error('Error fetching items:', itemsError);
        }
        
        setComplexes(complexesData);
        setAllItems(itemsData);
      } catch (err) {
        console.error('Error in fetchInitialData:', err);
        setError('حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch buildings when complex is selected
  useEffect(() => {
    if (formData.complex_id) {
      const fetchBuildings = async () => {
        try {
          const buildingsData = await getBuildings(formData.complex_id);
          setBuildings(buildingsData);
          // Reset dependent fields
          setFormData(prev => ({ 
            ...prev, 
            building_id: '', 
            room_id: '', 
            facility_id: '' 
          }));
          setRooms([]);
          setFacilities([]);
        } catch (err) {
          console.error('Error fetching buildings:', err);
        }
      };

      fetchBuildings();
    }
  }, [formData.complex_id]);

  // Fetch rooms and facilities when building is selected
  useEffect(() => {
    if (formData.building_id) {
      const fetchRoomsAndFacilities = async () => {
        try {
          const [roomsData, facilitiesData] = await Promise.all([
            getRooms(formData.building_id),
            getFacilities(formData.complex_id, formData.building_id)
          ]);
          
          setRooms(roomsData);
          setFacilities(facilitiesData);
          
          // Reset dependent fields
          setFormData(prev => ({ ...prev, room_id: '', facility_id: '' }));
        } catch (err) {
          console.error('Error fetching rooms and facilities:', err);
        }
      };

      fetchRoomsAndFacilities();
    }
  }, [formData.building_id, formData.complex_id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding a new item
  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(), // temporary id for UI management
      item_id: '',
      quantity: 1,
      notes: ''
    };
    
    setSelectedItems(prev => [...prev, newItem]);
  };

  // Handle item changes
  const handleItemChange = (id: string, field: string, value: string | number) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Handle removing an item
  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Validate form
      if (!formData.complex_id || !formData.building_id || !formData.reported_by || !formData.description) {
        throw new Error('الرجاء تعبئة جميع الحقول المطلوبة');
      }

      // Create maintenance request
      const maintenanceRequest = await createMaintenanceRequest({
        complex_id: formData.complex_id,
        building_id: formData.building_id,
        room_id: formData.room_id || undefined,
        facility_id: formData.facility_id || undefined,
        reported_by: formData.reported_by,
        priority: formData.priority,
        description: formData.description,
        status: 'pending'
      });

      // Create maintenance items
      const itemPromises = selectedItems.map(item => {
        if (!item.item_id || item.quantity < 1) return null;
        
        return createMaintenanceItem({
          maintenance_id: maintenanceRequest.id,
          item_id: item.item_id,
          quantity_needed: item.quantity,
          notes: item.notes
        });
      });

      // Filter out null promises and wait for all promises to resolve
      await Promise.all(itemPromises.filter(Boolean) as Promise<MaintenanceItem>[]);

      setMessage('تم تقديم طلب الصيانة بنجاح');
      
      // Redirect to maintenance list after 2 seconds
      setTimeout(() => {
        router.push('/maintenance');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error submitting maintenance request:', err);
      setError(err.message || 'حدث خطأ أثناء تقديم طلب الصيانة. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">طلب صيانة جديد</h1>
        <button 
          type="button"
          onClick={() => router.back()}
          className="btn bg-gray-500 hover:bg-gray-600"
        >
          عودة
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-green-100 border-r-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">المجمع السكني <span className="text-red-500">*</span></label>
            <select 
              name="complex_id" 
              value={formData.complex_id} 
              onChange={handleChange}
              className="select w-full"
              required
            >
              <option value="">اختر المجمع</option>
              {complexes.map(complex => (
                <option key={complex.id} value={complex.id}>
                  {complex.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">المبنى <span className="text-red-500">*</span></label>
            <select 
              name="building_id" 
              value={formData.building_id} 
              onChange={handleChange}
              className="select w-full"
              disabled={!formData.complex_id}
              required
            >
              <option value="">اختر المبنى</option>
              {buildings.map(building => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">الغرفة</label>
            <select 
              name="room_id" 
              value={formData.room_id} 
              onChange={handleChange}
              className="select w-full"
              disabled={!formData.building_id}
            >
              <option value="">اختر الغرفة</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  الطابق {room.floor} - غرفة {room.room_number} ({room.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">المرافق</label>
            <select 
              name="facility_id" 
              value={formData.facility_id} 
              onChange={handleChange}
              className="select w-full"
              disabled={!formData.building_id}
            >
              <option value="">اختر المرافق</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>
                  {facility.name} ({facility.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">مقدم الطلب <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="reported_by" 
              value={formData.reported_by} 
              onChange={handleChange}
              className="input w-full"
              placeholder="اسم مقدم الطلب"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">الأولوية <span className="text-red-500">*</span></label>
            <select 
              name="priority" 
              value={formData.priority} 
              onChange={handleChange}
              className="select w-full"
              required
            >
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">عالية</option>
              <option value="emergency">طارئة</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">وصف المشكلة <span className="text-red-500">*</span></label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            className="input w-full h-32"
            placeholder="اكتب وصفاً تفصيلياً للمشكلة..."
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">الأصناف المطلوبة</h3>
            <button 
              type="button"
              onClick={handleAddItem}
              className="btn bg-secondary hover:bg-secondary/90"
            >
              إضافة صنف
            </button>
          </div>

          {selectedItems.length === 0 ? (
            <p className="text-gray-500 italic">لم يتم إضافة أي أصناف بعد.</p>
          ) : (
            <div className="space-y-4">
              {selectedItems.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-md border flex flex-wrap items-end gap-4">
                  <div className="flex-grow min-w-[250px]">
                    <label className="block mb-2 text-sm font-medium">الصنف <span className="text-red-500">*</span></label>
                    <select
                      value={item.item_id}
                      onChange={(e) => handleItemChange(item.id, 'item_id', e.target.value)}
                      className="select w-full"
                      required
                    >
                      <option value="">اختر الصنف</option>
                      {allItems.map(itemOption => (
                        <option key={itemOption.id} value={itemOption.id}>
                          {itemOption.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-24">
                    <label className="block mb-2 text-sm font-medium">الكمية <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
                      className="input w-full"
                      required
                    />
                  </div>
                  
                  <div className="flex-grow min-w-[250px]">
                    <label className="block mb-2 text-sm font-medium">ملاحظات</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                      className="input w-full"
                      placeholder="أي ملاحظات خاصة بالصنف..."
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn bg-gray-500 hover:bg-gray-600"
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحفظ...' : 'تقديم طلب الصيانة'}
          </button>
        </div>
      </form>
    </div>
  );
}