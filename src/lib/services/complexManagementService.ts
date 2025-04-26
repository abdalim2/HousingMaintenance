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
export const createComplex = (complex: Omit<ResidentialComplex, 'id' | 'buildings' | 'created_at'>): ResidentialComplex => {
  const newComplex: ResidentialComplex = {
    id: generateUniqueId(),
    name: complex.name,
    location: complex.location,
    description: complex.description,
    buildings: [],
    sharedFacilities: [],
    created_at: new Date().toISOString()
  };
  
  residentialComplexes.push(newComplex);
  return newComplex;
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
export const addBuildingToComplex = (complexId: string, building: Omit<Building, 'id' | 'floors' | 'complex_id'>): Building | undefined => {
  const complex = getComplexById(complexId);
  
  if (!complex) {
    return undefined;
  }
  
  const newBuilding: Building = {
    id: generateUniqueId(),
    name: building.name,
    floors: [],
    address: building.address,
    description: building.description,
    floors_count: 0,
    complex_id: complexId
  };
  
  complex.buildings.push(newBuilding);
  return newBuilding;
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
export const addFloorToBuilding = (complexId: string, buildingId: string, floorNumber: number): Floor | undefined => {
  const building = getBuildingById(complexId, buildingId);
  
  if (!building) {
    return undefined;
  }
  
  // التحقق من عدم وجود طابق بنفس الرقم
  if (building.floors.some(floor => floor.number === floorNumber)) {
    return undefined;
  }
  
  const newFloor: Floor = {
    id: generateUniqueId(),
    number: floorNumber,
    rooms: [],
    services: []
  };
  
  building.floors.push(newFloor);
  building.floors_count = building.floors.length;
  
  // ترتيب الطوابق تصاعدياً حسب الرقم
  building.floors.sort((a, b) => a.number - b.number);
  
  return newFloor;
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
export const addRoomToFloor = (
  complexId: string, 
  buildingId: string, 
  floorNumber: number, 
  room: Omit<Room, 'id' | 'services'>
): Room | undefined => {
  const floor = getFloorByNumber(complexId, buildingId, floorNumber);
  
  if (!floor) {
    return undefined;
  }
  
  // التحقق من عدم وجود غرفة بنفس الرقم
  if (floor.rooms.some(existingRoom => existingRoom.room_number === room.room_number)) {
    return undefined;
  }
  
  const newRoom: Room = {
    id: generateUniqueId(),
    name: room.name,
    room_number: room.room_number,
    type: room.type,
    status: room.status,
    area: room.area,
    hasBalcony: room.hasBalcony,
    services: []
  };
  
  floor.rooms.push(newRoom);
  return newRoom;
};

/**
 * إضافة خدمة لطابق
 */
export const addServiceToFloor = (
  complexId: string,
  buildingId: string,
  floorNumber: number,
  service: Omit<Service, 'id'>
): Service | undefined => {
  const floor = getFloorByNumber(complexId, buildingId, floorNumber);
  
  if (!floor) {
    return undefined;
  }
  
  const newService: Service = {
    id: generateUniqueId(),
    name: service.name,
    type: service.type,
    location: service.location,
    description: service.description
  };
  
  floor.services.push(newService);
  return newService;
};

/**
 * إضافة خدمة لغرفة
 */
export const addServiceToRoom = (
  complexId: string,
  buildingId: string,
  floorNumber: number,
  roomNumber: string,
  service: Omit<Service, 'id'>
): Service | undefined => {
  const floor = getFloorByNumber(complexId, buildingId, floorNumber);
  if (!floor) return undefined;
  
  const room = floor.rooms.find(room => room.room_number === roomNumber);
  if (!room) return undefined;
  
  if (!room.services) {
    room.services = [];
  }
  
  const newService: Service = {
    id: generateUniqueId(),
    name: service.name,
    type: service.type,
    location: service.location,
    description: service.description
  };
  
  room.services.push(newService);
  return newService;
};

/**
 * دالة مساعدة لإنشاء معرفات فريدة
 */
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
              floors: []
            };
            
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