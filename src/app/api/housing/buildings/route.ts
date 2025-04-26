import { NextResponse } from 'next/server';
import { query } from '@/lib/neondb';
import { Building } from '@/models/types';

// وظيفة للتعامل مع الأخطاء وإرجاع استجابة موحدة
function handleError(error: any) {
  console.error('خطأ في واجهة API للمباني:', error);
  
  return NextResponse.json(
    { error: error.message || 'حدث خطأ غير متوقع' },
    { status: 500 }
  );
}

// الحصول على جميع المباني (اختياريًا بناءً على معرف المجمع)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const complexId = searchParams.get('complexId');
    
    let queryText = 'SELECT * FROM buildings';
    const values: any[] = [];
    
    if (complexId) {
      queryText += ' WHERE complex_id = $1';
      values.push(complexId);
    }
    
    const result = await query(queryText, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    return handleError(error);
  }
}

// إنشاء مبنى جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // التحقق من وجود البيانات المطلوبة
    if (!body.complex_id || !body.name || body.floors === undefined) {
      return NextResponse.json(
        { error: 'معرف المجمع، اسم المبنى وعدد الطوابق مطلوبة' },
        { status: 400 }
      );
    }
    
    // إدخال المبنى الجديد في قاعدة البيانات
    const queryText = `
      INSERT INTO buildings (complex_id, name, floors, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await query(queryText, [
      body.complex_id,
      body.name,
      body.floors,
      body.description || ''
    ]);
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// تحديث مبنى
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'معرف المبنى مطلوب للتحديث' },
        { status: 400 }
      );
    }
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (body.complex_id !== undefined) {
      fields.push(`complex_id = $${paramIndex}`);
      values.push(body.complex_id);
      paramIndex++;
    }
    
    if (body.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(body.name);
      paramIndex++;
    }
    
    if (body.floors !== undefined) {
      fields.push(`floors = $${paramIndex}`);
      values.push(body.floors);
      paramIndex++;
    }
    
    if (body.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(body.description);
      paramIndex++;
    }
    
    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'لم يتم تقديم أي حقول للتحديث' },
        { status: 400 }
      );
    }
    
    values.push(body.id);
    
    const queryText = `
      UPDATE buildings
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: `لم يتم العثور على مبنى بالمعرف ${body.id}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return handleError(error);
  }
}

// حذف مبنى
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'معرف المبنى مطلوب للحذف' },
        { status: 400 }
      );
    }
    
    await query('DELETE FROM buildings WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}