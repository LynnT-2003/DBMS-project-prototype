import React, { useState, useEffect } from "react"
import axios from "axios"
import { Table, Modal } from "react-bootstrap"
import { Button, Grid } from "@chakra-ui/react"

import "./style.css"

export default function StudentList({
  students,
  removeStudent,
  setSelectedID,
  setNewStatus,
  handleUpdateStatus,
  newStatus,
  selectedID,
  showStatusModal,
  setShowStatusModal,
}) {
  const [students_db, setStudents_db] = useState([])
  const [deletedStudentId, setDeletedStudentId] = useState(null)
  const [tableVersion, setTableVersion] = useState(0)

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/students")
      .then(response => {
        console.log(response.data)
        console.log("shit its looping") // confirm that data is being fetched
        setStudents_db(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [deletedStudentId, students, tableVersion])

  const removeStudentHandler = student_id => {
    axios
      .delete(`http://localhost:3000/api/students/delete/${student_id}`)
      .then(response => {
        console.log(response.data)
        setDeletedStudentId(student_id)
      })
      .catch(error => {
        console.log(error)
      })
    removeStudent(student_id)
  }

  const handleUpdateStatusDB = () => {
    axios
      .put(`http://localhost:3000/api/students/updateStatus/${selectedID}`, {
        status: newStatus,
      })
      .then(response => {
        console.log(response.data)
        setShowStatusModal(false)
        setStudents_db(prevState => {
          return prevState.map(student =>
            student.student_id === selectedID
              ? { ...student, status: newStatus }
              : student
          )
        })
      })
      .catch(error => {
        console.log(error)
      })
    setTableVersion(tableVersion + 1)
  }

  const [showModal, setShowModal] = useState(false)
  return (
    <div>
      {/* <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>GPA</th>
            <th>SCPA</th>
            <th>Status</th>
            <th>Monitored By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students
            ? students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.GPA}</td>
                  <td>{student.SCPA}</td>
                  <td>{student.status}</td>
                  <td>{student.monitoredBy}</td>
                  <td>
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <Button
                        onClick={() => removeStudent(student.id)}
                        colorScheme="blue"
                        size="xs"
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedID(student.id)
                          setShowStatusModal(true)
                          console.log("showModal set to True")
                        }}
                        colorScheme="blue"
                        size="xs"
                      >
                        Update Status
                      </Button>
                    </Grid>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>{" "}
      <br />
      <br /> */}
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>GPA</th>
            <th>SCPA</th>
            <th>Status</th>
            <th>Monitored By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students_db.map(student => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.GPA}</td>
              <td>{student.SCPA}</td>
              <td>{student.Status}</td>
              <td>{student.monitored_by}</td>
              <td>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <Button
                    onClick={() => removeStudentHandler(student.student_id)}
                    colorScheme="blue"
                    size="xs"
                  >
                    Remove
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedID(student.student_id)
                      setShowStatusModal(true)
                      console.log("showModal set to True")
                    }}
                    colorScheme="blue"
                    size="xs"
                  >
                    Update Status
                  </Button>
                </Grid>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Set new status for Student ID {selectedID}:</label>
          <select
            className="form-control"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
          >
            <option value="">select a new status</option>
            <option value="Active">Active</option>
            <option value="Frozen">Frozen</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Graduated">Graduated</option>
            <option value="Dishonored">Dishonored</option>
          </select>
        </Modal.Body>

        {/**
         * Set showModal to false on Update !
         */}

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateStatusDB}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
