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
  // Await context.params to access id
  const params = await context.params;
  const { id } = params;
  console.log("Received id:", id);

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
      psa_id,
    } = data;

    const updateQuery = `
      UPDATE cmc_amc
      SET
        amc_cmc = $1,
        start_date = $2,
        end_date = $3,
        rate = $4,
        amount = $5,
        remarks = $6,
        is_active = $7,
        psa_id = $8
      WHERE id = $9
      RETURNING *;
    `;

    const updateValues = [
      amc_cmc ?? null,
      start_date ?? null,
      end_date ?? null,
      rate ?? null,
      amount ?? null,
      remarks ?? null,
      is_active ?? true,
      psa_id ?? null,
      id,
    ];

    const result = await pool.query(updateQuery, updateValues);

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
