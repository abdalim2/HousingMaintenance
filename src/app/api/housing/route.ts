import { NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/neondb';
import { 
  ResidentialComplex, 
  Building, 
  Room,
  Facility
} from '@/models/types';

// وظيفة للتعامل مع الأخطاء وإرجاع استجابة موحدة
function handleError(error: any) {
  console.error('خطأ في واجهة API للإسكان:', error);
  
  return NextResponse.json(
    { error: error.message || 'حدث خطأ غير متوقع' },
    { status: 500 }
  );
}

// الحصول على جميع المجمعات السكنية
export async function GET(request: Request) {
  try {
    const result = await query('SELECT * FROM residential_complexes', []);
    return NextResponse.json(result.rows);
  } catch (error) {
    return handleError(error);
  }
}

// إنشاء مجمع سكني جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // التحقق من وجود البيانات المطلوبة
    if (!body.name || !body.location) {
      return NextResponse.json(
        { error: 'اسم المجمع والموقع مطلوبان' },
        { status: 400 }
      );
    }
    
    // إدخال المجمع الجديد في قاعدة البيانات
    const queryText = `
      INSERT INTO residential_complexes (name, location, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await query(queryText, [
      body.name,
      body.location,
      body.description || ''
    ]);
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// تحديث مجمع سكني
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'معرف المجمع مطلوب للتحديث' },
        { status: 400 }
      );
    }
    
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (body.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(body.name);
      paramIndex++;
    }
    
    if (body.location !== undefined) {
      fields.push(`location = $${paramIndex}`);
      values.push(body.location);
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
      UPDATE residential_complexes
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: `لم يتم العثور على مجمع سكني بالمعرف ${body.id}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return handleError(error);
  }
}

// اختبار الاتصال بقاعدة البيانات
export async function OPTIONS() {
  try {
    const result = await testConnection();
    
    return NextResponse.json({ 
      success: result, 
      message: result ? 'اتصال ناجح بقاعدة البيانات' : 'فشل الاتصال بقاعدة البيانات' 
    });
  } catch (error) {
    return handleError(error);
  }
}

// حذف مجمع سكني
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'معرف المجمع مطلوب للحذف' },
        { status: 400 }
      );
    }
    
    await query('DELETE FROM residential_complexes WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}