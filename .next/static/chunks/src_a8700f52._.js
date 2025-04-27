(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/services/complexManagementService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "addBuildingToComplex": (()=>addBuildingToComplex),
    "addFloorToBuilding": (()=>addFloorToBuilding),
    "addRoomToFloor": (()=>addRoomToFloor),
    "addServiceToFloor": (()=>addServiceToFloor),
    "addServiceToRoom": (()=>addServiceToRoom),
    "createComplex": (()=>createComplex),
    "deleteComplex": (()=>deleteComplex),
    "getAllComplexes": (()=>getAllComplexes),
    "getBuildingById": (()=>getBuildingById),
    "getComplexById": (()=>getComplexById),
    "getFloorByNumber": (()=>getFloorByNumber),
    "importComplexesFromAPI": (()=>importComplexesFromAPI),
    "updateComplex": (()=>updateComplex)
});
// المصفوفة الرئيسية لتخزين جميع المجمعات السكنية
let residentialComplexes = [];
const getAllComplexes = ()=>{
    return residentialComplexes;
};
const getComplexById = (id)=>{
    return residentialComplexes.find((complex)=>complex.id === id);
};
const createComplex = async (complex)=>{
    try {
        // إنشاء المعرف الفريد
        const id = generateUniqueId();
        const newComplex = {
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newComplex.id,
                name: newComplex.name,
                location: newComplex.location,
                description: newComplex.description
            })
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
const updateComplex = (id, updates)=>{
    const complexIndex = residentialComplexes.findIndex((complex)=>complex.id === id);
    if (complexIndex === -1) {
        return undefined;
    }
    const updatedComplex = {
        ...residentialComplexes[complexIndex],
        ...updates
    };
    residentialComplexes[complexIndex] = updatedComplex;
    return updatedComplex;
};
const deleteComplex = (id)=>{
    const initialLength = residentialComplexes.length;
    residentialComplexes = residentialComplexes.filter((complex)=>complex.id !== id);
    return residentialComplexes.length < initialLength;
};
const addBuildingToComplex = async (complexId, building)=>{
    try {
        const complex = getComplexById(complexId);
        if (!complex) {
            return undefined;
        }
        // إرسال طلب لحفظ المبنى في قاعدة البيانات - make sure floors is at least 1
        const response = await fetch('/api/housing/buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                complex_id: complexId,
                name: building.name,
                floors: 1,
                description: building.description || ''
            })
        });
        // التحقق من نجاح الطلب
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.error || `فشل في حفظ المبنى: ${response.statusText}`);
        }
        // استخراج بيانات المبنى المضاف من الاستجابة
        const apiBuilding = await response.json();
        // إنشاء كائن المبنى بالتنسيق المناسب للتطبيق
        const newBuilding = {
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
const getBuildingById = (complexId, buildingId)=>{
    const complex = getComplexById(complexId);
    if (!complex) return undefined;
    return complex.buildings.find((building)=>building.id === buildingId);
};
const addFloorToBuilding = async (complexId, buildingId, floorNumber)=>{
    try {
        const building = getBuildingById(complexId, buildingId);
        if (!building) {
            return undefined;
        }
        // التحقق من عدم وجود طابق بنفس الرقم
        if (building.floors.some((floor)=>floor.number === floorNumber)) {
            return undefined;
        }
        // إنشاء المعرف الفريد
        const id = generateUniqueId();
        const newFloor = {
            id,
            number: floorNumber,
            rooms: [],
            services: []
        };
        // إرسال طلب لحفظ الطابق في قاعدة البيانات
        await fetch('/api/housing/floors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newFloor.id,
                building_id: buildingId,
                number: floorNumber
            })
        });
        // تحديث عدد الطوابق في المبنى في قاعدة البيانات
        await fetch('/api/housing/buildings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: buildingId,
                floors: building.floors.length + 1
            })
        });
        // إضافة الطابق إلى المصفوفة المحلية
        building.floors.push(newFloor);
        building.floors_count = building.floors.length;
        // ترتيب الطوابق تصاعدياً حسب الرقم
        building.floors.sort((a, b)=>a.number - b.number);
        return newFloor;
    } catch (error) {
        console.error('خطأ في إضافة الطابق:', error);
        throw error;
    }
};
const getFloorByNumber = (complexId, buildingId, floorNumber)=>{
    const building = getBuildingById(complexId, buildingId);
    if (!building) return undefined;
    return building.floors.find((floor)=>floor.number === floorNumber);
};
const addRoomToFloor = async (complexId, buildingId, floorNumber, room)=>{
    try {
        const floor = getFloorByNumber(complexId, buildingId, floorNumber);
        if (!floor) {
            return undefined;
        }
        // التحقق من عدم وجود غرفة بنفس الرقم
        if (floor.rooms.some((existingRoom)=>existingRoom.room_number === room.room_number)) {
            return undefined;
        }
        // إنشاء المعرف الفريد
        const id = generateUniqueId();
        const newRoom = {
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
                'Content-Type': 'application/json'
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
            })
        });
        // إضافة الغرفة إلى المصفوفة المحلية
        floor.rooms.push(newRoom);
        return newRoom;
    } catch (error) {
        console.error('خطأ في إضافة الغرفة:', error);
        throw error;
    }
};
const addServiceToFloor = async (complexId, buildingId, floorNumber, service)=>{
    try {
        const floor = getFloorByNumber(complexId, buildingId, floorNumber);
        if (!floor) {
            return undefined;
        }
        // إنشاء المعرف الفريد
        const id = generateUniqueId();
        const newService = {
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
                'Content-Type': 'application/json'
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
            })
        });
        // إضافة الخدمة إلى المصفوفة المحلية
        floor.services.push(newService);
        return newService;
    } catch (error) {
        console.error('خطأ في إضافة الخدمة للطابق:', error);
        throw error;
    }
};
const addServiceToRoom = async (complexId, buildingId, floorNumber, roomNumber, service)=>{
    try {
        const floor = getFloorByNumber(complexId, buildingId, floorNumber);
        if (!floor) return undefined;
        const room = floor.rooms.find((room)=>room.room_number === roomNumber);
        if (!room) return undefined;
        if (!room.services) {
            room.services = [];
        }
        // إنشاء المعرف الفريد
        const id = generateUniqueId();
        const newService = {
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
                'Content-Type': 'application/json'
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
            })
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
 */ const generateUniqueId = ()=>{
    // Implementation of UUID v4 according to RFC4122
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
};
const importComplexesFromAPI = async ()=>{
    try {
        const response = await fetch('/api/housing');
        if (!response.ok) {
            throw new Error(`فشل في جلب المجمعات السكنية: ${response.statusText}`);
        }
        const apiComplexes = await response.json();
        // تحويل البيانات من النموذج القديم إلى النموذج الجديد
        const transformedComplexes = [];
        for (const apiComplex of apiComplexes){
            const complex = {
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
                    for (const apiBuilding of apiBuildings){
                        const building = {
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
                                for (const apiFloor of apiFloors){
                                    const floor = {
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
                                            for (const apiRoom of apiRooms){
                                                const room = {
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
                                                        room.services = apiServices.map((apiService)=>({
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
                                            floor.services = apiServices.map((apiService)=>({
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
                                building.floors.sort((a, b)=>a.number - b.number);
                            }
                        } catch (error) {
                            console.error(`فشل في استيراد طوابق المبنى ${building.name}:`, error);
                            // إنشاء طوابق افتراضية بناءً على عدد الطوابق في المبنى
                            for(let i = 1; i <= apiBuilding.floors; i++){
                                const floor = {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/housing/management/page.tsx [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports } = __turbopack_context__;
{
const e = new Error(`Could not parse module '[project]/src/app/housing/management/page.tsx'

Unexpected token `div`. Expected jsx identifier`);
e.code = 'MODULE_UNPARSEABLE';
throw e;}}),
}]);

//# sourceMappingURL=src_a8700f52._.js.map