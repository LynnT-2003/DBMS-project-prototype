import React, {useState} from 'react'
import { Table, Modal, Button } from 'react-bootstrap'
import "./style.css"

export default function StudentList({ students, removeStudent, setSelectedID, setNewStatus, handleUpdateStatus, newStatus, selectedID }) {
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
                <button onClick={() => removeStudent(student.id)}>
                  Remove
                </button>
                <button
                  onClick={() => {setSelectedID(student.id); 
                    setShowModal(true); console.log("showModal set to True")}}>
                  Update
                </button>
              </td>
            </tr>
          )):null}
        </tbody>
      </Table>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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