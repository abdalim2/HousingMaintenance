import { NextResponse } from 'next/server';
import { query } from '@/lib/neondb';

export async function GET(request: Request) {
  try {
    console.log('[API] GET /api/housing/floors - Starting request');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    
    console.log(`[API] Fetching floors for buildingId: ${buildingId || 'all'}`);
    
    // Build SQL query
    let sqlQuery = 'SELECT * FROM floors';
    const params: any[] = [];
    
    // Add filters
    if (buildingId) {
      sqlQuery += ' WHERE building_id = $1';
      params.push(buildingId);
    }
    
    sqlQuery += ' ORDER BY floor_number';
    
    // Execute query with detailed error handling
    try {
      const result = await query(sqlQuery, params);
      
      console.log(`[API] Successfully fetched ${result.rows.length} floors`);
      return NextResponse.json(result.rows || []);
    } catch (queryError: any) {
      console.error('[API] Exception during query execution:', queryError);
      return NextResponse.json(
        { error: `Query execution failed: ${queryError.message}` }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Unexpected error in floors API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch floors: ' + (error.message || 'Unknown error') }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const floor = await request.json();
    
    // Validate required fields
    if (!floor.building_id || floor.floor_number === undefined) {
      return NextResponse.json(
        { error: 'Building ID and floor number are required' }, 
        { status: 400 }
      );
    }
    
    // Extract fields from floor object
    const fields = Object.keys(floor);
    const values = fields.map((field) => floor[field]);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    
    // Build INSERT query
    const sqlQuery = 
      `INSERT INTO floors (${fields.join(', ')}) 
       VALUES (${placeholders})
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Failed to create floor' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error creating floor:', error);
    return NextResponse.json(
      { error: `Failed to create floor: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const { id, ...floorData } = updates;
    
    if (!id) {
      return NextResponse.json({ error: 'Floor ID is required' }, { status: 400 });
    }
    
    // Build the SET part of the query
    const fields = Object.keys(floorData);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    
    // Build values array
    const values = [id, ...fields.map(field => floorData[field])];
    
    // Build UPDATE query
    const sqlQuery = 
      `UPDATE floors 
       SET ${setClause}
       WHERE id = $1
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Floor not found or no changes made' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error updating floor:', error);
    return NextResponse.json(
      { error: `Failed to update floor: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Floor ID is required' }, { status: 400 });
    }
    
    // Delete floor
    const sqlQuery = 'DELETE FROM floors WHERE id = $1';
    const result = await query(sqlQuery, [id]);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Floor not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting floor:', error);
    return NextResponse.json(
      { error: `Failed to delete floor: ${error.message}` }, 
      { status: 500 }
    );
  }
}