import { NextResponse } from 'next/server';
import { query } from '@/lib/neondb';

export async function GET(request: Request) {
  try {
    console.log('[API] GET /api/housing/buildings - Starting request');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const complexId = searchParams.get('complexId');
    
    console.log(`[API] Fetching buildings for complexId: ${complexId || 'all'}`);
    
    // Build SQL query
    let sqlQuery = 'SELECT * FROM buildings';
    const params: any[] = [];
    
    // Add filters
    if (complexId) {
      sqlQuery += ' WHERE complex_id = $1';
      params.push(complexId);
    }
    
    // Execute query with detailed error handling
    try {
      const result = await query(sqlQuery, params);
      
      console.log(`[API] Successfully fetched ${result.rows.length} buildings`);
      return NextResponse.json(result.rows || []);
    } catch (queryError: any) {
      console.error('[API] Exception during query execution:', queryError);
      return NextResponse.json(
        { error: `Query execution failed: ${queryError.message}` }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Unexpected error in buildings API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buildings: ' + (error.message || 'Unknown error') }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const building = await request.json();
    
    // Validate required fields
    if (!building.name || !building.complex_id) {
      return NextResponse.json(
        { error: 'Building name and complex ID are required' }, 
        { status: 400 }
      );
    }
    
    // Extract fields from building object
    const fields = Object.keys(building);
    const values = fields.map((field) => building[field]);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    
    // Build INSERT query
    const sqlQuery = 
      `INSERT INTO buildings (${fields.join(', ')}) 
       VALUES (${placeholders})
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Failed to create building' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error creating building:', error);
    return NextResponse.json(
      { error: `Failed to create building: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const { id, ...buildingData } = updates;
    
    if (!id) {
      return NextResponse.json({ error: 'Building ID is required' }, { status: 400 });
    }
    
    // Build the SET part of the query
    const fields = Object.keys(buildingData);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    
    // Build values array
    const values = [id, ...fields.map(field => buildingData[field])];
    
    // Build UPDATE query
    const sqlQuery = 
      `UPDATE buildings 
       SET ${setClause}
       WHERE id = $1
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Building not found or no changes made' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error updating building:', error);
    return NextResponse.json(
      { error: `Failed to update building: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Building ID is required' }, { status: 400 });
    }
    
    // Delete building
    const sqlQuery = 'DELETE FROM buildings WHERE id = $1';
    const result = await query(sqlQuery, [id]);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Building not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting building:', error);
    return NextResponse.json(
      { error: `Failed to delete building: ${error.message}` }, 
      { status: 500 }
    );
  }
}