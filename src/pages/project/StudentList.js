import React, {useState} from 'react'
import { Table, Modal } from "react-bootstrap"
import { Button, Grid } from "@chakra-ui/react"

import "./style.css"

export default function StudentList({ students, removeStudent, setSelectedID, setNewStatus, handleUpdateStatus, newStatus, selectedID, showStatusModal, setShowStatusModal }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
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
          {students ? students.map((student) => (
            <tr key={student.id}>
              <td >{student.id}</td>
              <td >{student.firstName}</td>
              <td >{student.lastName}</td>
              <td >{student.GPA}</td>
              <td >{student.SCPA}</td>
              <td >{student.status}</td>
              <td >{student.monitoredBy}</td>
              <td>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  <Button onClick={() => removeStudent(student.id)}
                    colorScheme="blue"
                    size="xs">
                    Remove
                  </Button>
                  <Button
                    onClick={() => {setSelectedID(student.id); 
                    setShowStatusModal(true); console.log("showModal set to True")}}
                    colorScheme="blue"
                    size="xs">
                    Update
                  </Button>
                </Grid>
              </td>
            </tr>
          )):null}
        </tbody>
      </Table>
      
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Set new status for Student ID {selectedID}:</label>
          <select className='form-control' value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
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
          <Button variant="primary" onClick={handleUpdateStatus}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}