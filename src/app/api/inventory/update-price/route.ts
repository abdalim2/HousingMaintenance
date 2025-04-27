import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { itemId, unitPrice } = await request.json();

    if (!itemId || unitPrice === undefined || unitPrice < 0) {
      return NextResponse.json(
        { error: 'معرف الصنف وسعر الوحدة مطلوبان' },
        { status: 400 }
      );
    }

    // First, check if the item exists in inventory
    const { data: inventoryItems, error: fetchError } = await supabase
      .from('inventory')
      .select('id')
      .eq('item_id', itemId);
    
    if (fetchError) {
      console.error('Error fetching inventory item:', fetchError);
      return NextResponse.json(
        { error: 'حدث خطأ أثناء التحقق من الصنف' },
        { status: 500 }
      );
    }
    
    if (!inventoryItems || inventoryItems.length === 0) {
      return NextResponse.json(
        { error: 'الصنف غير موجود في المخزون' },
        { status: 404 }
      );
    }

    // Update unit price for all inventory items with this item_id
    const { error: updateError } = await supabase
      .from('inventory')
      .update({ unit_price: unitPrice, last_updated: new Date().toISOString() })
      .eq('item_id', itemId);
    
    if (updateError) {
      console.error('Error updating unit price:', updateError);
      return NextResponse.json(
        { error: 'حدث خطأ أثناء تحديث سعر الوحدة' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'تم تحديث سعر الوحدة بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in update-price API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}