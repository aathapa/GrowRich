import { exec, select, insert } from './db';

export function createTransactionTable(db) {
  return exec(db, `
    CREATE TABLE IF NOT EXISTS Transactions(
      id TEXT,
      transaction_type VARCHAR(10),
      category VARCHAR(15),
      transaction_date TEXT,
      amount INTEGER,
      memo TEXT,
      color TEXT
    )`);
}

export function fetchAllTransaction(db) {
  return select(db, `
   SELECT * FROM Transactions
   ORDER BY transaction_date DESC
  `, []);
}

export function insertDataInTransaction(db, vars) {
  return insert(db, `
    INSERT INTO Transactions 
      (id, transaction_type, category, transaction_date, amount, memo, color)
      VALUES(?,?,?,?,?,?,?)
    `,
    vars
  )
}

export function fetchGroupByData(db, vars) {
  return select(db, `
    SELECT
      category x, 
      sum(amount) y
      FROM Transactions
      WHERE transaction_type=?
      GROUP BY category
      ORDER BY y DESC
  `,
    vars
  )
}
