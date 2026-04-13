const mysql = require('mysql2/promise');

let pool;

async function createMysqlPool() {
  const host = process.env.MYSQLHOST || process.env.DB_HOST;
  const user = process.env.MYSQLUSER || process.env.DB_USER;
  const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
  const database = process.env.MYSQLDATABASE || process.env.DB_NAME;
  const port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;

  if (!host || !user || !database) {
    throw new Error(`Missing required DB config. Ensure MYSQLHOST/DB_HOST, MYSQLUSER/DB_USER, and MYSQLDATABASE/DB_NAME are set.`);
  }

  return mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: Number(port),
    waitForConnections: true,
    connectionLimit: 10
  });
}

async function getPool() {
  if (!pool) {
    pool = await createMysqlPool();
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  createMysqlPool,
  getPool,
  closePool
};
