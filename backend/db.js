const mysql = require('mysql2/promise');

let pool;

async function createMysqlPool() {
  const host = process.env.MYSQLHOST || process.env.DB_HOST;
  const user = process.env.MYSQLUSER || process.env.DB_USER;
  const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
  const database = process.env.MYSQLDATABASE || process.env.DB_NAME;
  
  // Logical port selection: 
  // 1. Use MYSQLPORT if defined (internal Railway)
  // 2. If MYSQLHOST is present, it's likely internal Railway -> use 3306
  // 3. Else use DB_PORT or default to 3306
  let port = process.env.MYSQLPORT;
  if (!port) {
    if (process.env.MYSQLHOST) {
      port = 3306;
    } else {
      port = process.env.DB_PORT || 3306;
    }
  }

  if (!host || !user || !database) {
    throw new Error(`Missing required DB config. Ensure MYSQLHOST/DB_HOST, MYSQLUSER/DB_USER, and MYSQLDATABASE/DB_NAME are set.`);
  }

  console.log(`Connecting to DB at ${host}:${port} as ${user}...`);

  return mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: Number(port),
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000
  });
}

async function getPool() {
  if (!pool) {
    console.log('Creating new MySQL pool...');
    pool = await createMysqlPool();
    console.log('Pool created successfully.');
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
