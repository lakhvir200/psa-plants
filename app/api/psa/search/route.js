import dbConnect, { pool } from "../../../util/dbpg";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Ensure database is connected
    await dbConnect();

    // Parse query parameters
    const params = Object.fromEntries(new URL(req.url).searchParams);
   // const { search, department, equipment_name, hosp_name, category,equip_status } = params;
    const { search} = params;
    
    // Initialize the base query
    let query = `SELECT * FROM public.hospital_data WHERE 1=1`;
    const values = [];

    // Add search filter if provided
    if (search) {
       
      query += `
        AND (
          specification ILIKE '%' || $1 || '%'
          OR customer_name ILIKE '%' || $1 || '%'
          OR state ILIKE '%' || $1 || '%'
          OR city ILIKE '%' || $1 || '%'  
          OR model ILIKE '%' || $1 || '%'           
        )
      `;
      values.push(search);
    }

    // // Add department filter if provided
    // if (department) {
    //   query += ` AND department = $${values.length + 1}`;
    //   values.push(department);
    // }
    // if (equipment_name) {
    //   query += ` AND equipment_name = $${values.length + 1}`;
    //   values.push(equipment_name);
    // }
    // if (equip_status) {
    //   query += ` AND equip_status = $${values.length + 1}`;
    //   values.push(equip_status);
    // }
    // if (hosp_name) {
    //   query += ` AND hosp_name = $${values.length + 1}`;
    //   values.push(hosp_name);
    // }
    // if ( category) {
    //   query += ` AND  category = $${values.length + 1}`;
    //   values.push( category);
    // }

    // Execute the query with dynamic parameters
    const result = await pool.query(query, values);

    // Check if rows are returned
    // if (!result.rows.length) {
    //   return NextResponse.json(
    //     { message: "No data found" },
    //     { status: 404 }
    //   );
    // }

    // Return the result rows
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

