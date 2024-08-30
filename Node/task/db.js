const sql = require("mysql2");
con = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootuser",
  database: "test",
});
app.use(express.json());
function getMobiles() {
  con.query(`SELECT * from table`, (err, row, col) => {
    if (err) {
      console.log(err);
    } else if (row) {
      console.log(row);
    } else {
      console.log(col);
    }
    con.end();
  });
}
getMobiles();
