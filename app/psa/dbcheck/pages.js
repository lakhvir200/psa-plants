//import pool from '../../app/util/dbpg';
import pool from '../../util/dbpg';
export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
