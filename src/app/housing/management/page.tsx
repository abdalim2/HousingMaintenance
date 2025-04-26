"use client";

import React, { useState, useEffect } from 'react';
import { 
  ResidentialComplex, 
  Building, 
  Floor, 
  Room, 
  Service 
} from '@/models/types';
import * as ComplexManager from '@/lib/services/complexManagementService';

export default function HousingManagementPage() {
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [selectedComplex, setSelectedComplex] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  
  const [isAddingComplex, setIsAddingComplex] = useState(false);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  
  const [newComplex, setNewComplex] = useState({ name: '', location: '', description: '' });
  const [newBuilding, setNewBuilding] = useState({ name: '', address: '', description: '' });
  const [newFloor, setNewFloor] = useState({ number: 1 });
  const [newRoom, setNewRoom] = useState({ 
    name: '', 
    room_number: '', 
    type: 'bedroom', 
    status: 'available' as const,
    area: 0,
    hasBalcony: false
  });
  const [newService, setNewService] = useState({ 
    name: '', 
    type: '', 
    location: '', 
    description: '' 
  });
  const [serviceTarget, setServiceTarget] = useState<'floor' | 'room'>('floor');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // استيراد بيانات المجمعات السكنية عند تحميل الصفحة
  useEffect(() => {
    const loadComplexes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // استيراد البيانات من API الخارجي
        await ComplexManager.importComplexesFromAPI();
        
        // الحصول على المجمعات المستوردة
        const complexesData = ComplexManager.getAllComplexes();
        setComplexes(complexesData);
        
        // اختيار أول مجمع إذا كان متوفراً
        if (complexesData.length > 0) {
          setSelectedComplex(complexesData[0].id);
        }
        
      } catch (err: any) {
        setError(`فشل في تحميل البيانات: ${err.message || 'خطأ غير معروف'}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadComplexes();
  }, []);
  
  // اختيار أول مبنى في المجمع المحدد
  useEffect(() => {
    if (selectedComplex) {
      const complex = complexes.find(c => c.id === selectedComplex);
      if (complex && complex.buildings.length > 0) {
        setSelectedBuilding(complex.buildings[0].id);
      } else {
        setSelectedBuilding(null);
      }
      
      // إعادة تعيين الطابق المحدد
      setSelectedFloor(null);
    }
  }, [selectedComplex, complexes]);
  
  // اختيار أول طابق في المبنى المحدد
  useEffect(() => {
    if (selectedComplex && selectedBuilding) {
      const complex = complexes.find(c => c.id === selectedComplex);
      if (complex) {
        const building = complex.buildings.find(b => b.id === selectedBuilding);
        if (building && building.floors.length > 0) {
          setSelectedFloor(building.floors[0].number);
        } else {
          setSelectedFloor(null);
        }
      }
      
      // إعادة تعيين الغرفة المحددة
      setSelectedRoom(null);
    }
  }, [selectedBuilding, selectedComplex, complexes]);
  
  // الحصول على المجمع السكني الحالي
  const getCurrentComplex = () => {
    return selectedComplex ? complexes.find(c => c.id === selectedComplex) : undefined;
  };
  
  // الحصول على المبنى الحالي
  const getCurrentBuilding = () => {
    const complex = getCurrentComplex();
    return complex && selectedBuilding ? complex.buildings.find(b => b.id === selectedBuilding) : undefined;
  };
  
  // الحصول على الطابق الحالي
  const getCurrentFloor = () => {
    const building = getCurrentBuilding();
    return building && selectedFloor !== null ? building.floors.find(f => f.number === selectedFloor) : undefined;
  };
  
  // معالجة إضافة مجمع سكني جديد
  const handleAddComplex = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComplex.name || !newComplex.location) {
      setError('يرجى إدخال اسم وموقع المجمع السكني');
      return;
    }
    
    try {
      const createdComplex = ComplexManager.createComplex(newComplex);
      setComplexes([...complexes, createdComplex]);
      setSelectedComplex(createdComplex.id);
      setNewComplex({ name: '', location: '', description: '' });
      setIsAddingComplex(false);
    } catch (err: any) {
      setError(`فشل في إضافة المجمع السكني: ${err.message || 'خطأ غير معروف'}`);
    }
  };
  
  // معالجة إضافة مبنى جديد
  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedComplex || !newBuilding.name) {
      setError('يرجى تحديد مجمع سكني وإدخال اسم المبنى');
      return;
    }
    
    try {
      const createdBuilding = ComplexManager.addBuildingToComplex(selectedComplex, newBuilding);
      
      if (createdBuilding) {
        // تحديث حالة المجمعات
        setComplexes(prevComplexes => 
          prevComplexes.map(complex => 
            complex.id === selectedComplex 
              ? { ...complex, buildings: [...complex.buildings, createdBuilding] }
              : complex
          )
        );
        
        setSelectedBuilding(createdBuilding.id);
        setNewBuilding({ name: '', address: '', description: '' });
        setIsAddingBuilding(false);
      } else {
        setError('فشل في إضافة المبنى، يرجى التحقق من البيانات');
      }
    } catch (err: any) {
      setError(`فشل في إضافة المبنى: ${err.message || 'خطأ غير معروف'}`);
    }
  };
  
  // معالجة إضافة طابق جديد
  const handleAddFloor = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedComplex || !selectedBuilding || newFloor.number <= 0) {
      setError('يرجى تحديد مجمع سكني ومبنى وإدخال رقم طابق صحيح');
      return;
    }
    
    try {
      const createdFloor = ComplexManager.addFloorToBuilding(selectedComplex, selectedBuilding, newFloor.number);
      
      if (createdFloor) {
        // تحديث حالة المجمعات
        setComplexes(prevComplexes => 
          prevComplexes.map(complex => 
            complex.id === selectedComplex 
              ? {
                  ...complex,
                  buildings: complex.buildings.map(building => 
                    building.id === selectedBuilding
                      ? { 
                          ...building, 
                          floors: [...building.floors, createdFloor].sort((a, b) => a.number - b.number),
                          floors_count: building.floors.length + 1
                        }
                      : building
                  )
                }
              : complex
          )
        );
        
        setSelectedFloor(createdFloor.number);
        setNewFloor({ number: Math.max(1, createdFloor.number + 1) });
        setIsAddingFloor(false);
      } else {
        setError('فشل في إضافة الطابق، يرجى التحقق من البيانات أو التأكد من عدم وجود طابق بنفس الرقم');
      }
    } catch (err: any) {
      setError(`فشل في إضافة الطابق: ${err.message || 'خطأ غير معروف'}`);
    }
  };
  
  // معالجة إضافة غرفة جديدة
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedComplex || !selectedBuilding || selectedFloor === null || !newRoom.name || !newRoom.room_number) {
      setError('يرجى تحديد مجمع سكني ومبنى وطابق وإدخال اسم ورقم الغرفة');
      return;
    }
    
    try {
      const createdRoom = ComplexManager.addRoomToFloor(
        selectedComplex, 
        selectedBuilding, 
        selectedFloor, 
        newRoom
      );
      
      if (createdRoom) {
        // تحديث حالة المجمعات
        setComplexes(prevComplexes => 
          prevComplexes.map(complex => 
            complex.id === selectedComplex 
              ? {
                  ...complex,
                  buildings: complex.buildings.map(building => 
                    building.id === selectedBuilding
                      ? { 
                          ...building, 
                          floors: building.floors.map(floor => 
                            floor.number === selectedFloor
                              ? { ...floor, rooms: [...floor.rooms, createdRoom] }
                              : floor
                          )
                        }
                      : building
                  )
                }
              : complex
          )
        );
        
        setNewRoom({ 
          name: '', 
          room_number: '', 
          type: 'bedroom', 
          status: 'available',
          area: 0,
          hasBalcony: false
        });
        setIsAddingRoom(false);
      } else {
        setError('فشل في إضافة الغرفة، يرجى التحقق من البيانات أو التأكد من عدم وجود غرفة بنفس الرقم');
      }
    } catch (err: any) {
      setError(`فشل في إضافة الغرفة: ${err.message || 'خطأ غير معروف'}`);
    }
  };
  
  // معالجة إضافة خدمة جديدة
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedComplex || !selectedBuilding || selectedFloor === null || !newService.name || !newService.type) {
      setError('يرجى تحديد مجمع سكني ومبنى وطابق وإدخال اسم ونوع الخدمة');
      return;
    }
    
    try {
      let createdService: Service | undefined;
      
      if (serviceTarget === 'floor') {
        createdService = ComplexManager.addServiceToFloor(
          selectedComplex, 
          selectedBuilding, 
          selectedFloor, 
          newService
        );
        
        if (createdService) {
          // تحديث حالة المجمعات - إضافة خدمة للطابق
          setComplexes(prevComplexes => 
            prevComplexes.map(complex => 
              complex.id === selectedComplex 
                ? {
                    ...complex,
                    buildings: complex.buildings.map(building => 
                      building.id === selectedBuilding
                        ? { 
                            ...building, 
                            floors: building.floors.map(floor => 
                              floor.number === selectedFloor
                                ? { ...floor, services: [...floor.services, createdService!] }
                                : floor
                            )
                          }
                        : building
                    )
                  }
                : complex
            )
          );
        }
      } else if (serviceTarget === 'room' && selectedRoom) {
        createdService = ComplexManager.addServiceToRoom(
          selectedComplex, 
          selectedBuilding, 
          selectedFloor, 
          selectedRoom,
          newService
        );
        
        if (createdService) {
          // تحديث حالة المجمعات - إضافة خدمة للغرفة
          setComplexes(prevComplexes => 
            prevComplexes.map(complex => 
              complex.id === selectedComplex 
                ? {
                    ...complex,
                    buildings: complex.buildings.map(building => 
                      building.id === selectedBuilding
                        ? { 
                            ...building, 
                            floors: building.floors.map(floor => 
                              floor.number === selectedFloor
                                ? { 
                                    ...floor, 
                                    rooms: floor.rooms.map(room =>
                                      room.room_number === selectedRoom
                                        ? { 
                                            ...room, 
                                            services: [...(room.services || []), createdService!] 
                                          }
                                        : room
                                    )
                                  }
                                : floor
                            )
                          }
                        : building
                    )
                  }
                : complex
            )
          );
        }
      } else {
        setError('يرجى تحديد الغرفة لإضافة الخدمة إليها');
        return;
      }
      
      if (createdService) {
        setNewService({ name: '', type: '', location: '', description: '' });
        setIsAddingService(false);
      } else {
        setError('فشل في إضافة الخدمة، يرجى التحقق من البيانات');
      }
    } catch (err: any) {
      setError(`فشل في إضافة الخدمة: ${err.message || 'خطأ غير معروف'}`);
    }
  };
  
  const handleDismissError = () => {
    setError(null);
  };
  
  // استعراض المجمع السكني والمباني والطوابق والغرف
  const renderComplexDetails = () => {
    const complex = getCurrentComplex();
    if (!complex) return null;
    
    const building = getCurrentBuilding();
    const floor = getCurrentFloor();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* عرض معلومات المجمع */}
        <div className="card bg-white p-4 shadow-md">
          <h3 className="text-xl font-bold mb-3 text-right">{complex.name}</h3>
          <div className="text-right">
            <p><span className="font-medium">الموقع:</span> {complex.location}</p>
            {complex.description && (
              <p><span className="font-medium">الوصف:</span> {complex.description}</p>
            )}
            <p><span className="font-medium">عدد المباني:</span> {complex.buildings.length}</p>
            
            <div className="mt-4">
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => setIsAddingBuilding(true)}
              >
                إضافة مبنى جديد
              </button>
            </div>
          </div>
        </div>
        
        {/* عرض معلومات المبنى */}
        {building && (
          <div className="card bg-white p-4 shadow-md">
            <h3 className="text-xl font-bold mb-3 text-right">{building.name}</h3>
            <div className="text-right">
              {building.address && (
                <p><span className="font-medium">العنوان:</span> {building.address}</p>
              )}
              {building.description && (
                <p><span className="font-medium">الوصف:</span> {building.description}</p>
              )}
              <p><span className="font-medium">عدد الطوابق:</span> {building.floors.length}</p>
              
              <div className="mt-4">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setIsAddingFloor(true)}
                >
                  إضافة طابق جديد
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* عرض معلومات الطابق */}
        {floor && (
          <div className="card bg-white p-4 shadow-md">
            <h3 className="text-xl font-bold mb-3 text-right">الطابق {floor.number}</h3>
            <div className="text-right">
              <p><span className="font-medium">عدد الغرف:</span> {floor.rooms.length}</p>
              <p><span className="font-medium">عدد الخدمات:</span> {floor.services.length}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setIsAddingRoom(true)}
                >
                  إضافة غرفة
                </button>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setServiceTarget('floor');
                    setIsAddingService(true);
                  }}
                >
                  إضافة خدمة للطابق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // عرض الغرف والخدمات
  const renderRoomsAndServices = () => {
    const floor = getCurrentFloor();
    if (!floor) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 text-right">تفاصيل الطابق {floor.number}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* قائمة الغرف */}
          <div className="card bg-white shadow-md p-4">
            <h4 className="text-lg font-semibold mb-3 text-right">الغرف</h4>
            
            {floor.rooms.length === 0 ? (
              <p className="text-gray-500 text-right">لا توجد غرف في هذا الطابق</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-right">الاسم</th>
                      <th className="text-right">الرقم</th>
                      <th className="text-right">النوع</th>
                      <th className="text-right">الحالة</th>
                      <th className="text-right">الخدمات</th>
                      <th className="text-right">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floor.rooms.map(room => (
                      <tr key={room.id}>
                        <td>{room.name}</td>
                        <td>{room.room_number}</td>
                        <td>{room.type}</td>
                        <td>{getRoomStatusLabel(room.status)}</td>
                        <td>{room.services?.length || 0}</td>
                        <td>
                          <button 
                            className="btn btn-xs btn-outline"
                            onClick={() => {
                              setSelectedRoom(room.room_number);
                              setServiceTarget('room');
                              setIsAddingService(true);
                            }}
                          >
                            إضافة خدمة
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* قائمة خدمات الطابق */}
          <div className="card bg-white shadow-md p-4">
            <h4 className="text-lg font-semibold mb-3 text-right">خدمات الطابق</h4>
            
            {floor.services.length === 0 ? (
              <p className="text-gray-500 text-right">لا توجد خدمات في هذا الطابق</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th className="text-right">الاسم</th>
                      <th className="text-right">النوع</th>
                      <th className="text-right">الموقع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floor.services.map(service => (
                      <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>{service.type}</td>
                        <td>{service.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // ترجمة حالة الغرفة
  const getRoomStatusLabel = (status: Room['status']) => {
    switch (status) {
      case 'available': return 'متاحة';
      case 'occupied': return 'مشغولة';
      case 'maintenance': return 'صيانة';
      default: return status;
    }
  };
  
  // عرض المجمعات والمباني والطوابق
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-right">إدارة المجمعات السكنية</h1>
      
      {/* عرض رسالة الخطأ */}
      {error && (
        <div className="alert alert-error mb-4 flex">
          <div>{error}</div>
          <button 
            className="ml-auto" 
            onClick={handleDismissError}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* عرض حالة التحميل */}
      {loading ? (
        <div className="text-center p-10">
          <div className="loading loading-spinner loading-lg"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      ) : (
        <>
          {/* أزرار التحكم الرئيسية */}
          <div className="flex justify-end mb-6">
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddingComplex(true)}
            >
              إضافة مجمع جديد
            </button>
          </div>
          
          {/* اختيار المجمع والمبنى والطابق */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 text-right">المجمع السكني:</label>
              <select 
                className="select select-bordered w-full"
                value={selectedComplex || ''}
                onChange={e => setSelectedComplex(e.target.value)}
                disabled={complexes.length === 0}
              >
                {complexes.length === 0 ? (
                  <option disabled value="">لا توجد مجمعات سكنية</option>
                ) : (
                  complexes.map(complex => (
                    <option key={complex.id} value={complex.id}>{complex.name}</option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 text-right">المبنى:</label>
              <select 
                className="select select-bordered w-full"
                value={selectedBuilding || ''}
                onChange={e => setSelectedBuilding(e.target.value)}
                disabled={!selectedComplex || getCurrentComplex()?.buildings.length === 0}
              >
                {!selectedComplex || getCurrentComplex()?.buildings.length === 0 ? (
                  <option disabled value="">لا توجد مباني</option>
                ) : (
                  getCurrentComplex()?.buildings.map(building => (
                    <option key={building.id} value={building.id}>{building.name}</option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 text-right">الطابق:</label>
              <select 
                className="select select-bordered w-full"
                value={selectedFloor !== null ? selectedFloor.toString() : ''}
                onChange={e => setSelectedFloor(parseInt(e.target.value))}
                disabled={!selectedBuilding || getCurrentBuilding()?.floors.length === 0}
              >
                {!selectedBuilding || getCurrentBuilding()?.floors.length === 0 ? (
                  <option disabled value="">لا توجد طوابق</option>
                ) : (
                  getCurrentBuilding()?.floors.map(floor => (
                    <option key={floor.id} value={floor.number.toString()}>الطابق {floor.number}</option>
                  ))
                )}
              </select>
            </div>
          </div>
          
          {/* عرض تفاصيل المجمع والمباني والطوابق */}
          {renderComplexDetails()}
          
          {/* عرض الغرف والخدمات */}
          {renderRoomsAndServices()}
        </>
      )}
      
      {/* نافذة إضافة مجمع سكني */}
      {isAddingComplex && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4 text-right">إضافة مجمع سكني جديد</h3>
            
            <form onSubmit={handleAddComplex}>
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  اسم المجمع <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newComplex.name}
                  onChange={e => setNewComplex({ ...newComplex, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newComplex.location}
                  onChange={e => setNewComplex({ ...newComplex, location: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  الوصف
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full"
                  value={newComplex.description}
                  onChange={e => setNewComplex({ ...newComplex, description: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button"
                  className="btn"
                  onClick={() => setIsAddingComplex(false)}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* نافذة إضافة مبنى */}
      {isAddingBuilding && selectedComplex && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4 text-right">إضافة مبنى جديد</h3>
            
            <form onSubmit={handleAddBuilding}>
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  اسم المبنى <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newBuilding.name}
                  onChange={e => setNewBuilding({ ...newBuilding, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  العنوان
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newBuilding.address}
                  onChange={e => setNewBuilding({ ...newBuilding, address: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  الوصف
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full"
                  value={newBuilding.description}
                  onChange={e => setNewBuilding({ ...newBuilding, description: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button"
                  className="btn"
                  onClick={() => setIsAddingBuilding(false)}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* نافذة إضافة طابق */}
      {isAddingFloor && selectedComplex && selectedBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4 text-right">إضافة طابق جديد</h3>
            
            <form onSubmit={handleAddFloor}>
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  رقم الطابق <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  min="1"
                  className="input input-bordered w-full"
                  value={newFloor.number}
                  onChange={e => setNewFloor({ number: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button"
                  className="btn"
                  onClick={() => setIsAddingFloor(false)}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* نافذة إضافة غرفة */}
      {isAddingRoom && selectedComplex && selectedBuilding && selectedFloor !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4 text-right">إضافة غرفة جديدة</h3>
            
            <form onSubmit={handleAddRoom}>
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  اسم الغرفة <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newRoom.name}
                  onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  رقم الغرفة <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newRoom.room_number}
                  onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  نوع الغرفة <span className="text-red-500">*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newRoom.type}
                  onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                  required
                >
                  <option value="bedroom">غرفة نوم</option>
                  <option value="bathroom">حمام</option>
                  <option value="kitchen">مطبخ</option>
                  <option value="living">غرفة معيشة</option>
                  <option value="storage">مخزن</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  حالة الغرفة <span className="text-red-500">*</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={newRoom.status}
                  onChange={e => setNewRoom({ ...newRoom, status: e.target.value as any })}
                  required
                >
                  <option value="available">متاحة</option>
                  <option value="occupied">مشغولة</option>
                  <option value="maintenance">صيانة</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  المساحة (م²)
                </label>
                <input 
                  type="number"
                  min="0"
                  step="0.01"
                  className="input input-bordered w-full"
                  value={newRoom.area || ''}
                  onChange={e => setNewRoom({ ...newRoom, area: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div className="mb-4 flex items-center gap-2">
                <input 
                  type="checkbox"
                  className="checkbox"
                  checked={newRoom.hasBalcony || false}
                  onChange={e => setNewRoom({ ...newRoom, hasBalcony: e.target.checked })}
                />
                <label className="text-right">تحتوي على شرفة</label>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button"
                  className="btn"
                  onClick={() => setIsAddingRoom(false)}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* نافذة إضافة خدمة */}
      {isAddingService && selectedComplex && selectedBuilding && selectedFloor !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4 text-right">
              {serviceTarget === 'floor' ? 'إضافة خدمة للطابق' : 'إضافة خدمة للغرفة'}
            </h3>
            
            <form onSubmit={handleAddService}>
              {serviceTarget === 'room' && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-right mb-2">
                    الغرفة <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedRoom || ''}
                    onChange={e => setSelectedRoom(e.target.value)}
                    required
                  >
                    {getCurrentFloor()?.rooms.map(room => (
                      <option key={room.id} value={room.room_number}>
                        {room.name} ({room.room_number})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  اسم الخدمة <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newService.name}
                  onChange={e => setNewService({ ...newService, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  نوع الخدمة <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newService.type}
                  onChange={e => setNewService({ ...newService, type: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  الموقع <span className="text-red-500">*</span>
                </label>
                <input 
                  className="input input-bordered w-full"
                  value={newService.location}
                  onChange={e => setNewService({ ...newService, location: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-right mb-2">
                  الوصف
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full"
                  value={newService.description}
                  onChange={e => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button"
                  className="btn"
                  onClick={() => setIsAddingService(false)}
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}