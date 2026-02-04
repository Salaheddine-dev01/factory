import * as dotenv from 'dotenv';
import path from 'path';

// Force load .env from backend/
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import mysql from 'mysql2/promise';

console.log('DB_USER from env:', process.env.DB_USER);

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('DB connection works:', rows);
    await connection.end();
  } catch (err) {
    console.error('DB connection FAILED:', err);
  }
}

test();
