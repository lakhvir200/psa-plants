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
  console.log("Received id to deactivate, and insert new record");

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
    } = data;

    // Begin transaction
    await pool.query("BEGIN");

    // Step 1: Mark previous record as inactive
    const deactivateQuery = `
      UPDATE service_records
      SET is_active = false
      WHERE id = $1;
    `;
    await pool.query(deactivateQuery, [id]);

    // Step 2: Insert new record
    const insertQuery = `
      INSERT INTO service_records (
        current_hrs,
        is_active,
        next_service_due,
        notes,
        serviced_on,
        psa_id,
        rate,
        amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const insertValues = [
      current_hrs ?? null,
      true, // new record should be active
      next_service_due ?? null,
      notes ?? null,
      serviced_on ?? null,
      psa_id ?? null,
      rate ?? null,
      amount ?? null,
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


// DELETE handler for deleting service record by ID
export async function DELETE(request, context) {
  const { id } = await context.params;
  console.log("Received id for deletion:", id);

  try {
    await dbConnect();
    const query = `
      DELETE FROM service_records
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

    return new NextResponse(
      JSON.stringify({
        message: "Record deleted successfully",
        data: result.rows[0],
      }),
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
