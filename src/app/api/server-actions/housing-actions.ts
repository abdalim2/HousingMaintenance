'use server';

import { 
  getComplexes,
  getComplexById,
  createComplex,
  updateComplex,
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  getRooms,
  getFacilities
} from '@/lib/services/housingService';
import { HousingComplex, Building, Room, Facility } from '@/models/types';

// إجراءات المجمعات السكنية
export async function getComplexesAction() {
  try {
    const complexes = await getComplexes();
    return { data: complexes, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب المجمعات السكنية:', error);
    return { data: [], error: `فشل في جلب المجمعات السكنية: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getComplexByIdAction(id: string) {
  try {
    const complex = await getComplexById(id);
    return { data: complex, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب المجمع السكني رقم ${id}:`, error);
    return { data: null, error: `فشل في جلب المجمع السكني: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function createComplexAction(complex: Omit<HousingComplex, 'id'>) {
  try {
    const newComplex = await createComplex(complex);
    return { data: newComplex, error: null };
  } catch (error: any) {
    console.error('خطأ في إنشاء مجمع سكني جديد:', error);
    return { data: null, error: `فشل في إنشاء المجمع السكني: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function updateComplexAction(id: string, updates: Partial<HousingComplex>) {
  try {
    const updatedComplex = await updateComplex(id, updates);
    return { data: updatedComplex, error: null };
  } catch (error: any) {
    console.error(`خطأ في تحديث المجمع السكني رقم ${id}:`, error);
    return { data: null, error: `فشل في تحديث المجمع السكني: ${error.message || 'خطأ غير معروف'}` };
  }
}

// إجراءات المباني
export async function getBuildingsAction(complexId?: string) {
  try {
    const buildings = await getBuildings(complexId);
    return { data: buildings, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب المباني:', error);
    return { data: [], error: `فشل في جلب المباني: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getBuildingByIdAction(id: string) {
  try {
    const building = await getBuildingById(id);
    return { data: building, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب المبنى رقم ${id}:`, error);
    return { data: null, error: `فشل في جلب المبنى: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function createBuildingAction(building: Omit<Building, 'id'>) {
  try {
    const newBuilding = await createBuilding(building);
    return { data: newBuilding, error: null };
  } catch (error: any) {
    console.error('خطأ في إنشاء مبنى جديد:', error);
    return { data: null, error: `فشل في إنشاء المبنى: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function updateBuildingAction(id: string, updates: Partial<Building>) {
  try {
    const updatedBuilding = await updateBuilding(id, updates);
    return { data: updatedBuilding, error: null };
  } catch (error: any) {
    console.error(`خطأ في تحديث المبنى رقم ${id}:`, error);
    return { data: null, error: `فشل في تحديث المبنى: ${error.message || 'خطأ غير معروف'}` };
  }
}

// إجراءات الغرف والمرافق
export async function getRoomsAction(buildingId?: string) {
  try {
    const rooms = await getRooms(buildingId);
    return { data: rooms, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب الغرف:', error);
    return { data: [], error: `فشل في جلب الغرف: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getFacilitiesAction(complexId?: string, buildingId?: string) {
  try {
    const facilities = await getFacilities(complexId, buildingId);
    return { data: facilities, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب المرافق:', error);
    return { data: [], error: `فشل في جلب المرافق: ${error.message || 'خطأ غير معروف'}` };
  }
}