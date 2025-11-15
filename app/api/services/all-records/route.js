import dbConnect, { pool } from "../../../util/dbpg";
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
ORDER BY   
    hospital_data.customer_name  ASC;
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
