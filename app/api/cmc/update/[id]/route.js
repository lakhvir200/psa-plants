
import dbConnect, { pool } from "../../../../util/dbpg";
import { NextResponse } from "next/server";

export async function PUT(request, context) {
  const { id } = await context.params; 
  const data = await request.json();

  const {
    amc_cmc, start_date, end_date,
    rate, amount, remarks,
    is_active = true, psa_id
  } = data;

  try {
    await dbConnect();
    const updateQuery = `
      UPDATE cmc_amc
      SET
        amc_cmc = $2,
        start_date = $3,
        end_date = $4,
        rate = $5,
        amount = $6,
        remarks = $7,
        is_active = $8,
        psa_id = $9
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, amc_cmc, start_date, end_date, rate, amount, remarks, is_active, psa_id];
    const result = await pool.query(updateQuery, values);

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Update error:", err.message);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
}
