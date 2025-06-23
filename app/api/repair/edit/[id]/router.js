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
        repair_maint.*, 
        hospital_data.customer_name, 
        hospital_data.model, 
        hospital_data.state, 
        hospital_data.city,        
      FROM repair_maint
      INNER JOIN hospital_data 
        ON repair_maint.psa_id = hospital_data.psa_id 
      WHERE repair_maint.id = $1;
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
  console.log("Received ID to update repair_maint record");

  try {
    await dbConnect();
    const data = await request.json();

    const {
      psa_id,
      repair_date,
      fault_description,
      action_taken,
      status,
      spare_used,
      cost_of_spares,
      attended_by,
      remarks
    } = data;

    // Begin transaction
    await pool.query("BEGIN");

    // Update repair_maint record
    const updateQuery = `
      UPDATE repair_maint
      SET
        psa_id = $2,
        repair_date = $3,
        fault_description = $4,
        action_taken = $5,
        status = $6,
        spare_used = $7,
        cost_of_spares = $8,
        attended_by = $9,
        remarks = $10
      WHERE id = $1
      RETURNING *;
    `;

    const values = [
      id,
      psa_id,
      repair_date,
      fault_description,
      action_taken,
      status,
      spare_used,
      cost_of_spares,
      attended_by,
      remarks
    ];

    const result = await pool.query(updateQuery, values);

    // Commit transaction
    await pool.query("COMMIT");

    return new NextResponse(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
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
      DELETE FROM repair_maint
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
