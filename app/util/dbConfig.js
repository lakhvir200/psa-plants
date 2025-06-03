const sql = require('mssql');
const config = {
  user: 'sa', // DB_USER
  password: '123$abc', // DB_PASS
  server: 'TANYA', // DB_SERVER
  database: 'Equipment', // DB_NAME
  options: {
    instanceName: 'SQLEXPRESS', // Extract instance name from DB_INSTANCE_NAME
    encrypt: false, // Disable encryption for local development
    trustServerCertificate: true, // For self-signed certificates
  },
};
let poolPromise;

try {
  poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
      console.log('Connected to MSSQL');
      return pool;
    })
    .catch((err) => {
      console.error('Database Connection Failed! Error:', err.message);
      throw err;
    });
} catch (err) {
  console.error('Error initializing poolPromise:', err.message);
}
export { sql, poolPromise };