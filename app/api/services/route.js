import dbConnect, { pool } from "../../util/dbpg";
import { NextResponse } from "next/server";
export async function GET() { 
  try {  
    await dbConnect();
    const query = `
    SELECT 
        service_records.*, 
        hospital_data.customer_name, 
        hospital_data.specification, 
        hospital_data.state, 
        hospital_data.city ,
        hospital_data.service_hrs 
    FROM  
        service_records
    INNER JOIN  
        hospital_data 
    ON  
        service_records.psa_id = hospital_data.psa_id 
    
    ORDER BY   
         service_records. serviced_on asc;
    `;
    const result = await pool.query(query );  
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

    const {
      current_hrs,
      is_active,
      next_service_due,
      notes,
      serviced_on,
      psa_id,
      rate,
      amount
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
      INSERT INTO public.service_records (
        current_hrs, is_active, next_service_due, notes, serviced_on, psa_id,rate,amount
      )
      VALUES ($1, $2, $3, $4, $5, $6,$7,$8)
      RETURNING *;
    `;

    const values = [
      current_hrs || null,
      is_active ?? true,
      next_service_due || null,
      notes || null,
      serviced_on || null,
      psa_id,
      rate || null,
      amount || null
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
