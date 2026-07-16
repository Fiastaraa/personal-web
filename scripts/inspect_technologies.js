const pool = require("../src/config/db.js");

(async () => {
  try {
    const cols = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'technologies' ORDER BY ordinal_position`
    );
    console.log('COLUMNS:', cols.rows);

    const sample = await pool.query(`SELECT * FROM technologies LIMIT 5`);
    console.log('SAMPLE ROWS:', sample.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
