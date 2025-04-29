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
import HousingVisualization from '@/components/HousingVisualization';

export default function HousingManagementPage() {
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [selectedComplex, setSelectedComplex] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isAddingComplex, setIsAddingComplex] = useState(false);
  const [isAddingBuilding, setIsAddingBuilding] = useState(false);
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newComplex, setNewComplex] = useState({ name: '', location: '', description: '' });
  const [newBuilding, setNewBuilding] = useState({ name: '', address: '', description: '' });
  const [newFloor, setNewFloor] = useState({ number: 1 });
  const [newRoom, setNewRoom] = useState<{
    name: string;
    room_number: string;
    type: string;
    status: 'available' | 'occupied' | 'maintenance';
    area: number;
    hasBalcony: boolean;
  }>({ 
    name: '', 
    room_number: '', 
    type: 'bedroom', 
    status: 'available', 
    area: 0, 
    hasBalcony: false 
  });
  const [newService, setNewService] = useState({ name: '', type: '', location: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [serviceTarget, setServiceTarget] = useState<'floor' | 'room'>('floor');
  const [viewMode, setViewMode] = useState<'list' | 'visual'>('visual');

  useEffect(() => {
    const loadComplexes = async () => {
      try {
        const loadedComplexes = await ComplexManager.getAllComplexes();
        setComplexes(loadedComplexes);
        if (loadedComplexes.length > 0) {
          setSelectedComplex(loadedComplexes[0].id);
        }
      } catch (error) {
        setError('فشل في تحميل المجمعات السكنية. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
        console.error('Error loading complexes:', error);
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
  const handleAddComplex = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplex.name || !newComplex.location) {
      setError('يرجى إدخال اسم وموقع المجمع السكني');
      return;
    }

    try {
      const createdComplex = await ComplexManager.createComplex(newComplex);
      setComplexes([...complexes, createdComplex]);
      setSelectedComplex(createdComplex.id);
      setNewComplex({ name: '', location: '', description: '' });
      setIsAddingComplex(false);
    } catch (err: any) {
      setError(`فشل في إضافة المجمع السكني: ${err.message || 'خطأ غير معروف'}`);
    }
  };

  // معالجة إضافة مبنى جديد
  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplex || !newBuilding.name) {
      setError('يرجى تحديد مجمع سكني وإدخال اسم المبنى');
      return;
    }
    try {
      const createdBuilding = await ComplexManager.addBuildingToComplex(selectedComplex, newBuilding);
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
  const handleAddFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplex || !selectedBuilding || newFloor.number <= 0) {
      setError('يرجى تحديد مجمع سكني ومبنى وإدخال رقم طابق صحيح');
      return;
    }
    try {
      const createdFloor = await ComplexManager.addFloorToBuilding(selectedComplex, selectedBuilding, newFloor.number);
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
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplex || !selectedBuilding || selectedFloor === null || !newRoom.name || !newRoom.room_number) {
      setError('يرجى تحديد مجمع سكني ومبنى وطابق وإدخال اسم ورقم الغرفة');
      return;
    }
    try {
      const createdRoom = await ComplexManager.addRoomToFloor(
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
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplex || !selectedBuilding || selectedFloor === null || !newService.name || !newService.type) {
      setError('يرجى تحديد مجمع سكني ومبنى وطابق وإدخال اسم ونوع الخدمة');
      return;
    }
    try {
      let createdService;
      if (serviceTarget === 'floor') {
        createdService = await ComplexManager.addServiceToFloor(
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
        createdService = await ComplexManager.addServiceToRoom(
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

  // ترجمة حالة الغرفة
  const getRoomStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'متاحة';
      case 'occupied': return 'مشغولة';
      case 'maintenance': return 'صيانة';
      default: return status;
    }
  };

  // عرض المجمعات والمباني والطوابق
  const renderManagementInterface = () => {
    return (
      <div className="mt-4">
        <div className="flex space-x-4 justify-end mb-4">
          <button
            className={`btn btn-sm ${viewMode === 'visual' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('visual')}
          >
            عرض بصري
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('list')}
          >
            قائمة تفصيلية
          </button>
        </div>
        
        {viewMode === 'visual' ? (
          <div className="bg-base-100 p-4 rounded-lg shadow">
            <HousingVisualization 
              complexes={complexes}
              onSelectComplex={setSelectedComplex}
              onSelectBuilding={setSelectedBuilding}
              onSelectFloor={setSelectedFloor}
              onSelectRoom={setSelectedRoom}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* المجمعات السكنية */}
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsAddingComplex(true)}
                  >
                    إضافة مجمع جديد
                  </button>
                  <h2 className="card-title text-right">المجمعات السكنية</h2>
                </div>
                <div className="overflow-x-auto">
                  <select
                    className="select select-bordered w-full"
                    value={selectedComplex || ''}
                    onChange={(e) => setSelectedComplex(e.target.value)}
                  >
                    <option value="" disabled>اختر مجمع سكني</option>
                    {complexes.map(complex => (
                      <option key={complex.id} value={complex.id}>{complex.name} - {complex.location}</option>
                    ))}
                  </select>
                </div>
                {isAddingComplex && (
                  <div className="card bg-base-200 mt-4">
                    <div className="card-body">
                      <h3 className="card-title text-right">إضافة مجمع سكني جديد</h3>
                      <form onSubmit={handleAddComplex} className="text-right">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">اسم المجمع</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newComplex.name}
                            onChange={(e) => setNewComplex({ ...newComplex, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">الموقع</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newComplex.location}
                            onChange={(e) => setNewComplex({ ...newComplex, location: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">الوصف (اختياري)</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered"
                            value={newComplex.description}
                            onChange={(e) => setNewComplex({ ...newComplex, description: e.target.value })}
                          ></textarea>
                        </div>
                        <div className="form-control mt-4 flex flex-row justify-between">
                          <button
                            type="button"
                            className="btn"
                            onClick={() => setIsAddingComplex(false)}
                          >
                            إلغاء
                          </button>
                          <button type="submit" className="btn btn-primary">
                            إضافة
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* المباني */}
            {selectedComplex && (
              <div className="card shadow-lg">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setIsAddingBuilding(true)}
                    >
                      إضافة مبنى جديد
                    </button>
                    <h2 className="card-title text-right">المباني</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <select
                      className="select select-bordered w-full"
                      value={selectedBuilding || ''}
                      onChange={(e) => setSelectedBuilding(e.target.value)}
                      disabled={!selectedComplex || getCurrentComplex()?.buildings.length === 0}
                    >
                      {!selectedComplex || !getCurrentComplex()?.buildings?.length ? (
                        <option key="no-buildings" disabled value="">لا توجد مباني</option>
                      ) : (
                        getCurrentComplex()?.buildings.map(building => (
                          <option key={building.id} value={building.id}>{building.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  {isAddingBuilding && (
                    <div className="card bg-base-200 mt-4">
                      <div className="card-body">
                        <h3 className="card-title text-right">إضافة مبنى جديد</h3>
                        <form onSubmit={handleAddBuilding} className="text-right">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-right">اسم المبنى</span>
                            </label>
                            <input
                              type="text"
                              className="input input-bordered"
                              value={newBuilding.name}
                              onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-right">العنوان (اختياري)</span>
                            </label>
                            <input
                              type="text"
                              className="input input-bordered"
                              value={newBuilding.address}
                              onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })}
                            />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-right">الوصف (اختياري)</span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered"
                              value={newBuilding.description}
                              onChange={(e) => setNewBuilding({ ...newBuilding, description: e.target.value })}
                            ></textarea>
                          </div>
                          <div className="form-control mt-4 flex flex-row justify-between">
                            <button
                              type="button"
                              className="btn"
                              onClick={() => setIsAddingBuilding(false)}
                            >
                              إلغاء
                            </button>
                            <button type="submit" className="btn btn-primary">
                              إضافة
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* الطوابق */}
            {selectedBuilding && (
              <div className="card shadow-lg">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setIsAddingFloor(true)}
                    >
                      إضافة طابق جديد
                    </button>
                    <h2 className="card-title text-right">الطوابق</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <select
                      className="select select-bordered w-full"
                      value={selectedFloor !== null ? selectedFloor.toString() : ''}
                      onChange={e => setSelectedFloor(parseInt(e.target.value))}
                      disabled={!selectedBuilding || getCurrentBuilding()?.floors.length === 0}
                    >
                      {!selectedBuilding || !getCurrentBuilding()?.floors?.length ? (
                        <option key="no-floors" disabled value="">لا توجد طوابق</option>
                      ) : (
                        getCurrentBuilding()?.floors.map(floor => (
                          <option key={`${selectedBuilding}-floor-${floor.number}`} value={floor.number.toString()}>
                            الطابق {floor.number}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {isAddingFloor && (
                    <div className="card bg-base-200 mt-4">
                      <div className="card-body">
                        <h3 className="card-title text-right">إضافة طابق جديد</h3>
                        <form onSubmit={handleAddFloor} className="text-right">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-right">رقم الطابق</span>
                            </label>
                            <input
                              type="number"
                              className="input input-bordered"
                              value={newFloor.number}
                              onChange={(e) => setNewFloor({ ...newFloor, number: parseInt(e.target.value) })}
                              min="1"
                              required
                            />
                          </div>
                          <div className="form-control mt-4 flex flex-row justify-between">
                            <button
                              type="button"
                              className="btn"
                              onClick={() => setIsAddingFloor(false)}
                            >
                              إلغاء
                            </button>
                            <button type="submit" className="btn btn-primary">
                              إضافة
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* الغرف */}
            {selectedFloor !== null && getCurrentFloor() && (
              <div className="card shadow-lg">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
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
                    <h2 className="card-title text-right">الغرف في الطابق {selectedFloor}</h2>
                  </div>

                  {getCurrentFloor()?.rooms.length === 0 ? (
                    <div className="alert">
                      <span>لا توجد غرف في هذا الطابق</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-compact w-full">
                        <thead>
                          <tr>
                            <th className="text-right">الاسم</th>
                            <th className="text-right">رقم الغرفة</th>
                            <th className="text-right">النوع</th>
                            <th className="text-right">الحالة</th>
                            <th className="text-right">المساحة</th>
                            <th className="text-right">له شرفة</th>
                            <th className="text-right">الخدمات</th>
                            <th className="text-right">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getCurrentFloor()?.rooms.map((room, index) => (
                            <tr key={`${selectedBuilding}-${selectedFloor}-room-${room.room_number}-${index}`}>
                              <td className="text-right">{room.name}</td>
                              <td className="text-right">{room.room_number}</td>
                              <td className="text-right">{room.type}</td>
                              <td className="text-right">{getRoomStatusLabel(room.status)}</td>
                              <td className="text-right">{room.area ? `${room.area} م²` : '-'}</td>
                              <td className="text-right">{room.hasBalcony ? 'نعم' : 'لا'}</td>
                              <td className="text-right">{room.services?.length || 0} خدمة</td>
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

                  {/* Shared Services in the floor */}
                  {(() => {
                    const currentFloor = getCurrentFloor();
                    return currentFloor && Array.isArray(currentFloor.services) && currentFloor.services.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xl font-bold text-right">الخدمات المشتركة في الطابق</h3>
                        <div className="overflow-x-auto mt-2">
                          <table className="table table-compact w-full">
                            <thead>
                              <tr>
                                <th className="text-right">الاسم</th>
                                <th className="text-right">النوع</th>
                                <th className="text-right">الموقع</th>
                                <th className="text-right">الوصف</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentFloor.services.map(service => (
                                <tr key={service.id} className="hover">
                                  <td className="text-right">{service.name}</td>
                                  <td className="text-right">{service.type}</td>
                                  <td className="text-right">{service.location}</td>
                                  <td className="text-right">{service.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Add Room Form */}
            {isAddingRoom && (
              <div className="card bg-base-200 mt-4">
                <div className="card-body">
                  <h3 className="card-title text-right">إضافة غرفة جديدة</h3>
                  <form onSubmit={handleAddRoom} className="text-right">
                    <div className="flex flex-wrap -mx-2">
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">اسم الغرفة</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">رقم الغرفة</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newRoom.room_number}
                            onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">نوع الغرفة</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={newRoom.type}
                            onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                          >
                            <option value="bedroom">غرفة نوم</option>
                            <option value="bathroom">حمام</option>
                            <option value="kitchen">مطبخ</option>
                            <option value="living">صالة معيشة</option>
                            <option value="office">مكتب</option>
                            <option value="other">أخرى</option>
                          </select>
                        </div>
                      </div>
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">حالة الغرفة</span>
                          </label>
                          <select
                            className="select select-bordered"
                            value={newRoom.status}
                            onChange={(e) => setNewRoom({
                              ...newRoom,
                              status: e.target.value as 'available' | 'occupied' | 'maintenance'
                            })}
                          >
                            <option value="available">متاحة</option>
                            <option value="occupied">مشغولة</option>
                            <option value="maintenance">صيانة</option>
                          </select>
                        </div>
                      </div>
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">المساحة (م²)</span>
                          </label>
                          <input
                            type="number"
                            className="input input-bordered"
                            value={newRoom.area === 0 ? '' : newRoom.area}
                            onChange={(e) => setNewRoom({ ...newRoom, area: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control mt-4">
                          <label className="cursor-pointer label justify-end">
                            <input
                              type="checkbox"
                              className="toggle toggle-primary ml-4"
                              checked={newRoom.hasBalcony}
                              onChange={(e) => setNewRoom({ ...newRoom, hasBalcony: e.target.checked })}
                            />
                            <span className="label-text text-right">تحتوي على شرفة</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-control mt-4 flex flex-row justify-between">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setIsAddingRoom(false)}
                      >
                        إلغاء
                      </button>
                      <button type="submit" className="btn btn-primary">
                        إضافة
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Service Form */}
            {isAddingService && (
              <div className="card bg-base-200 mt-4">
                <div className="card-body">
                  <h3 className="card-title text-right">
                    إضافة خدمة جديدة {serviceTarget === 'floor' ? 'للطابق' : `للغرفة ${selectedRoom}`}
                  </h3>
                  <form onSubmit={handleAddService} className="text-right">
                    <div className="flex flex-wrap -mx-2">
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">اسم الخدمة</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="px-2 w-full md:w-1/2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">نوع الخدمة</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newService.type}
                            onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="px-2 w-full">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">الموقع</span>
                          </label>
                          <input
                            type="text"
                            className="input input-bordered"
                            value={newService.location}
                            onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="px-2 w-full">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-right">وصف الخدمة (اختياري)</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="form-control mt-4 flex flex-row justify-between">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setIsAddingService(false)}
                      >
                        إلغاء
                      </button>
                      <button type="submit" className="btn btn-primary">
                        إضافة
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-right mb-6">إدارة هيكل السكن</h1>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm" onClick={handleDismissError}>إغلاق</button>
        </div>
      )}
      
      {renderManagementInterface()}
    </div>
  );
}
