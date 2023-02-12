import React, { useState } from 'react';
import StudentForm from './StudentForm'
import StudentList from './StudentList';
import "bootstrap/dist/css/bootstrap.min.css"
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { useLocalStorage } from 'react-use';

function StudentDataApp() {
  const [students, setStudents] = useLocalStorage("studentsData",[]);
  const [scholarshipStudents, setScholarshipStudents] = useLocalStorage("scholarshipList",[])
  const [selectedID, setSelectedID] = useState(null);
  const [newStatus, setNewStatus] = useState("");


  const [currentPage, setCurrentPage] = useState("home")

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  const removeStudent = (id) => { // primary key is studentID so ..
    setStudents(students.filter((student) => student.id !== id));
  };

  const updateStudentStatus = (id, newStatus) => {
    localStorage.removeItem("studentsData");
    const updatedStudents = students.map((student) => {
      if (student.id === id) {
        return { ...student, status: newStatus };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const handleUpdateStatus = () => {
    if (!selectedID) return;
    updateStudentStatus(selectedID, newStatus);
    setSelectedID(null);
    setNewStatus("");
  };

  React.useEffect(()=>{
    console.log("Students data have been updated")
  },[students])
  

  return (
    <>
      <div className='navbar-section' style={{marginBottom:"20px"}}>

        <Navbar expand="lg" style={{ backgroundColor: "#caf0f8" }}>
          <Navbar.Brand className="my-margin app-title" href="#grade-tracker">
            SCPA Project
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="my-margin" id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">Profile</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title="About" id="basic-nav-dropdown">
                <NavDropdown.Item
                  href="#computer-science"
                >
                  Computer Science
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="#IT"
                >
                  IT
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <div className="container">
        <h5>Student Data Management</h5>
        <div className="form-container">
          <StudentForm addStudent={addStudent} />
        </div>
        <div className="table-container"> 
          <StudentList 
          students={students} 
          removeStudent={removeStudent} 
          setSelectedID = {setSelectedID}
          setNewStatus = {setNewStatus}
          handleUpdateStatus = {handleUpdateStatus}
          newStatus = {newStatus}
          selectedID = {selectedID}
          />
        </div>
      </div>
    </>
  );
}

export default StudentDataApp;