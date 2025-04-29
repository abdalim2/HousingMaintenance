import { NextResponse } from 'next/server';
import { query } from '@/lib/neondb';

export async function GET(request: Request) {
  try {
    console.log('[API] GET /api/housing/rooms - Starting request');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    
    console.log(`[API] Fetching rooms for buildingId: ${buildingId || 'all'}`);
    
    // Build SQL query
    let sqlQuery = 'SELECT * FROM rooms';
    const params: any[] = [];
    
    // Add filters
    if (buildingId) {
      sqlQuery += ' WHERE building_id = $1';
      params.push(buildingId);
    }
    
    // Execute query with detailed error handling
    try {
      const result = await query(sqlQuery, params);
      
      console.log(`[API] Successfully fetched ${result.rows.length} rooms`);
      return NextResponse.json(result.rows || []);
    } catch (queryError: any) {
      console.error('[API] Exception during query execution:', queryError);
      return NextResponse.json(
        { error: `Query execution failed: ${queryError.message}` }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Unexpected error in rooms API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms: ' + (error.message || 'Unknown error') }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const room = await request.json();
    
    // Validate required fields
    if (!room.building_id || !room.room_number || !room.type || room.floor === undefined) {
      return NextResponse.json(
        { error: 'Building ID, room number, floor, and type are required' }, 
        { status: 400 }
      );
    }
    
    // Extract fields from room object
    const fields = Object.keys(room);
    const values = fields.map((field) => room[field]);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    
    // Build INSERT query
    const sqlQuery = 
      `INSERT INTO rooms (${fields.join(', ')}) 
       VALUES (${placeholders})
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Failed to create room' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error creating room:', error);
    return NextResponse.json(
      { error: `Failed to create room: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const { id, ...roomData } = updates;
    
    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }
    
    // Build the SET part of the query
    const fields = Object.keys(roomData);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    
    // Build values array
    const values = [id, ...fields.map(field => roomData[field])];
    
    // Build UPDATE query
    const sqlQuery = 
      `UPDATE rooms 
       SET ${setClause}
       WHERE id = $1
       RETURNING *`;
    
    const result = await query(sqlQuery, values);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Room not found or no changes made' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Unexpected error updating room:', error);
    return NextResponse.json(
      { error: `Failed to update room: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }
    
    // Delete room
    const sqlQuery = 'DELETE FROM rooms WHERE id = $1';
    const result = await query(sqlQuery, [id]);
    
    if (!result.rowCount) {
      return NextResponse.json(
        { error: 'Room not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting room:', error);
    return NextResponse.json(
      { error: `Failed to delete room: ${error.message}` }, 
      { status: 500 }
    );
  }
}