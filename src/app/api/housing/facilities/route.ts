import { NextResponse } from 'next/server';
import { query } from '@/lib/neondb';

export async function GET(request: Request) {
  try {
    console.log('[API] GET /api/housing/facilities - Starting request');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const complexId = searchParams.get('complexId');
    const buildingId = searchParams.get('buildingId');
    
    console.log(`[API] Fetching facilities for complexId: ${complexId || 'all'}, buildingId: ${buildingId || 'all'}`);
    
    // Build SQL query
    let sqlQuery = 'SELECT * FROM facilities';
    const params: any[] = [];
    let paramIndex = 1;
    
    // Add filters
    if (complexId || buildingId) {
      sqlQuery += ' WHERE';
      
      if (complexId) {
        sqlQuery += ` complex_id = $${paramIndex}`;
        params.push(complexId);
        paramIndex++;
      }
      
      if (buildingId) {
        if (complexId) sqlQuery += ' AND';
        sqlQuery += ` building_id = $${paramIndex}`;
        params.push(buildingId);
      }
    }
    
    // Execute query with detailed error handling
    try {
      const result = await query(sqlQuery, params);
      
      console.log(`[API] Successfully fetched ${result.rows.length} facilities`);
      return NextResponse.json(result.rows || []);
    } catch (queryError: any) {
      console.error('[API] Exception during query execution:', queryError);
      return NextResponse.json(
        { error: `Query execution failed: ${queryError.message}` }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Unexpected error in facilities API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facilities: ' + (error.message || 'Unknown error') }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const facility = await request.json();
    
    // Validate required fields
    if (!facility.name || !facility.type || !facility.complex_id || !facility.location_description) {
      return NextResponse.json(
        { error: 'Name, type, complex_id, and location_description are required' }, 
        { status: 400 }
      );
    }
    
    // Extract fields from facility object
    const fields = Object.keys(facility);
    const values = fields.map((field) => facility[field]);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    
    // Build INSERT query
    const sqlQuery = 
      `INSERT INTO facilities (${fields.join(', ')}) 
       VALUES (${placeholders})
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Failed to create facility' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error creating facility:', error);
    return NextResponse.json(
      { error: `Failed to create facility: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const { id, ...facilityData } = updates;
    
    if (!id) {
      return NextResponse.json({ error: 'Facility ID is required' }, { status: 400 });
    }
    
    // Build the SET part of the query
    const fields = Object.keys(facilityData);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    
    // Build values array
    const values = [id, ...fields.map(field => facilityData[field])];
    
    // Build UPDATE query
    const sqlQuery = 
      `UPDATE facilities 
       SET ${setClause}
       WHERE id = $1
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Facility not found or no changes made' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error updating facility:', error);
    return NextResponse.json(
      { error: `Failed to update facility: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Facility ID is required' }, { status: 400 });
    }
    
    // Delete facility
    const sqlQuery = 'DELETE FROM facilities WHERE id = $1';
    const result = await query(sqlQuery, [id]);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Facility not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting facility:', error);
    return NextResponse.json(
      { error: `Failed to delete facility: ${error.message}` }, 
      { status: 500 }
    );
  }
}