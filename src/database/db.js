
export function exec(db, sql, vars = [], cb = () => { }) {
  db.transaction(txn => {
    txn.executeSql(sql, vars, cb);
  });

}

export function select(db, sql, vars = []) {
  return new Promise((resolve, reject) => {
    if (!sql) return reject('Invalid Sql')
    let data = []
    exec(db, sql, vars, (tx, res) => {
      for (let i = 0; i < res.rows.length; i++) {
        data.push(res.rows.item(i))
      }
      resolve(data)
    })
  });
}

export function insert(db, sql, vars = []) {
  return new Promise((resolve, reject) => {
    if (!sql && !db && !vars) return reject('Invalid query or vars empty')
    exec(db, sql, vars, (tx, res) => {
      if (res.rowsAffected > 0) {
        resolve('Data Inserted')
      }
    })
  })
}

export function remove(db, sql, vars) {
  if (!sql && !db && !vars) return ('Invalid query or vars empty')
  return exec(db, sql, vars)
}

export function update(db, sql, vars) {
  return exec(db, sql, vars)
}

