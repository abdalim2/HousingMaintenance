"use client";

import React, { useState } from 'react';
import { ResidentialComplex, Building, Floor, Room, Service } from '@/models/types';

interface HousingVisualizationProps {
  complexes: ResidentialComplex[];
  onSelectComplex?: (complexId: string) => void;
  onSelectBuilding?: (buildingId: string) => void;
  onSelectFloor?: (floorNumber: number) => void;
  onSelectRoom?: (roomNumber: string) => void;
}

export default function HousingVisualization({
  complexes,
  onSelectComplex,
  onSelectBuilding,
  onSelectFloor,
  onSelectRoom
}: HousingVisualizationProps) {
  const [selectedComplex, setSelectedComplex] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'card' | 'tree' | '3d'>('card');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Get current selected complex object
  const currentComplex = complexes.find(c => c.id === selectedComplex);
  
  // Get current selected building object
  const currentBuilding = currentComplex && currentComplex.buildings ? 
    currentComplex.buildings.find(b => b.id === selectedBuilding) : undefined;
  
  // Get current selected floor object
  const currentFloor = currentBuilding && currentBuilding.floors ? 
    currentBuilding.floors.find(f => f.number === selectedFloor) : undefined;

  const handleComplexSelect = (complexId: string) => {
    setSelectedComplex(complexId);
    setSelectedBuilding(null);
    setSelectedFloor(null);
    if (onSelectComplex) onSelectComplex(complexId);
  };

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setSelectedFloor(null);
    if (onSelectBuilding) onSelectBuilding(buildingId);
  };

  const handleFloorSelect = (floorNumber: number) => {
    setSelectedFloor(floorNumber);
    if (onSelectFloor) onSelectFloor(floorNumber);
  };

  const handleRoomSelect = (roomNumber: string) => {
    if (onSelectRoom) onSelectRoom(roomNumber);
  };

  // Color generator for consistent but different colors
  const getColor = (index: number, type: 'complex' | 'building' | 'floor' | 'room') => {
    const baseColors = {
      complex: 'bg-primary',
      building: 'bg-secondary',
      floor: 'bg-accent',
      room: 'bg-neutral'
    };
    
    const colorVariants = [
      'bg-primary',
      'bg-secondary',
      'bg-accent',
      'bg-neutral',
      'bg-info',
      'bg-success',
      'bg-warning',
      'bg-error'
    ];
    
    // For complexes, use rotating colors
    if (type === 'complex') return colorVariants[index % colorVariants.length];
    
    // Otherwise use the base color for the type
    return baseColors[type];
  };

  // Room status to styling mapping
  const getRoomStatusClass = (status: string) => {
    switch(status) {
      case 'available': return 'border-success bg-success bg-opacity-10';
      case 'occupied': return 'border-warning bg-warning bg-opacity-10';
      case 'maintenance': return 'border-error bg-error bg-opacity-10';
      default: return 'border-neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available': return 'متاح';
      case 'occupied': return 'مشغول';
      case 'maintenance': return 'قيد الصيانة';
      default: return status;
    }
  };

  // Card View
  const renderCardView = () => (
    <div className="p-4">
      {/* Complexes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complexes.map((complex, index) => (
          <div 
            key={complex.id}
            className={`card shadow-lg cursor-pointer transition-all transform hover:scale-105 border-2 ${selectedComplex === complex.id ? 'border-primary' : 'border-transparent'}`}
            onClick={() => handleComplexSelect(complex.id)}
          >
            <div className={`card-body ${getColor(index, 'complex')} text-white`}>
              <h2 className="card-title text-xl text-right flex justify-between">
                {complex.name}
                <span className="badge badge-neutral">{complex.buildings && complex.buildings.length || 0} مبنى</span>
              </h2>
              <p className="text-right">{complex.location}</p>
              {complex.description && <p className="text-right text-sm opacity-80">{complex.description}</p>}
            </div>
            
            {/* Show Buildings when complex is selected */}
            {selectedComplex === complex.id && complex.buildings && Array.isArray(complex.buildings) && (
              <div className="p-4 bg-base-200">
                <h3 className="text-right mb-3 font-bold text-lg">المباني</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complex.buildings.map((building, buildingIndex) => (
                    <div 
                      key={building.id} 
                      className={`card shadow bg-base-100 cursor-pointer hover:bg-base-200 ${selectedBuilding === building.id ? 'border-2 border-secondary' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuildingSelect(building.id);
                      }}
                    >
                      <div className="card-body p-4">
                        <h4 className="text-right font-bold">{building.name}</h4>
                        <p className="text-right text-sm">{building.floors_count || (building.floors && building.floors.length) || 0} طابق</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Building Details Section - Show when a building is selected */}
      {currentBuilding && (
        <div className="mt-8 card shadow-lg border-2 border-secondary">
          <div className="card-body bg-secondary text-white">
            <h2 className="card-title text-xl text-right">
              {currentBuilding.name} - {currentComplex?.name}
              <span className="badge badge-neutral">{currentBuilding.floors && currentBuilding.floors.length || 0} طابق</span>
            </h2>
            {currentBuilding.description && (
              <p className="text-right">{currentBuilding.description}</p>
            )}
          </div>
          
          {/* Floors Section */}
          <div className="p-4">
            <h3 className="text-right mb-3 font-bold text-lg">الطوابق</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentBuilding.floors && currentBuilding.floors
                .sort((a, b) => b.number - a.number) // Sort floors in descending order
                .map((floor) => (
                <div 
                  key={floor.id} 
                  className={`card shadow cursor-pointer bg-base-100 hover:bg-base-200 ${selectedFloor === floor.number ? 'border-2 border-accent' : ''}`}
                  onClick={() => handleFloorSelect(floor.number)}
                >
                  <div className="card-body p-4">
                    <h4 className="text-right font-bold">الطابق {floor.number}</h4>
                    <div className="flex justify-between">
                      <span className="badge badge-primary">{floor.rooms && floor.rooms.length || 0} غرفة</span>
                      <span className="badge badge-secondary">{floor.services && floor.services.length || 0} خدمة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floor Details Section - Show when a floor is selected */}
      {currentFloor && (
        <div className="mt-8 card shadow-lg border-2 border-accent">
          <div className="card-body bg-accent text-white">
            <h2 className="card-title text-xl text-right">
              الطابق {currentFloor.number} - {currentBuilding?.name}
            </h2>
            <div className="flex justify-end gap-2">
              <span className="badge badge-neutral">{currentFloor.rooms && currentFloor.rooms.length || 0} غرفة</span>
              <span className="badge badge-neutral">{currentFloor.services && currentFloor.services.length || 0} خدمة</span>
            </div>
          </div>
          
          {/* Rooms Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-success mr-2"></span>
                  <span className="text-xs">متاح</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-warning mr-2"></span>
                  <span className="text-xs">مشغول</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-error mr-2"></span>
                  <span className="text-xs">صيانة</span>
                </div>
              </div>
              <h3 className="text-right font-bold text-lg">الغرف</h3>
            </div>
            {currentFloor.rooms && currentFloor.rooms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {currentFloor.rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className={`relative card shadow cursor-pointer hover:shadow-lg border-2 ${getRoomStatusClass(room.status)}`}
                    onClick={() => handleRoomSelect(room.room_number)}
                  >
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs badge ${
                        room.status === 'available' ? 'badge-success' : 
                        room.status === 'occupied' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {getStatusLabel(room.status)}
                      </span>
                    </div>
                    <div className="card-body p-3">
                      <h4 className="text-right font-bold">{room.name}</h4>
                      <p className="text-right text-sm">رقم الغرفة: {room.room_number}</p>
                      <p className="text-right text-xs opacity-70">{room.type}</p>
                      {room.services && room.services.length > 0 && (
                        <div className="text-right mt-2">
                          <span className="badge badge-sm">{room.services.length} خدمة</span>
                        </div>
                      )}
                      {room.area && (
                        <p className="text-right text-xs mt-1">{room.area} م²</p>
                      )}
                      {room.hasBalcony && (
                        <div className="text-right mt-1">
                          <span className="badge badge-outline badge-xs">شرفة</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                <p className="text-center">لا توجد غرف في هذا الطابق</p>
              </div>
            )}

            {/* Services Section */}
            {currentFloor.services && currentFloor.services.length > 0 && (
              <>
                <h3 className="text-right mb-3 font-bold text-lg">الخدمات المشتركة بالطابق</h3>
                <div className="overflow-x-auto">
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
                      {currentFloor.services.map((service) => (
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Tree View - Hierarchical representation
  const renderTreeView = () => (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        {complexes.map((complex, index) => (
          <div key={complex.id} className="border rounded-lg overflow-hidden">
            <div 
              className={`${getColor(index, 'complex')} p-4 flex justify-between items-center text-white cursor-pointer`}
              onClick={() => handleComplexSelect(complex.id)}
            >
              <div className="flex items-center">
                <span className="badge badge-neutral">{complex.buildings && complex.buildings.length || 0} مبنى</span>
              </div>
              <div className="text-right">
                <h2 className="font-bold text-lg">{complex.name}</h2>
                <p className="text-sm opacity-90">{complex.location}</p>
              </div>
            </div>
            
            {/* Expand buildings when complex is selected */}
            {selectedComplex === complex.id && complex.buildings && Array.isArray(complex.buildings) && complex.buildings.length > 0 && (
              <div className="bg-base-100 p-2 border-t">
                <div className="relative">
                  {/* Vertical line connecting buildings */}
                  <div className="absolute bottom-0 top-0 right-7 border-r-2 border-dashed"></div>
                  
                  {complex.buildings.map((building, buildingIndex) => (
                    <div key={building.id} className="relative mr-8 mb-2">
                      {/* Horizontal line to building */}
                      <div className="absolute top-6 right-[-28px] w-7 border-t-2 border-dashed"></div>
                      
                      <div 
                        className={`${selectedBuilding === building.id ? 'border-2 border-secondary' : 'border'} 
                                    rounded-lg overflow-hidden shadow-sm`}
                      >
                        <div 
                          className="bg-base-200 p-3 flex justify-between items-center cursor-pointer"
                          onClick={() => handleBuildingSelect(building.id)}
                        >
                          <span className="badge badge-secondary">{building.floors && building.floors.length || 0} طابق</span>
                          <h3 className="text-right font-bold">{building.name}</h3>
                        </div>
                        
                        {/* Expand floors when building is selected */}
                        {selectedBuilding === building.id && building.floors && Array.isArray(building.floors) && building.floors.length > 0 && (
                          <div className="bg-base-100 p-2 border-t relative">
                            {/* Vertical line connecting floors */}
                            <div className="absolute bottom-0 top-0 right-7 border-r-2 border-dotted"></div>
                            
                            {building.floors
                              .sort((a, b) => b.number - a.number)
                              .map((floor) => (
                              <div key={floor.id} className="relative mr-8 mb-2">
                                {/* Horizontal line to floor */}
                                <div className="absolute top-6 right-[-28px] w-7 border-t-2 border-dotted"></div>
                                
                                <div 
                                  className={`${selectedFloor === floor.number ? 'border-2 border-accent' : 'border'} 
                                            rounded-lg overflow-hidden shadow-sm`}
                                >
                                  <div 
                                    className="bg-base-200 p-2 flex justify-between items-center cursor-pointer"
                                    onClick={() => handleFloorSelect(floor.number)}
                                  >
                                    <div className="flex space-x-2">
                                      <span className="badge badge-primary badge-sm">{floor.rooms.length} غرفة</span>
                                      <span className="badge badge-secondary badge-sm">{floor.services.length} خدمة</span>
                                    </div>
                                    <h4 className="text-right">الطابق {floor.number}</h4>
                                  </div>
                                  
                                  {/* Expand rooms when floor is selected */}
                                  {selectedFloor === floor.number && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border-t">
                                      {floor.rooms.map((room) => (
                                        <div 
                                          key={room.id}
                                          className={`border rounded p-2 text-right cursor-pointer ${getRoomStatusClass(room.status)}`}
                                          onClick={() => handleRoomSelect(room.room_number)}
                                        >
                                          <div className="flex justify-between items-center">
                                            <span className={`badge badge-xs ${
                                              room.status === 'available' ? 'badge-success' :
                                              room.status === 'occupied' ? 'badge-warning' : 'badge-error'
                                            }`}>
                                              {getStatusLabel(room.status)}
                                            </span>
                                            <span className="font-bold">{room.name}</span>
                                          </div>
                                          <div className="text-xs">{room.room_number}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 3D-like View
  const render3DView = () => (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-8">
        {complexes.map((complex, index) => (
          <div key={complex.id} className="perspective">
            <div
              className={`relative p-4 transform-style-3d cursor-pointer ${
                selectedComplex === complex.id ? 'rotate-x-5' : ''
              }`}
              onClick={() => handleComplexSelect(complex.id)}
            >
              <div className={`${getColor(index, 'complex')} p-6 rounded-lg shadow-xl transform text-white transition-all duration-300`}>
                <div className="flex justify-between items-center">
                  <span className="badge badge-lg badge-outline">{complex.buildings && complex.buildings.length || 0} مبنى</span>
                  <h2 className="text-xl font-bold text-right">{complex.name}</h2>
                </div>
                <p className="text-right mt-2">{complex.location}</p>
                {complex.description && <p className="text-right text-sm mt-2 opacity-80">{complex.description}</p>}
              </div>
              
              {/* Buildings */}
              {selectedComplex === complex.id && complex.buildings && Array.isArray(complex.buildings) && complex.buildings.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complex.buildings.map((building, bIndex) => (
                    <div 
                      key={building.id} 
                      className={`transform-style-3d cursor-pointer ${
                        selectedBuilding === building.id ? 'translate-z-12' : 'hover:translate-z-4'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuildingSelect(building.id);
                      }}
                    >
                      <div className={`bg-secondary p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                        selectedBuilding === building.id ? 'rotate-y-5 shadow-2xl' : ''
                      }`}>
                        <div className="flex justify-between items-center text-white">
                          <span className="badge badge-outline">{building.floors && building.floors.length || 0} طابق</span>
                          <h3 className="font-bold text-right">{building.name}</h3>
                        </div>
                      </div>
                      
                      {/* Floors Stack */}
                      {selectedBuilding === building.id && building.floors && Array.isArray(building.floors) && building.floors.length > 0 && (
                        <div className="mt-4 relative pt-4 pb-4 perspective-600">
                          {building.floors
                            .sort((a, b) => b.number - a.number)
                            .map((floor, fIndex) => {
                              // Calculate offset for 3D stack effect
                              const offset = fIndex * 8;
                              return (
                                <div
                                  key={floor.id}
                                  style={{
                                    marginTop: `-${offset}px`,
                                    marginBottom: `${offset}px`,
                                    zIndex: building.floors.length - fIndex,
                                    transform: `translateZ(${fIndex * -5}px)`,
                                  }}
                                  className={`relative bg-accent p-3 rounded-lg shadow ${
                                    selectedFloor === floor.number ? 'translate-y-[-10px] shadow-lg' : ''
                                  } mb-2 cursor-pointer transition-all hover:translate-y-[-5px]`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFloorSelect(floor.number);
                                  }}
                                >
                                  <div className="flex justify-between items-center text-white">
                                    <div className="flex gap-2">
                                      <span className="badge badge-xs badge-outline">{floor.rooms && floor.rooms.length || 0} غرفة</span>
                                      <span className="badge badge-xs badge-outline">{floor.services && floor.services.length || 0} خدمة</span>
                                    </div>
                                    <span className="font-bold">الطابق {floor.number}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                      
                      {/* Floor Details */}
                      {selectedFloor !== null && selectedBuilding === building.id && currentFloor && (
                        <div className="mt-4 bg-base-200 rounded-lg p-4 shadow-inner">
                          <h4 className="text-right font-bold mb-2">محتويات الطابق {selectedFloor}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {currentFloor.rooms && currentFloor.rooms.length > 0 && currentFloor.rooms.map((room) => (
                              <div
                                key={room.id}
                                className={`text-right p-2 rounded ${getRoomStatusClass(room.status)} cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRoomSelect(room.room_number);
                                }}
                              >
                                <div className="flex justify-between">
                                  <span className={`badge badge-xs ${
                                    room.status === 'available' ? 'badge-success' :
                                    room.status === 'occupied' ? 'badge-warning' : 'badge-error'
                                  }`}></span>
                                  <span className="font-bold">{room.name}</span>
                                </div>
                                <span className="text-xs block">{room.room_number}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // CSS classes for the 3D effect
  const styleElement = (
    <style jsx global>{`
      .perspective {
        perspective: 2000px;
      }
      .perspective-600 {
        perspective: 600px;
      }
      .transform-style-3d {
        transform-style: preserve-3d;
      }
      .rotate-x-5 {
        transform: rotateX(5deg);
      }
      .rotate-y-5 {
        transform: rotateY(5deg);
      }
      .translate-z-4 {
        transform: translateZ(4px);
      }
      .translate-z-12 {
        transform: translateZ(12px);
      }
    `}</style>
  );

  return (
    <>
      {styleElement}
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button 
              className={`btn btn-sm ${activeView === 'card' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setActiveView('card')}
            >
              عرض البطاقات
            </button>
            <button 
              className={`btn btn-sm ${activeView === 'tree' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setActiveView('tree')}
            >
              عرض شجري
            </button>
            <button 
              className={`btn btn-sm ${activeView === '3d' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setActiveView('3d')}
            >
              عرض ثلاثي الأبعاد
            </button>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">هيكل الإسكان</h1>
            <p className="text-sm opacity-70">عرض المجمعات والمباني والطوابق والغرف</p>
          </div>
        </div>

        {complexes.length === 0 ? (
          <div className="text-center p-12 bg-base-200 rounded-lg">
            <h2 className="text-xl font-bold">لا توجد مجمعات سكنية حالياً</h2>
            <p className="text-sm mt-2">قم بإضافة مجمعات سكنية للبدء</p>
          </div>
        ) : (
          <>
            {activeView === 'card' && renderCardView()}
            {activeView === 'tree' && renderTreeView()}
            {activeView === '3d' && render3DView()}
          </>
        )}
      </div>
    </>
  );
}