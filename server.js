const express = require('express');
const app = express();
const PORT = 3000;

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_app",
  port: 3306
});

connection.connect((err) => {

  // error
  if(err) {
    console.log("Error connecting to database :", err.stack)
    return
  }

  connection.query(
    'SELECT * FROM `mahasiswa2`',
    function (err, results, fields) {
      console.log(results);
      console.log(fields);
    }
  );

  // berhasil
  console.log("Connected to database succesfully!");

});

// middleware agar bisa membaca JSON
app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));           // ubah
});

// data disimpan sementara
let dataNama = [];

let idCounter = 3;

// CREATE (Tambah data)
app.post('/api/nama', (req, res) => {
  const { nama } = req.body;
  const sql = 'INSERT INTO mahasiswa2 (nama) VALUES (?)';

  connection.query(sql, [nama], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({
      id: result.insertId,
      nama: nama
    });
  });
});

// READ (Tampilkan data)
app.get('/api/nama', (req, res) => {
  const sql = 'SELECT * FROM mahasiswa2';
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// UPDATE (Edit data)
app.put('/api/nama/:id', (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  const sql = 'UPDATE mahasiswa2 SET nama = ? WHERE id = ?';

  connection.query(sql, [nama, id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Data berhasil diupdate' });
  });
});

// DELETE (Hapus data)
app.delete('/api/nama/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM mahasiswa2 WHERE id = ?';

  connection.query(sql, [id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Data berhasil dihapus' });
  });
});

                                                        // tambahkan API

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
