import dbConnect, { pool } from "../../../util/dbpg";
import { NextResponse } from "next/server";

// GET handler for fetching equipment by ID
export async function GET(request, { params }) {
  const { psa_id } = params;

  console.log("Reached GET route", psa_id);
  try {
   

    // Ensure database connection
    await dbConnect();

    // Execute the query with PostgreSQL pool
    const query = `
    SELECT * 
    FROM public.hospital_data 
    WHERE psa_id = $1;
  `;
  const values = [psa_id];
  const result = await pool.query(query, values);

    // Check if the result contains data
    if (!result.rows || result.rows.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the first record
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
