import { exec, select, insert, remove } from './db';

export function createTransactionTable(db) {
  return exec(db, `
    CREATE TABLE IF NOT EXISTS Transactions(
      id TEXT,
      transaction_type VARCHAR(10),
      category VARCHAR(15),
      transaction_date TEXT,
      amount INTEGER,
      memo TEXT,
      color TEXT,
      position INTEGER
    )`);
}

export function fetchAllTransaction(db, vars = []) {
  return select(db, `
   SELECT * FROM Transactions
   ORDER BY position DESC
  `, vars
  );
}

export function insertDataInTransaction(db, vars) {
  return insert(db, `
    INSERT INTO Transactions 
      (id, transaction_type, category, transaction_date, amount, memo, color, position)
      VALUES(?,?,?,?,?,?,?,?)
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

export function deleteTransactionItem(db, vars) {
  remove(db, `
    DELETE FROM Transactions
    WHERE id = ?
  `,
    vars
  )
}
