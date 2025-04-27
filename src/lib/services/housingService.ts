import { 
  ResidentialComplex, 
  Building, 
  Room,
  Facility
} from '@/models/types';

// Residential Complex Operations
export const getComplexes = async (): Promise<ResidentialComplex[]> => {
  try {
    const response = await fetch('/api/housing');
    
    if (!response.ok) {
      throw new Error(`فشل في جلب المجمعات السكنية: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('فشل في جلب المجمعات السكنية:', error);
    throw error;
  }
};

export const getComplexById = async (id: string): Promise<ResidentialComplex | null> => {
  try {
    const response = await fetch(`/api/housing/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`فشل في جلب المجمع السكني: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`فشل في جلب المجمع السكني بالمعرف ${id}:`, error);
    throw error;
  }
};

export const createComplex = async (complex: Omit<ResidentialComplex, 'id' | 'created_at'>): Promise<ResidentialComplex> => {
  console.log('محاولة إنشاء مجمع سكني جديد:', complex);
  
  try {
    // التحقق من وجود الحقول المطلوبة
    if (!complex.name || !complex.location) {
      throw new Error('اسم المجمع والموقع مطلوبان');
    }
    
    const response = await fetch('/api/housing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complex),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `فشل في إنشاء المجمع السكني: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('تم إنشاء المجمع بنجاح:', data);
    return data;
  } catch (err) {
    console.error('خطأ غير متوقع عند إنشاء المجمع:', err);
    throw err;
  }
};

export const updateComplex = async (id: string, updates: Partial<ResidentialComplex>): Promise<ResidentialComplex> => {
  try {
    const response = await fetch('/api/housing', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `فشل في تحديث المجمع السكني: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`فشل في تحديث المجمع السكني بالمعرف ${id}:`, error);
    throw error;
  }
};

export const deleteComplex = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/housing?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `فشل في حذف المجمع السكني: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`فشل في حذف المجمع السكني بالمعرف ${id}:`, error);
    throw error;
  }
};

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/housing', {
      method: 'OPTIONS',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('فشل في اختبار الاتصال بقاعدة البيانات:', error);
    return false;
  }
};

// Building Operations
export const getBuildings = async (complexId?: string): Promise<Building[]> => {
  try {
    const url = complexId ? `/api/housing/buildings?complexId=${complexId}` : '/api/housing/buildings';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`فشل في جلب المباني: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('فشل في جلب المباني:', error);
    throw error;
  }
};

export const getBuildingById = async (id: string): Promise<Building | null> => {
  try {
    const response = await fetch(`/api/housing/buildings/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`فشل في جلب المبنى: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`فشل في جلب المبنى بالمعرف ${id}:`, error);
    throw error;
  }
};

export const createBuilding = async (building: Omit<Building, 'id'>): Promise<Building> => {
  try {
    const response = await fetch('/api/housing/buildings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(building),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `فشل في إنشاء المبنى: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('فشل في إنشاء مبنى جديد:', error);
    throw error;
  }
};

export const updateBuilding = async (id: string, updates: Partial<Building>): Promise<Building> => {
  try {
    const response = await fetch('/api/housing/buildings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `فشل في تحديث المبنى: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`فشل في تحديث المبنى بالمعرف ${id}:`, error);
    throw error;
  }
};

export const deleteBuilding = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/housing/buildings?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `فشل في حذف المبنى: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`فشل في حذف المبنى بالمعرف ${id}:`, error);
    throw error;
  }
};

// Room Operations
export const getRooms = async (buildingId?: string): Promise<Room[]> => {
  try {
    const url = buildingId ? `/api/housing/rooms?buildingId=${buildingId}` : '/api/housing/rooms';
    
    console.log(`Fetching rooms from ${url}`);
    const response = await fetch(url, {
      // Adding cache: no-store to prevent caching issues
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || response.statusText;
      } catch {
        // If not JSON, use as plain text
        errorMessage = errorText || response.statusText;
      }
      
      console.error(`Error response from rooms API: ${errorMessage}`);
      throw new Error(`فشل في جلب الغرف: ${errorMessage}`);
    }
    
    const data = await response.json();
    
    // Map database schema to the expected Room interface if needed
    return data.map((room: any) => ({
      id: room.id,
      building_id: room.building_id,
      room_number: room.room_number,
      type: room.type,
      status: room.status || 'available',
      floor: room.floor,
      // Add other expected fields with defaults
      name: room.room_number // Use room_number as name if not present
    }));
  } catch (error: any) {
    console.error('فشل في جلب الغرف:', error);
    throw error;
  }
};

// Facility Operations
export const getFacilities = async (complexId?: string, buildingId?: string): Promise<Facility[]> => {
  try {
    let url = '/api/housing/facilities';
    const params = new URLSearchParams();
    
    if (complexId) params.append('complexId', complexId);
    if (buildingId) params.append('buildingId', buildingId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log(`Fetching facilities from ${url}`);
    const response = await fetch(url, {
      // Adding cache: no-store to prevent caching issues
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || response.statusText;
      } catch {
        // If not JSON, use as plain text
        errorMessage = errorText || response.statusText;
      }
      
      console.error(`Error response from facilities API: ${errorMessage}`);
      throw new Error(`فشل في جلب المرافق: ${errorMessage}`);
    }
    
    const data = await response.json();
    
    // Map database schema to the expected Facility interface if needed
    return data.map((facility: any) => ({
      id: facility.id,
      complex_id: facility.complex_id,
      building_id: facility.building_id,
      name: facility.name,
      type: facility.type,
      location_description: facility.location_description
    }));
  } catch (error: any) {
    console.error('فشل في جلب المرافق:', error);
    throw error;
  }
};