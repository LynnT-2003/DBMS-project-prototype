import React, { useState } from 'react';
import StudentForm from './StudentForm'
import StudentList from './StudentList';
import "bootstrap/dist/css/bootstrap.min.css"
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap"
import { useLocalStorage } from 'react-use';
import {
  ChakraProvider,
  Button as B,
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react"

function StudentDataApp() {
  const [students, setStudents] = useLocalStorage("studentsData", []);
  const [scholarshipStudents, setScholarshipStudents] = useLocalStorage("scholarshipList", [])
  const [selectedID, setSelectedID] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false)

  const [adminIDs, setAdminIDs] = useLocalStorage("AdminID List", ["A-1325", "A-1326", "A-1375"])
  const [overseerIDs, setOverseerIDs] = useLocalStorage("OverseerID List", [])
  const [currentAdminID, setCurrentAdminID] = useState("")
  const [startStudentHandling, setStartStudentHandling] = useState(false)
  const [startOverseerHandling, setStartOverseerHandling] = useState(false)

  const [selectedOverseer, setSelectedOverseer] = useState("")

  const handleOverseerSelection = (e) => {
    setSelectedOverseer(e.target.value);
  };

  const handleStudentSelection = (e) => {
    setSelectedID(e.target.value);
  };

  const handleAssignOverseer = () => {
    if (selectedOverseer !== "" && selectedID !== "") {
      const newPair = [selectedOverseer, selectedID];
      setOverseerIDs([...overseerIDs, newPair]);
      setSelectedOverseer("");
      setSelectedID("");
    }
  };

  function handleDeleteAssignment(index) {
    const newList = [...overseerIDs];
    newList.splice(index, 1);
    setOverseerIDs(newList);
  }


  const [currentPage, setCurrentPage] = useState("admin")
  function handlePage(page) {
    setCurrentPage(page)
  }

  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = event => {
    if (event.target.name === "username") {
      setUsername(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminIDs.includes(username) && password === "password") {
      setIsLoggedInAdmin(true);
      setCurrentAdminID(username);
    } else {
      setIsLoggedInAdmin(false);
      alert("Incorrect username or password fucker");
      console.table({ adminIDs })
      console.log({ username })

    }
  };

  const handleStartStudent = () => {
    setStartStudentHandling(!startStudentHandling)
    console.log({ startStudentHandling })
  }

  const handleStartOverseer = () => {
    setStartOverseerHandling(!startOverseerHandling)
    console.log({ startOverseerHandling })
  }



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
    setShowStatusModal(false)
  };

  const handleUpdateStatus = () => {
    if (!selectedID) return;
    updateStudentStatus(selectedID, newStatus);
    setSelectedID(null);
    setNewStatus("");
  };

  React.useEffect(() => {
    console.log("Students data have been updated")
  }, [students])


  return (
    <ChakraProvider>
      <div className="navbar-section" style={{ marginBottom: "20px" }}>
        <Navbar expand="lg" style={{ backgroundColor: "#3182CE" }}>
          <Navbar.Brand
            style={{ marginLeft: "100px", color: "white" }}
            href="#grade-tracker"
          >
            SCPA Project
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="my-margin" id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#admin" onClick={() => handlePage("admin")}>
                Admin
              </Nav.Link>
              <Nav.Link href="#overseer" onClick={() => handlePage("overseer")}>
                Overseer
              </Nav.Link>
              <Nav.Link href="#student" onClick={() => handlePage("student")}>
                Student
              </Nav.Link>
            </Nav>
            {/* <Nav>
            <NavDropdown title="About" id="basic-nav-dropdown">
              <NavDropdown.Item href="#computer-science">
                Computer Science
              </NavDropdown.Item>
              <NavDropdown.Item href="#IT">IT</NavDropdown.Item>
            </NavDropdown>
          </Nav> */}
          </Navbar.Collapse>
        </Navbar>
      </div>

      <main>

        {currentPage === "admin" && !isLoggedInAdmin && (
          <div style={{ marginLeft: "40%", marginRight: "40%" }}>
            <h1>Please login to continue</h1> <br />
            <form onSubmit={handleLogin} className="form">
              <Input
                type="text"
                name="username"
                placeholder="Admin ID"
                value={username}
                onChange={handleChange}
                className="form-input"
              /> {" "} <br /><br />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="form-input"
              /> <br /><br />
              <a href="#" style={{ textDecoration: "none", color: "#AAA" }}>
                Forgot password?
              </a>
              <br />
              <br />
              <B
                width="full"
                colorScheme="blue"
                type="submit"
                className="form-button"
              >
                Login
              </B>
            </form>
          </div>
        )}

        {currentPage === "admin" && isLoggedInAdmin && (
          <div className="container">
            <h2>
              Student Data Management
            </h2>
            <h5>Welcome AdminID: {currentAdminID}</h5>
            <br />

            {startStudentHandling ?
              <>
                <div className="form-container">
                  <StudentForm
                    addStudent={addStudent}
                    students={students}
                  />
                </div>
                <div className="table-container">
                  <StudentList
                    students={students}
                    removeStudent={removeStudent}
                    setSelectedID={setSelectedID}
                    setNewStatus={setNewStatus}
                    handleUpdateStatus={handleUpdateStatus}
                    newStatus={newStatus}
                    selectedID={selectedID}
                    showStatusModal={showStatusModal}
                    setShowStatusModal={setShowStatusModal}
                  />
                </div>
                <B onClick={handleStartStudent}>
                  Back
                </B>
              </>
              :
              <div className='next'>
                {startOverseerHandling ?
                  <>
                    <div>
                      <h6 style={{ color: "red" }}>Overseer Assignment</h6>
                        <div>
                          <div>
                          <label>Enter Overseer ID:</label>
                            <input
                              type="text"
                              name="overseer"
                              placeholder="Enter Overseer ID"
                              value={selectedOverseer}
                              onChange={handleOverseerSelection}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label>Select Student:</label>
                            <select value={selectedID} onChange={handleStudentSelection}>
                              <option value="">Select Student</option>
                              {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                  {student.id}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button onClick={handleAssignOverseer}>Assign</button>
                          {overseerIDs.length > 0 && (
                            <table>
                              <thead>
                                <tr>
                                  <th>Overseer ID</th>
                                  <th>Student ID</th>
                                </tr>
                              </thead>
                              <tbody>
                                {overseerIDs.map((pair, index) => (
                                  <tr key={index}>
                                    <td>{pair[0]}</td>
                                    <td>{pair[1]}</td>
                                    <td>
                                      <button onClick={() => handleDeleteAssignment(index)}>Delete</button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                    </div>
                    <B onClick={handleStartOverseer}>
                      Back
                    </B>
                  </>
                  :
                  <div className='button-area'>
                    <B onClick={handleStartStudent}>
                      Handle Students
                    </B> <br /><br />
                    <B onClick={handleStartOverseer}>
                      Handle Overseers
                    </B>
                  </div>}
              </div>}



          </div>
        )
        }
        {currentPage === "overseer" && (
          <div className='container'>
            <h4>Overseer Page under construction :) </h4>
          </div>
        )}
        {currentPage === "student" && (
          <div className='container'>
            <h4>Student Page is also under construction ^^ </h4>
          </div>
        )}
      </main>


    </ChakraProvider>
  );
}

export default StudentDataApp;