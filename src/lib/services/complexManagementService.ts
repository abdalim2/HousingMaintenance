import { 
  ResidentialComplex, 
  Building, 
  Floor, 
  Room, 
  Service, 
  Facility 
} from '@/models/types';

// المصفوفة الرئيسية لتخزين جميع المجمعات السكنية
let residentialComplexes: ResidentialComplex[] = [];

/**
 * الحصول على جميع المجمعات السكنية
 */
export const getAllComplexes = (): ResidentialComplex[] => {
  return residentialComplexes;
};

/**
 * الحصول على مجمع سكني بواسطة المعرف
 */
export const getComplexById = (id: string): ResidentialComplex | undefined => {
  return residentialComplexes.find(complex => complex.id === id);
};

/**
 * إنشاء مجمع سكني جديد
 */
export const createComplex = async (complex: Omit<ResidentialComplex, 'id' | 'buildings' | 'created_at'>): Promise<ResidentialComplex> => {
  try {
    // إنشاء المعرف الفريد
    const id = generateUniqueId();
    
    const newComplex: ResidentialComplex = {
      id,
      name: complex.name,
      location: complex.location,
      description: complex.description,
      buildings: [],
      sharedFacilities: [],
      created_at: new Date().toISOString()
    };
    
    // إرسال طلب لحفظ المجمع السكني في قاعدة البيانات
    const response = await fetch('/api/housing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newComplex.id,
        name: newComplex.name,
        location: newComplex.location,
        description: newComplex.description,
      }),
    });

    if (!response.ok) {
      throw new Error(`فشل في حفظ المجمع السكني: ${response.statusText}`);
    }
    
    // إضافة المجمع إلى المصفوفة المحلية
    residentialComplexes.push(newComplex);
    return newComplex;
  } catch (error) {
    console.error('خطأ في إنشاء المجمع السكني:', error);
    throw error;
  }
};

/**
 * تحديث مجمع سكني
 */
export const updateComplex = (id: string, updates: Partial<ResidentialComplex>): ResidentialComplex | undefined => {
  const complexIndex = residentialComplexes.findIndex(complex => complex.id === id);
  
  if (complexIndex === -1) {
    return undefined;
  }
  
  const updatedComplex = {
    ...residentialComplexes[complexIndex],
    ...updates,
  };
  
  residentialComplexes[complexIndex] = updatedComplex;
  return updatedComplex;
};

/**
 * حذف مجمع سكني
 */
export const deleteComplex = (id: string): boolean => {
  const initialLength = residentialComplexes.length;
  residentialComplexes = residentialComplexes.filter(complex => complex.id !== id);
  return residentialComplexes.length < initialLength;
};

/**
 * إضافة مبنى لمجمع سكني
 */
export const addBuildingToComplex = async (complexId: string, building: Omit<Building, 'id' | 'floors' | 'complex_id'>): Promise<Building | undefined> => {
  try {
    const complex = getComplexById(complexId);
    
    if (!complex) {
      return undefined;
    }
    
    // إرسال طلب لحفظ المبنى في قاعدة البيانات - make sure floors is at least 1
    const response = await fetch('/api/housing/buildings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        complex_id: complexId,
        name: building.name,
        floors: 1, // Default to 1 floor to satisfy database constraint CHECK (floors > 0)
        description: building.description || ''
      }),
    });

    // التحقق من نجاح الطلب
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `فشل في حفظ المبنى: ${response.statusText}`);
    }
    
    // استخراج بيانات المبنى المضاف من الاستجابة
    const apiBuilding = await response.json();
    
    // إنشاء كائن المبنى بالتنسيق المناسب للتطبيق
    const newBuilding: Building = {
      id: apiBuilding.id,
      name: apiBuilding.name || building.name,
      floors: [],
      floors_count: apiBuilding.floors || 1,
      description: apiBuilding.description || building.description || '',
      complex_id: complexId
    };
    
    // إضافة المبنى إلى المصفوفة المحلية
    complex.buildings.push(newBuilding);
    return newBuilding;
  } catch (error) {
    console.error('خطأ في إضافة المبنى:', error);
    throw error;
  }
};

/**
 * الحصول على مبنى بواسطة المعرف
 */
export const getBuildingById = (complexId: string, buildingId: string): Building | undefined => {
  const complex = getComplexById(complexId);
  if (!complex) return undefined;
  
  return complex.buildings.find(building => building.id === buildingId);
};

/**
 * إضافة طابق لمبنى
 */
