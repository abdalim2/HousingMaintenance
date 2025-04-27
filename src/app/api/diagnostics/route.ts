import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test connection by attempting to fetch the database version
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to connect to database', 
        error: error.message,
        details: error 
      }, { status: 500 });
    }
    
    // Check if specific tables exist
    const tableChecks = await Promise.all([
      checkTableExists('maintenance_requests'),
      checkTableExists('residential_complexes'),
      checkTableExists('buildings'),
      checkTableExists('maintenance_items')
    ]);
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Successfully connected to Supabase',
      version: data,
      tables: {
        maintenance_requests: tableChecks[0],
        residential_complexes: tableChecks[1],
        buildings: tableChecks[2],
        maintenance_items: tableChecks[3]
      }
    });
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to run diagnostic tests',
      error: err.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'setup_database') {
      // تنفيذ سكريبت إعداد قاعدة البيانات
      const result = await runSetupDBScript();
      
      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: 'تم إعداد قاعدة البيانات بنجاح',
          details: result.details
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'فشل إعداد قاعدة البيانات',
          details: result.details
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'إجراء غير معروف' 
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error in diagnostic API:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'حدث خطأ أثناء تنفيذ العملية',
    }, { status: 500 });
  }
}

// Function to run the database setup script
async function runSetupDBScript(): Promise<{ success: boolean; details: string }> {
  return new Promise((resolve) => {
    try {
      // تحديد مسار سكريبت الإعداد بشكل صحيح باستخدام مسار نسبي من جذر المشروع
      const scriptPath = path.join(process.cwd(), 'scripts', 'init-pg-db.js');
      
      // تنفيذ السكريبت باستخدام Node.js
      const child = spawn('node', [scriptPath]);
      
      let output = '';
      let errorOutput = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            details: output
          });
        } else {
          resolve({
            success: false,
            details: `Exit code: ${code}\nOutput: ${output}\nErrors: ${errorOutput}`
          });
        }
      });
    } catch (error: any) {
      resolve({
        success: false,
        details: `Error starting script: ${error.message}`
      });
    }
  });
}

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // Try to get a single row from the table
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('does not exist')) {
      return false;
    }
    
    return true;
  } catch (err) {
    return false;
  }
}