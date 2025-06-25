import dbConnect, { pool } from "../../../../util/dbpg";
import { NextResponse } from "next/server";

// GET handler for fetching equipment by ID
export async function GET(request, context) {
  const { id } = await context.params;

  console.log(" Reached cmc GET route", id);
  try {
    await dbConnect();
    const query = `
    SELECT 
        cmc_amc.*, 
        hospital_data.customer_name, 
        hospital_data.specification, 
        hospital_data.state, 
        hospital_data.city 
    FROM  
        cmc_amc 
    INNER JOIN  
        hospital_data 
    ON  
        cmc_amc.psa_id = hospital_data.psa_id 
    WHERE 
        cmc_amc.id = $1 
    ORDER BY   
         cmc_amc.psa_id;
    `;
    const values = [id];
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

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();
    console.log("Received request data:", data);

    const {
      psa_id,
      amc_cmc,
      start_date,
      end_date,
      rate,
      amount,
      remarks,
      is_active
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
      INSERT INTO public.cmc_amc (
        psa_id, amc_cmc, start_date, end_date, rate, amount, remarks, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      psa_id,
      amc_cmc || null,
      start_date || null,
      end_date || null,
      rate || null,
      amount || null,
      remarks || null,
      is_active || null
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

export async function PUT(request, context) {
  const { id } = context.params; // Correct: no need for 'await'
  console.log("Received id:", id); // Log psa_id

  try {
    await dbConnect();

    const data = await request.json();
    console.log("Received request data:", data);

    const {
      amc_cmc,
      start_date,
      end_date,
      rate,
      amount,
      remarks,
      is_active,
      psa_id
    } = data;
    // Begin transaction
    await pool.query("BEGIN");
    // Step 1: Mark previous record as inactive
    const deactivateQuery = `
      UPDATE cmc_amc
      SET is_active = false
      WHERE id = $1;
    `;
    await pool.query(deactivateQuery, [id]);

    // Step 2: Insert new record
    const insertQuery = `
  INSERT INTO public.cmc_amc (
    amc_cmc,
    start_date,
    end_date,
    rate,
    amount,
    remarks,
    is_active,
    psa_id
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;
`;
    const insertValues = [
      amc_cmc ?? null,
      start_date ?? null,
      end_date ?? null,
      rate ?? null,
      amount ?? null,
      remarks ?? null,
      is_active ?? true, // default to true if not provided
      psa_id ?? null,            // assuming psa_id maps to id field
    ];
    const insertResult = await pool.query(insertQuery, insertValues);
    // Commit transaction
    await pool.query("COMMIT");

    return new NextResponse(JSON.stringify(insertResult.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Rollback on error
    await pool.query("ROLLBACK");
    console.error("Database Transaction Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = context.params;
  console.log("Received psa_id for deletion:", id);
  try {
    await dbConnect();

    const query = `
      DELETE FROM public.cmc_amc
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
