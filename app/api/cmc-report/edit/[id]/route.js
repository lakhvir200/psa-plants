import dbConnect, { pool } from "../../../../util/dbpg";
import { NextResponse } from "next/server";

// This function runs when a GET request is made to /api/service-report/edit/:id
export async function GET(request, context) {
  const { id } = await context.params; // get `id` from route like /api/cmc/[id]
  const psa_id = id;

  console.log("Fetching CMC for PSA ID:", psa_id);

  try {
    await dbConnect(); // optional if your pool already handles this

    const query = `
      SELECT id, psa_id, start_date, end_date, file_url, remarks
      FROM cmc_reports
       WHERE psa_id = $1    
    `;

    const result = await pool.query(query, [psa_id]);

    console.log("Result CMC for PSA ID:", result.rows);

    return NextResponse.json(result.rows); // Send array of CMC records
  } catch (err) {
    console.error("Error fetching CMC reports:", err);

    return NextResponse.json(
      { error: "Failed to fetch CMC reports" },
      { status: 500 }
    );
  }
}
export async function DELETE(request, context) {
  const { id } = context.params;
  console.log("Received psa_id for deletion:", id);
  try {
    await dbConnect();

    const query = `
      DELETE FROM public.cmc_reports
      WHERE id = $1
      RETURNING *;
    `;

    const values = [id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Delete failed, no matching record found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Delete successful:", result.rows[0]);

    return new NextResponse(
      JSON.stringify({ message: "Record deleted successfully", data: result.rows[0] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Database Delete Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
