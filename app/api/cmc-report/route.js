import { put } from '@vercel/blob';
import dbConnect, { pool } from "../../util/dbpg";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const query = `
      SELECT id, psa_id, start_date,end_date, file_url, remarks
      FROM cmc_reports
      
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch service reports:", err);
    return NextResponse.json({ error: "Failed to fetch service reports" }, { status: 500 });
  }
}

// export async function GET() {
//   const { id } = context.params;

//   try {
//     await dbConnect();

//     const query = `
//       SELECT id, psa_id, service_date, file_url, remarks, created_at
//       FROM service_reports
      
//     `;
// //WHERE id = $1
//     const result = await pool.query(query);
// //, [id]
//     if (result.rows.length === 0) {
//       return NextResponse.json({ error: "Report not found" }, { status: 404 });
//     }

//     return NextResponse.json(result.rows[0]);
//   } catch (err) {
//     console.error("Failed to fetch service report:", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  const psa_id = formData.get("psa_id");
  const start_date = formData.get("start_date");
   const end_date = formData.get("end_date");
  const remarks = formData.get("remarks") || null;

  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Max file size is 5MB" }, { status: 400 });
  }
  //console.log("Blob Token:", process.env.BLOB_READ_WRITE_TOKEN);
  try {
    // Upload to Vercel Blob storage
    // const blob = await put(file.name, file, {
      const blob = await put(`cmc-agreements/${file.name}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      // Save metadata to PostgreSQL
      await dbConnect();
      const query = `
      INSERT INTO cmc_reports (psa_id, start_date,end_date, file_url, remarks)
      VALUES ($1, $2, $3, $4,$5)
      RETURNING *
    `;
      const result = await pool.query(query, [
        psa_id,
        start_date,
        end_date,
        blob.url,
        remarks,
      ]);

      return NextResponse.json({
        success: true,
        file_url: blob.url,
        inserted: result.rows[0],
      });
    } catch (err) {
      console.error("Upload or DB insert failed:", err);
      return NextResponse.json({ error: "Upload or DB insert failed" }, { status: 500 });
    }
  }
