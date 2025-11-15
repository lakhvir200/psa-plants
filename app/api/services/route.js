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
    hospital_data.model, 
    hospital_data.state, 
    hospital_data.city,
    hospital_data.service_hrs 
FROM  
    service_records
INNER JOIN  
    hospital_data 
ON  
    service_records.psa_id = hospital_data.psa_id 
WHERE 
     service_records.is_active = true
ORDER BY   
    service_records.serviced_on ASC;

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

    const {
      current_hrs,
      is_active,
      next_service_due,
      notes,
      serviced_on,
      psa_id,
      rate,
      amount,
      nature_of_service,
      expenses
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

    // 1️⃣ Insert new record
    const insertQuery = `
      INSERT INTO public.service_records (
        current_hrs,
        is_active,
        next_service_due,
        notes,
        serviced_on,
        psa_id,
        rate,
        amount,
        nature_of_service,
        expenses
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const insertValues = [
      current_hrs || null,
      true,   // new record is always active
      next_service_due || null,
      notes || null,
      serviced_on || null,
      psa_id,
      rate || null,
      amount || null,
      nature_of_service || null,
      expenses || null
    ];

    const result = await pool.query(insertQuery, insertValues);
    const newRecord = result.rows[0];

    // 2️⃣ Deactivate all previous records of this psa_id
    const deactivateQuery = `
      UPDATE public.service_records
      SET is_active = FALSE
      WHERE psa_id = $1 AND id <> $2;
    `;

    await pool.query(deactivateQuery, [psa_id, newRecord.id]);

    // 3️⃣ Return the new record
    return new NextResponse(JSON.stringify(newRecord), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Database Insert Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
