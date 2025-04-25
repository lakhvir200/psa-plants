//import dbConnect, { pool } from "../../util/dbpg";
import dbConnect, { pool } from "../../../util/dbpg";
import { NextResponse } from "next/server";
export async function GET() { 
  try {  
    await dbConnect();
    const result = await pool.query(
       "SELECT * FROM hospital_data ORDER BY psa_id"
    );  
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
