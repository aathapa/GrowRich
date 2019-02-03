import { exec, select, insert } from './db'

export function createCategoryTable(db) {
  return exec(db, `
    CREATE TABLE IF NOT EXISTS Categories (
      id TEXT,
      name TEXT type UNIQUE,
      type TEXT,
      isActive BOOLEAN
    )`)
}

export function fetchAllCategory(db) {
  return select(db, `SELECT * FROM Categories`, [])
}

export function insertDataInCategory(db, vars) {
  return insert(db, `
    INSERT INTO Categories
      SELECT t.*
      FROM (SELECT ? as id, ? as name, ? as type, ? as isActive ) t
      WHERE (SELECT count(*) FROM Categories) < 26
    `,
    vars
  )
}

export function fetchCategoryData(db, vars) {
  return select(db, `
    SELECT * FROM Categories
    WHERE type=? OR type = 'both'
  `,
    vars
  )
}
