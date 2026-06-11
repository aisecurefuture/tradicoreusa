'use strict'

require('dotenv').config()

const { readFileSync, readdirSync } = require('fs')
const path = require('path')
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function migrate() {
  const migrationsDir = path.join(__dirname, '../migrations')

  // Run all .sql files in filename order (001_, 002_, ...)
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  const client = await pool.connect()
  try {
    for (const file of files) {
      const sql = readFileSync(path.join(migrationsDir, file), 'utf8')
      await client.query(sql)
      console.log(`[migrate] Applied ${file}`)
    }
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
  .then(() => {
    console.log('[migrate] Done')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[migrate] Failed:', err.message)
    process.exit(1)
  })
