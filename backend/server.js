// server.js

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")

const app = express()
app.use(bodyParser.json())
app.use(cors())

const db = mysql.createPool({
  host: "localhost",
  user: "newuser",
  password: "password",
  database: "a_name",
})

// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'password123',
//   database: 'students_db',
// });

// // Connect to the database
// connection.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected to the database!');
// });

// Define endpoints

// // Get all students
// app.get('/students', function (req, res) {
//   db.query('SELECT * FROM students', function (error, results, fields) {
//     if (error) throw error;
//     res.send(results);
//   });
// });

// // Get all overseers
// app.get('/overseers', function (req, res) {
//   db.query('SELECT * FROM overseers', function (error, results, fields) {
//     if (error) throw error;
//     res.send(results);
//   });
// });

// // Assign an overseer to a student
// app.post('/assign-overseer', function (req, res) {
//   const { studentId, overseerId } = req.body;
//   const query = `UPDATE students SET overseer_id = ${overseerId} WHERE id = ${studentId}`;
//   db.query(query, function (error, results, fields) {
//     if (error) throw error;
//     res.send('Overseer assigned to student!');
//   });
// });

app.get("/testadd", (req, res) => {
  const sqlInsert =
    "INSERT INTO students (student_id, first_name, last_name, GPA, SCPA, Status, email, monitored_by) VALUES (6410382,'Tanat2','Arora2','3.88','4.00','Active','nut2@email.com','O-002');"
  db.query(sqlInsert, function (error, results) {
    if (error) throw error
    res.send("Student added!")
  })
})

app.post("/addStudent", (req, res) => {
  const student = req.body
  const sqlInsert =
    "INSERT INTO students (student_id, first_name, last_name, GPA, SCPA, Status, email, monitored_by) VALUES (?,?,?,?,?,?,?,?);"
  db.query(
    sqlInsert,
    [
      student.id,
      student.firstName,
      student.lastName,
      student.GPA,
      student.SCPA,
      student.status,
      student.email,
      student.monitoredBy,
    ],
    function (error, results) {
      if (error) throw error
      res.send("Student added!")
    }
  )
})

app.get("/api/students", (req, res) => {
  const sqlSelect = "SELECT * FROM students;"
  db.query(sqlSelect, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})

app.get("/api/overseers", (req, res) => {
  const sqlSelect = "SELECT * FROM overseers;"
  db.query(sqlSelect, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})

app.delete("/api/students/delete/:student_id", (req, res) => {
  const id = req.params.student_id
  const sqlDelete = "DELETE FROM students WHERE student_id = ?;"
  db.query(sqlDelete, id, (err, result) => {
    if (err) console.log(err)
    res.send("Student deleted successfully")
  })
})

app.put("/api/students/updateStatus/:student_id", (req, res) => {
  const id = req.params.student_id
  const newStatus = req.body.status
  const sqlUpdate = "UPDATE students SET status = ? WHERE student_id = ?"
  db.query(sqlUpdate, [newStatus, id], (err, result) => {
    if (err) console.log(err)
    res.send("Status updated successfully")
  })
})

// POST endpoint for assigning overseers to students
app.post("/api/assignOverseer", (req, res) => {
  const { overseerID, studentID } = req.body
  const params = [overseerID, studentID]

  // If both IDs are valid, update the 'Overseers' table with the new pairing
  const insertQuery =
    "INSERT INTO overseers (overseer_id, student_id) VALUES (?, ?)"

  db.query(insertQuery, params, (insertErr, insertResult) => {
    if (insertErr) {
      console.error("Error assigning overseer:", insertErr)
      res.status(500).send("Internal server error")
      return
    }

    res.status(200).send("Overseer assigned successfully")
  })
})

// Start the server
app.listen(3000, function () {
  console.log("Server started on port 3000!")
})
