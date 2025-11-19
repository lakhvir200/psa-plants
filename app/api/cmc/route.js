import dbConnect, { pool } from "../../util/dbpg";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await dbConnect();
    const query = `
    SELECT 
        cmc_amc.*, 
        hospital_data.customer_name, 
        hospital_data.specification, 
        hospital_data.model, 
        hospital_data.state, 
        hospital_data.city 
    FROM  
        cmc_amc 
    INNER JOIN  
        hospital_data 
    ON  
        cmc_amc.psa_id = hospital_data.psa_id 
        WHERE 
      cmc_amc.is_active = true
    
    ORDER BY end_date ;
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
// export async function POST(request) {
//   try {
//     await dbConnect();

//     const data = await request.json();
//     console.log("Received request data:", data);

//     const {
//       psa_id,
//       amc_cmc,
//       start_date,
//       end_date,
//       rate,
//       amount,
//       remarks,
//       is_active
//     } = data;

//     if (!psa_id) {
//       return new NextResponse(
//         JSON.stringify({ error: "Missing psa_id in request body" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // 1️⃣ Deactivate all previous active records FIRST
//     const deactivateQuery = `
//       UPDATE public.cmc_amc
//       SET is_active = FALSE
//       WHERE psa_id = $1;
//     `;
//     await pool.query(deactivateQuery, [psa_id]);

//     // 2️⃣ Insert the new record (always active by default)
//     const insertQuery = `
//       INSERT INTO public.cmc_amc (
//         psa_id, amc_cmc, start_date, end_date, rate, amount, remarks, is_active
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
//       RETURNING *;
//     `;

//     const values = [
//       psa_id,
//       amc_cmc || null,
//       start_date || null,
//       end_date || null,
//       rate || null,
//       amount || null,
//       remarks || null
//     ];

//     console.log("Executing INSERT with values:", values);

//     const result = await pool.query(insertQuery, values);

//     return new NextResponse(JSON.stringify(result.rows[0]), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });

//   } catch (err) {
//     console.error("Database Insert Error:", err.message);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

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

    // 1️⃣ Insert new record (always active)
    const insertQuery = `
      INSERT INTO public.cmc_amc (
        psa_id,
        amc_cmc,
        start_date,
        end_date,
        rate,
        amount,
        remarks,
        is_active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE)
      RETURNING *;
    `;

    const insertValues = [
      psa_id,
      amc_cmc || null,
      start_date || null,
      end_date || null,
      rate || null,
      amount || null,
      remarks || null,
    ];

    const result = await pool.query(insertQuery, insertValues);
    const newRecord = result.rows[0];

    // 2️⃣ Deactivate all previous records of this psa_id EXCEPT newly inserted one
    const deactivateQuery = `
      UPDATE public.cmc_amc
      SET is_active = FALSE
      WHERE psa_id = $1 AND id <> $2;
    `;

    await pool.query(deactivateQuery, [psa_id, newRecord.id]);

    // 3️⃣ Return response
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
