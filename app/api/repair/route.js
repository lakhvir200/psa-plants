import dbConnect, { pool } from "../../util/dbpg";
import { NextResponse } from "next/server";
export async function GET() {

  console.log('api repiair')
  try {
    await dbConnect();
    const query = `
    SELECT 
        repair_maint.*, 
        hospital_data.customer_name, 
        hospital_data.specification, 
        hospital_data.state, 
        hospital_data.city       
    FROM  
        repair_maint
    INNER JOIN  
        hospital_data 
    ON  
        repair_maint.psa_id = hospital_data.psa_id 
    
    ORDER BY   
         repair_maint.psa_id;
    `;
    const result = await pool.query(query);
    if (!result.rows.length) {
      return NextResponse.json(
        { message: "No data found" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    // console.log("Received request data:", data);

    //  id SERIAL PRIMARY KEY,
    // psa_id VARCHAR(50),                
    // repair_date DATE NOT NULL,
    // fault_description TEXT NOT NULL,  -- Changed from fault_found DATE
    // action_taken VARCHAR(50),  
    // status VARCHAR(50),  
    // spare_used VARCHAR(50),  
    // cost_of_spares VARCHAR(50),  
    // attended_by VARCHAR(50), 
    // remarks TEXT,                

    const {
      psa_id,
      repair_date,
      fault_description,
      action_taken,
      status,
      spare_used,
      cost_of_spares,
      attended_by,
      remarks

    } = data;

    if (!psa_id) {
      return new NextResponse(
        JSON.stringify({ error: "Missing psa_id in request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const query = `
      INSERT INTO public.repair_maint (
      psa_id,
      repair_date,
      fault_description,
      action_taken,
      status,
      spare_used,
      cost_of_spares,
      attended_by,
      remarks
        
      )
      VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [
      psa_id,
      repair_date || null,
      fault_description || null,
      action_taken || null,
      status || null,
      spare_used || null,
      cost_of_spares || null,
      attended_by || null,
      remarks || null,
    ];

    console.log("Executing INSERT with values:", values);

    const result = await pool.query(query, values);

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Database Insert Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
