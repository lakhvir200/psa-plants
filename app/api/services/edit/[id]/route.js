import dbConnect, { pool } from "../../../../util/dbpg";
import { NextResponse } from "next/server";

// GET handler for fetching service record by ID
export async function GET(request, context) {
  const { id } = await context.params;
  console.log("Got id from frontend:", id);

  try {
    await dbConnect();
    const query = `
      SELECT 
        service_records.*, 
        hospital_data.customer_name, 
        hospital_data.model, 
        hospital_data.state, 
        hospital_data.city,
        hospital_data.service_hrs 
      FROM service_records
      INNER JOIN hospital_data 
        ON service_records.psa_id = hospital_data.psa_id 
      WHERE service_records.id = $1;
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

// PUT handler for updating service record by ID
// export async function PUT(request, context) {
//   const { id } = await context.params;
//   console.log("Received id for update:", id);

//   try {
//     await dbConnect();
//     const data = await request.json();
//     const {
//       current_hrs,
//       is_active,
//       next_service_due,
//       notes,
//       serviced_on,
//       psa_id,
//       rate,
//       amount,
//     } = data;

//     const query = `
//       UPDATE service_records
//       SET 
//         current_hrs = COALESCE($1, current_hrs),
//         is_active = COALESCE($2, is_active),
//         next_service_due = COALESCE($3, next_service_due),
//         notes = COALESCE($4, notes),
//         serviced_on = COALESCE($5, serviced_on),
//         psa_id = COALESCE($6, psa_id),
//         rate = COALESCE($7, rate),
//         amount = COALESCE($8, amount)
//       WHERE id = $9
//       RETURNING *;
//     `;

//     const values = [
//       current_hrs ?? null,
//       is_active ?? null,
//       next_service_due ?? null,
//       notes ?? null,
//       serviced_on ?? null,
//       psa_id ?? null,
//       rate ?? null,
//       amount ?? null,
//       id,
//     ];

//     const result = await pool.query(query, values);

//     if (result.rowCount === 0) {
//       return new NextResponse(
//         JSON.stringify({ message: "Update failed, no matching record found" }),
//         {
//           status: 404,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     return new NextResponse(JSON.stringify(result.rows[0]), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("Database Update Error:", err.message);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }
// PUT handler for inserting new record and deactivating the previous one
export async function PUT(request, context) {
  const { id } = await context.params;
  console.log("Received id for update:", id);

  try {
    await dbConnect();

    const data = await request.json();
    const {
      current_hrs,
      next_service_due,
      notes,
      serviced_on,
      psa_id,
      rate,
      amount,
      is_active,
      nature_of_service,     // NEW FIELD
      expenses       // NEW FIELD
    } = data;

    const query = `
      UPDATE service_records
      SET 
        current_hrs = COALESCE($1, current_hrs),
        next_service_due = COALESCE($2, next_service_due),
        notes = COALESCE($3, notes),
        serviced_on = COALESCE($4, serviced_on),
        psa_id = COALESCE($5, psa_id),
        rate = COALESCE($6, rate),
        amount = COALESCE($7, amount),
        is_active = COALESCE($8, is_active),
        nature_of_service = COALESCE($9, nature_of_service),
        expenses = COALESCE($10,expenses)
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      current_hrs ?? null,
      next_service_due ?? null,
      notes ?? null,
      serviced_on ?? null,
      psa_id ?? null,
      rate ?? null,
      amount ?? null,
      is_active ?? null,
      nature_of_service ?? null,
      expenses ?? null,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Update failed, no matching record found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Database Update Error:", err.message);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
