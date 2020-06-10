import mysql from 'mysql';
import keys from './keys';

const pool = mysql.createPool(keys.database);

pool.getConnection((err, conn) => {
  if (err) throw err;

  conn.release();
  console.log('DB is connected');
});

export default pool;