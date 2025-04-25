import dbConnect, { pool } from "../../../util/dbpg";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    // Fetch the last psa_id from the database
    const lastPsaQuery = `SELECT psa_id FROM public."hospital_data" ORDER BY id DESC LIMIT 1;`;
    const lastPsaResult = await pool.query(lastPsaQuery);

    let newPsaId;
    if (lastPsaResult.rowCount === 0) {
      newPsaId = "PSA001"; // If no previous records, start from PSA001
    } else {
      const lastPsaId = lastPsaResult.rows[0].psa_id;
      const lastNumber = parseInt(lastPsaId.replace("PSA", ""), 10) + 1;
      newPsaId = `PSA${lastNumber.toString().padStart(3, "0")}`; // Format as PSA031, PSA032, etc.
    }

    console.log("Generated PSA ID:", newPsaId);

    const data = await request.json();
    const {
      customer_name,
      state,
      model,
      specification,
      remarks,
      date_of_purchase,
      date_of_installation,
      is_active,
      city,
      supplier,
    } = data;

    const query = `
      INSERT INTO public."hospital_data" (
        psa_id, customer_name, state, model, specification, remarks, 
        date_of_purchase, date_of_installation, is_active, city, supplier, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
      ) RETURNING *;
    `;

    const values = [
      newPsaId,
      customer_name,
      state,
      model,
      specification,
      remarks,
      date_of_purchase,
      date_of_installation,
      is_active,
      city,
      supplier,
    ];

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
