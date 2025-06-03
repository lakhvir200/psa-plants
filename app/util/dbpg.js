// import { Pool } from "pg"; // Correct class name is Pool

// // Create a connection pool
// export const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "equipments",
//   password: "123$abc" ,// Fixed typo in environment variable name
//   port: "5432",
//   // user: process.env.USER_NAME,
//   // host: process.env.HOST_NAME,
//   // database: process.env.DB_NAME_PG,
//   // password: process.env.DB_PASSWORD_PG ,// Fixed typo in environment variable name
//   // port: process.env.PORT_NUMBER,
// });

// // Database connection check
// export default async function dbConnect() {
//   try {
//     // Connect to the pool
//     const client = await pool.connect();
    
//     try {
//       // Execute a test query
//       const result = await client.query("SELECT NOW()");
//      // console.log("Connected to Database:", result.rows);
//     } finally {
//       // Always release the client back to the pool
//       client.release();
//     }
//   } catch (err) {
//     console.error("Database connection error:", err.stack);
//   }
// }
// util/dbpg.js

import { Pool } from "pg";

// Create a connection pool using DATABASE_URL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,


  ssl: {
    rejectUnauthorized: false, // required for Neon and some hosted Postgres providers
  },
});

// Optional: Database connection check
export default async function dbConnect() {
  try {
    const client = await pool.connect();
    //console.log(client)
    try {
      const result = await client.query("SELECT NOW()");
     // console.log("Connected to Database:", result.rows);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database connection error:", err.stack);
  }
}