export const addFloorToBuilding = async (complexId: string, buildingId: string, floorNumber: number): Promise<Floor | undefined> => {
  try {
    const building = getBuildingById(complexId, buildingId);
    
    if (!building) {
      return undefined;
    }
    
    // التحقق من عدم وجود طابق بنفس الرقم
    if (building.floors.some(floor => floor.number === floorNumber)) {
      return undefined;
    }
    
    // إنشاء المعرف الفريد
    const id = generateUniqueId();
    
    const newFloor: Floor = {
      id,
      number: floorNumber,
      rooms: [],
      services: []
    };
    
    // إرسال طلب لحفظ الطابق في قاعدة البيانات
    await fetch('/api/housing/floors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newFloor.id,
        building_id: buildingId,
        number: floorNumber
      }),
    });
    
    // تحديث عدد الطوابق في المبنى في قاعدة البيانات
    await fetch('/api/housing/buildings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: buildingId,
        floors: building.floors.length + 1
      }),
    });
    
    // إضافة الطابق إلى المصفوفة المحلية
    building.floors.push(newFloor);
    building.floors_count = building.floors.length;
    
    // ترتيب الطوابق تصاعدياً حسب الرقم
    building.floors.sort((a, b) => a.number - b.number);
    
    return newFloor;
  } catch (error) {
    console.error('خطأ في إضافة الطابق:', error);
    throw error;
  }
};

/**
 * الحصول على طابق بواسطة الرقم
 */
export const getFloorByNumber = (complexId: string, buildingId: string, floorNumber: number): Floor | undefined => {
  const building = getBuildingById(complexId, buildingId);
  if (!building) return undefined;
  
  return building.floors.find(floor => floor.number === floorNumber);
};

/**
 * إضافة غرفة لطابق
 */
export const addRoomToFloor = async (
  complexId: string, 
  buildingId: string, 
  floorNumber: number, 
  room: Omit<Room, 'id' | 'services'>
): Promise<Room | undefined> => {
  try {
    const floor = getFloorByNumber(complexId, buildingId, floorNumber);
    
    if (!floor) {
      return undefined;
    }
    
    // التحقق من عدم وجود غرفة بنفس الرقم
    if (floor.rooms.some(existingRoom => existingRoom.room_number === room.room_number)) {
      return undefined;
    }
    
    // إنشاء المعرف الفريد
    const id = generateUniqueId();
    
    const newRoom: Room = {
      id,
      name: room.name,
      room_number: room.room_number,
      type: room.type,
      status: room.status,
      area: room.area,
      hasBalcony: room.hasBalcony,
      services: []
    };
    
    // إرسال طلب لحفظ الغرفة في قاعدة البيانات
    await fetch('/api/housing/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newRoom.id,
        building_id: buildingId,
        floor_number: floorNumber,
        name: newRoom.name,
        room_number: newRoom.room_number,
        type: newRoom.type,
        status: newRoom.status,
        area: newRoom.area,
        has_balcony: newRoom.hasBalcony
      }),
    });
    
    // إضافة الغرفة إلى المصفوفة المحلية
    floor.rooms.push(newRoom);
    return newRoom;
  } catch (error) {
    console.error('خطأ في إضافة الغرفة:', error);
    throw error;
  }
};

/**
 * إضافة خدمة لطابق
 */
export const addServiceToFloor = async (
  complexId: string,
  buildingId: string,
  floorNumber: number,
  service: Omit<Service, 'id'>
): Promise<Service | undefined> => {
  try {
    const floor = getFloorByNumber(complexId, buildingId, floorNumber);
    
    if (!floor) {
      return undefined;
    }
    
    // إنشاء المعرف الفريد
    const id = generateUniqueId();
    
    const newService: Service = {
      id,
      name: service.name,
      type: service.type,
      location: service.location,
      description: service.description
    };
    
    // إرسال طلب لحفظ الخدمة في قاعدة البيانات
    await fetch('/api/housing/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newService.id,
        building_id: buildingId,
        floor_number: floorNumber,
        room_number: null,
        name: newService.name,
        type: newService.type,
        location: newService.location,
        description: newService.description
      }),
    });
    
    // إضافة الخدمة إلى المصفوفة المحلية
    floor.services.push(newService);
    return newService;
  } catch (error) {
    console.error('خطأ في إضافة الخدمة للطابق:', error);
    throw error;
  }
};

/**
 * إضافة خدمة لغرفة
 */
export const addServiceToRoom = async (
  complexId: string,
  buildingId: string,
  floorNumber: number,
  roomNumber: string,
  service: Omit<Service, 'id'>
): Promise<Service | undefined> => {
  try {
    const floor = getFloorByNumber(complexId, buildingId, floorNumber);
    if (!floor) return undefined;
    
    const room = floor.rooms.find(room => room.room_number === roomNumber);
    if (!room) return undefined;
    
    if (!room.services) {
      room.services = [];
    }
    
    // إنشاء المعرف الفريد
    const id = generateUniqueId();
    
    const newService: Service = {
      id,
      name: service.name,
      type: service.type,
      location: service.location,
      description: service.description
    };
    
    // إرسال طلب لحفظ الخدمة في قاعدة البيانات
    await fetch('/api/housing/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newService.id,
        building_id: buildingId,
        floor_number: floorNumber,
        room_number: roomNumber,
        name: newService.name,
        type: newService.type,
        location: newService.location,
        description: newService.description
      }),
    });
    
    // إضافة الخدمة إلى المصفوفة المحلية
    room.services.push(newService);
    return newService;
  } catch (error) {
    console.error('خطأ في إضافة الخدمة للغرفة:', error);
    throw error;
  }
};

