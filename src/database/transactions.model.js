import { exec, select, insert, remove, update } from './db';

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
   WHERE transaction_date BETWEEN ? AND ?
   ORDER BY transaction_date DESC 
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
      sum(amount) y,
      color c
      FROM Transactions
      WHERE transaction_type=? AND transaction_date BETWEEN ? AND ?
      GROUP BY category
      ORDER BY y DESC
  `,
    vars
  )
}

export function fetchEachCategoryData(db, vars = []) {
  return select(db, `
    SELECT amount AS y FROM Transactions
      WHERE category = ?
  `,
    vars
  )
}

export function totalIncomeExpenseAmount(db, vars = []) {
  return select(db, `
    SELECT transaction_type,transaction_date,
      (SELECT SUM (amount)
        FROM Transactions AS t1
        WHERE  t1.transaction_type = T.transaction_type AND transaction_date BETWEEN ? AND ?
      ) total,
      (SELECT SUM (amount)
        FROM Transactions AS t2
        WHERE t2.transaction_type = T.transaction_type AND transaction_date BETWEEN ? AND ?
      ) total
    FROM Transactions T 
    GROUP BY transaction_type
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

export function updateTransactionData(db, vars) {
  update(db, `
    UPDATE Transactions 
      SET transaction_type=?, category=?,transaction_date=?,amount=?,memo=? 
      WHERE id=?
  `,
    vars)
}
