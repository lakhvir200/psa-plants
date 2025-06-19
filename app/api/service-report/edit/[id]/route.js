import dbConnect, { pool } from "../../../../util/dbpg";
import { NextResponse } from "next/server";

// This function runs when a GET request is made to /api/service-report/edit/:id
export async function GET(request, context) {
  const { id } = context.params; // id from frontend route becomes psa_id here
  const psa_id = id; // optional clarity
  console.log("Fetching service reports for PSA ID:", psa_id);

  try {
    await dbConnect();

    const query = `
      SELECT id, psa_id, service_date, file_url, remarks
      FROM service_reports
      WHERE psa_id = $1
    `;

    const result = await pool.query(query, [psa_id]);

    return NextResponse.json(result.rows); // send array of records
  } catch (err) {
    console.error("Error fetching service reports:", err);
    return NextResponse.json(
      { error: "Failed to fetch service reports" },
      { status: 500 }
    );
  }
}
