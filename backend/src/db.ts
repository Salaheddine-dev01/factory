import mysql from "mysql2/promise";

// Create a pool of connections
const pool = mysql.createPool({
  host: "localhost",       // your DB host
  user: "root",            // your DB user
  password: "CCSALA772005",            // your DB password
  database: "factory_db",  // your database name
  waitForConnections: true,
  connectionLimit: 10,     // max concurrent connections
  queueLimit: 0
});

export default pool; // <-- this is what allows other files to import it
