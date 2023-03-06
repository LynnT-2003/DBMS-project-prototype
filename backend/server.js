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
    "INSERT INTO students (student_id, first_name, last_name, GPA, Status, email, monitored_by, CP, semesters) VALUES (?,?,?,?,?,?,?,?,?);"
  db.query(
    sqlInsert,
    [
      student.id,
      student.firstName,
      student.lastName,
      student.GPA,
      // student.SCPA,
      student.status,
      student.email,
      student.monitoredBy,
      student.CP,
      student.semesters,
    ],
    function (error, results) {
      if (error) {
        console.error("Error adding student:", error)
        if (error.code === "ER_DUP_ENTRY") {
          res.status(409).send("Student with this ID already exists")
        } else {
          res.status(500).send("Internal server error")
        }
      } else {
        res.send("Student added!")
      }
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

// Endpoint to delete an overseer by ID
app.delete("/api/overseers/:id", (req, res) => {
  const id = req.params.id
  const sql = "DELETE FROM overseers WHERE overseer_id = ?"
  db.query(sql, [id], error => {
    if (error) {
      console.log(error)
      res.sendStatus(500)
    } else {
      console.log(`Overseer with id ${id} deleted successfully`)
      res.sendStatus(204) // success, no content
    }
  })
})

// GET endpoint for retrieving a single student's information
app.get("/api/students/:id", (req, res) => {
  const studentID = req.params.id
  const selectQuery = "SELECT * FROM students WHERE student_id = ?"
  db.query(selectQuery, [studentID], (error, results) => {
    if (error) {
      console.error("Error retrieving student information:", error)
      res.status(500).send("Internal server error")
      return
    }

    if (results.length === 0) {
      res.status(404).send("Student not found FUCK")
      return
    }

    const studentInfo = results[0]
    res.status(200).json(studentInfo)
  })
})

// API endpoint for awarding CP to a student
// app.post("/api/awardCP", (req, res) => {
//   const studentId = req.body.student_id
//   const cpAmount = req.body.cp

//   const updateCPQuery = `UPDATE students SET CP = CP + ${cpAmount} WHERE id = ${studentId}`

//   connection.query(updateCPQuery, (error, results, fields) => {
//     if (error) {
//       console.error("Error awarding CP: ", error)
//       res.sendStatus(500)
//     } else {
//       console.log(`CP updated for student with id ${studentId}`)
//       res.sendStatus(200)
//     }
//   })
// })
app.post("/api/awardCP", (req, res) => {
  const { student_id, cp } = req.body

  const sql = `UPDATE students SET cp = cp + ? WHERE student_id = ?`

  db.query(sql, [cp, student_id], (err, result) => {
    if (err) {
      console.log("Error awarding CP:", err)
      res.status(500).send("Error awarding CP")
    } else {
      console.log(result.affectedRows + " record(s) updated")
      res.status(200).send("CP awarded successfully")
    }
  })
})

app.post("/api/scholarshipApplication", (req, res) => {
  const student_id = req.body.student_id
  const result = "pending"
  const query = `INSERT INTO scholarship_application (student_id, result) VALUES (${student_id}, '${result}')`
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
      return
    }
    res.sendStatus(200)
  })
})

// get scholarship application
app.get("/api/scholarshipApplications", (req, res) => {
  const query = "SELECT * FROM scholarship_application"

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
      return
    }

    res.json(results)
  })
})

app.put("/api/scholarshipApplication/:student_id", (req, res) => {
  const student_id = req.params.student_id
  const result = req.body.result

  const query = `UPDATE scholarship_application SET result='${result}' WHERE student_id=${student_id}`
  const studentQuery = `UPDATE students SET status='Scholarship' WHERE student_id=${student_id}`

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
      return
    }

    db.query(studentQuery, (error, results, fields) => {
      if (error) {
        console.error(error)
        res.sendStatus(500)
        return
      }

      res.sendStatus(200)
    })
  })
})

app.put("/api/scholarshipApplication/:student_id/reject", (req, res) => {
  const student_id = req.params.student_id
  const result = "rejected"

  const query = `UPDATE scholarship_application SET result='${result}' WHERE student_id=${student_id}`

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
      return
    }

    res.sendStatus(200)
  })
})

app.get("/api/admin", (req, res) => {
  const sql = "SELECT * FROM admin"
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err)
      res.status(500).send("Error retrieving admin data")
      return
    }
    res.json(result)
  })
})

// API endpoint for posting reports
app.post("/reports", (req, res) => {
  const { student_id, reason } = req.body
  const sql = "INSERT INTO reports (student_id, reason) VALUES (?, ?)"
  db.query(sql, [student_id, reason], (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send("Error saving report")
    } else {
      res.status(200).send("Report saved successfully")
    }
  })
})

// API endpoint for getting reports
app.get("/reports", (req, res) => {
  const sql = "SELECT * FROM reports"
  db.query(sql, (err, result) => {
    if (err) throw err
    res.send(result)
  })
})

// Start the server
app.listen(3000, function () {
  console.log("Server started on port 3000!")
})
