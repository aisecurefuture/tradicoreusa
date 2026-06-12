'use strict'

const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  console.warn('[db] DATABASE_URL not set — database features will be unavailable')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message)
})

module.exports = pool