/**
 * دالة مساعدة لإنشاء معرفات فريدة بتنسيق UUID
 */
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = (): string => {
  return uuidv4();
};

/**
 * استيراد بيانات المجمعات السكنية من وحدات API خارجية
 */
export const importComplexesFromAPI = async (): Promise<void> => {
  try {
    const response = await fetch('/api/housing');
    if (!response.ok) {
      throw new Error(`فشل في جلب المجمعات السكنية: ${response.statusText}`);
    }
    
    const apiComplexes = await response.json();
    
    // تحويل البيانات من النموذج القديم إلى النموذج الجديد
    const transformedComplexes: ResidentialComplex[] = [];
    
    for (const apiComplex of apiComplexes) {
      const complex: ResidentialComplex = {
        id: apiComplex.id,
        name: apiComplex.name,
        location: apiComplex.location,
        description: apiComplex.description,
        created_at: apiComplex.created_at,
        buildings: [],
        sharedFacilities: []
      };
      
      // استيراد المباني
      try {
        const buildingsResponse = await fetch(`/api/housing/buildings?complexId=${complex.id}`);
        if (buildingsResponse.ok) {
          const apiBuildings = await buildingsResponse.json();
          
          for (const apiBuilding of apiBuildings) {
            const building: Building = {
              id: apiBuilding.id,
              name: apiBuilding.name,
              complex_id: apiBuilding.complex_id,
              floors_count: apiBuilding.floors,
              description: apiBuilding.description,
              address: apiBuilding.address,
              floors: []
            };
            
            // استيراد الطوابق
            try {
              const floorsResponse = await fetch(`/api/housing/floors?buildingId=${building.id}`);
              if (floorsResponse.ok) {
                const apiFloors = await floorsResponse.json();
                
                for (const apiFloor of apiFloors) {
                  const floor: Floor = {
                    id: apiFloor.id,
                    number: apiFloor.number,
                    rooms: [],
                    services: []
                  };
                  
                  // استيراد الغرف للطابق
                  try {
                    const roomsResponse = await fetch(`/api/housing/rooms?buildingId=${building.id}&floorNumber=${floor.number}`);
                    if (roomsResponse.ok) {
                      const apiRooms = await roomsResponse.json();
                      
                      for (const apiRoom of apiRooms) {
                        const room: Room = {
                          id: apiRoom.id,
                          name: apiRoom.name,
                          room_number: apiRoom.room_number,
                          type: apiRoom.type,
                          status: apiRoom.status,
                          area: apiRoom.area,
                          hasBalcony: apiRoom.has_balcony,
                          services: []
                        };
                        
                        // استيراد الخدمات للغرفة
                        try {
                          const servicesResponse = await fetch(`/api/housing/services?roomId=${room.id}`);
                          if (servicesResponse.ok) {
                            const apiServices = await servicesResponse.json();
                            room.services = apiServices.map((apiService: any) => ({
                              id: apiService.id,
                              name: apiService.name,
                              type: apiService.type,
                              location: apiService.location,
                              description: apiService.description
                            }));
                          }
                        } catch (error) {
                          console.error(`فشل في استيراد خدمات الغرفة ${room.name}:`, error);
                        }
                        
                        floor.rooms.push(room);
                      }
                    }
                  } catch (error) {
                    console.error(`فشل في استيراد غرف الطابق ${floor.number}:`, error);
                  }
                  
                  // استيراد الخدمات للطابق
                  try {
                    const servicesResponse = await fetch(`/api/housing/services?floorId=${floor.id}`);
                    if (servicesResponse.ok) {
                      const apiServices = await servicesResponse.json();
                      floor.services = apiServices.map((apiService: any) => ({
                        id: apiService.id,
                        name: apiService.name,
                        type: apiService.type,
                        location: apiService.location,
                        description: apiService.description
                      }));
                    }
                  } catch (error) {
                    console.error(`فشل في استيراد خدمات الطابق ${floor.number}:`, error);
                  }
                  
                  building.floors.push(floor);
                }
                
                // ترتيب الطوابق تصاعدياً حسب الرقم
                building.floors.sort((a, b) => a.number - b.number);
              }
            } catch (error) {
              console.error(`فشل في استيراد طوابق المبنى ${building.name}:`, error);
              
              // إنشاء طوابق افتراضية بناءً على عدد الطوابق في المبنى
              for (let i = 1; i <= apiBuilding.floors; i++) {
                const floor: Floor = {
                  id: generateUniqueId(),
                  number: i,
                  rooms: [],
                  services: []
                };
                building.floors.push(floor);
              }
            }
            
            complex.buildings.push(building);
          }
        }
      } catch (error) {
        console.error(`فشل في استيراد المباني للمجمع ${complex.name}:`, error);
      }
      
      transformedComplexes.push(complex);
    }
    
    // تحديث المصفوفة الرئيسية
    residentialComplexes = transformedComplexes;
    
  } catch (error) {
    console.error('فشل في استيراد المجمعات السكنية:', error);
    throw error;
  }
};