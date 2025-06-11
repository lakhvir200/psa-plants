import dbConnect, { pool } from "../../../../util/dbpg";
import { NextResponse } from "next/server";

// GET handler for fetching equipment by ID
export async function GET(request, context) {
  const { psa_id } =await context.params;

  console.log("Reached GET route", psa_id);
  try {
    await dbConnect();
    
    const query = `
      SELECT * 
      FROM public.hospital_data 
      WHERE psa_id = $1;
    `;
    const values = [psa_id];
    const result = await pool.query(query, values);

    if (!result.rows || result.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Database Query Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT handler for updating equipment data
export async function PUT(request, context) {
  const { psa_id } = await context.params; // FIXED: Removed await
  try {
    await dbConnect();
    
    const data = await request.json();
    const {
      customer_name,
      state,
      city,
      model,
      date_of_installation,
      date_of_purchase,
      service_hrs,
      specification,
      remarks,
      is_active,
      supplier // ADDED supplier field
    } = data;
    
    const query = `
      UPDATE public.hospital_data 
      SET 
        customer_name = COALESCE($1, customer_name),
        state = COALESCE($2, state),
        city = COALESCE($3, city),
        model = COALESCE($4, model),
        date_of_installation = COALESCE($5, date_of_installation),
        date_of_purchase = COALESCE($6, date_of_purchase),
        service_hrs= COALESCE($7,  service_hrs),
        specification = COALESCE($8, specification),
        remarks = COALESCE($9, remarks),
        is_active = COALESCE($10, is_active),
        supplier = COALESCE($11, supplier) -- FIXED: Correct parameter index
      WHERE psa_id = $12
      RETURNING *;
    `;

    const values = [
      customer_name || null,
      state || null,
      city || null,
      model || null,
      date_of_installation || null,
      date_of_purchase || null,
      service_hrs || null,
      specification || null,
      remarks || null,
      is_active || null,
      supplier || null, // FIXED: Correct position
      psa_id // FIXED: Correct position
    ];

    const result = await pool.query(query, values);
    
    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: "Update failed, no matching record found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Database Update Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

