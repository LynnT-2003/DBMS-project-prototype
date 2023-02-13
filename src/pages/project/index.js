import React, { useState } from "react"
import StudentForm from "./StudentForm"
import StudentList from "./StudentList"
import "bootstrap/dist/css/bootstrap.min.css"
import { Navbar, Nav, NavDropdown, Button, Table } from "react-bootstrap"
import { useLocalStorage } from "react-use"
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
  Select,
  Table as T,
} from "@chakra-ui/react"

function StudentDataApp() {
  const [students, setStudents] = useLocalStorage("studentsData", [])
  const [scholarshipStudents, setScholarshipStudents] = useLocalStorage(
    "scholarshipList",
    []
  )
  const [selectedID, setSelectedID] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [showStatusModal, setShowStatusModal] = useState(false)

  const [adminIDs, setAdminIDs] = useLocalStorage("AdminID List", [
    "A-1325",
    "A-1326",
    "A-1375",
  ])
  const [overseerIDs, setOverseerIDs] = useLocalStorage("OverseerID List", [["O-001","Special"]])
  const [currentAdminID, setCurrentAdminID] = useState("")
  const [startStudentHandling, setStartStudentHandling] = useState(false)
  const [startOverseerHandling, setStartOverseerHandling] = useState(false)

  const [selectedOverseer, setSelectedOverseer] = useState("")

  const handleOverseerSelection = e => {
    setSelectedOverseer(e.target.value)
  }

  const handleStudentSelection = e => {
    setSelectedID(e.target.value)
  }

  const handleAssignOverseer = () => {
    if (selectedOverseer !== "" && selectedID !== "") {
      const newPair = [selectedOverseer, selectedID]
      setOverseerIDs([...overseerIDs, newPair])
      setSelectedOverseer("")
      setSelectedID("")
    }
  }

  function handleDeleteAssignment(index) {
    const newList = [...overseerIDs]
    newList.splice(index, 1)
    setOverseerIDs(newList)
  }

  const [currentPage, setCurrentPage] = useState("admin")
  function handlePage(page) {
    setCurrentPage(page)
  }

  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false)
  const [isLoggedInOverseer, setIsLoggedInOverseer]  = useState(false)
  const [isLoggedInStudent, setIsLoggedInStudent] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleChange = event => {
    if (event.target.name === "username") {
      setUsername(event.target.value)
    } else if (event.target.name === "password") {
      setPassword(event.target.value)
    }
  }

  const handleLogin = e => {
    e.preventDefault()
    if (adminIDs.includes(username) && password === "password") {
      setIsLoggedInAdmin(true)
      setCurrentAdminID(username)
    } else {
      setIsLoggedInAdmin(false)
      alert("Incorrect username or password fucker")
      console.table({ adminIDs })
      console.log({ username })
    }
  }


  const [usernameOverseer, setUsernameOverseer] = useState("")
  const [passwordOverseer, setPasswordOverseer] = useState("")
  const [currentOverseer, setCurrentOverseer] = useState("")

  const handleChangeOverseer = event => {
    if (event.target.name === "username") {
      setUsernameOverseer(event.target.value)
    } else if (event.target.name === "password") {
      setPasswordOverseer(event.target.value)
    }
  }

  const handleLoginOverseer = e => {
    e.preventDefault()
    if (overseerIDs[0].includes(usernameOverseer) && passwordOverseer === "password") {
      setIsLoggedInOverseer(true)
      setCurrentOverseer(usernameOverseer)
    } else {
      setIsLoggedInOverseer(false)
      alert("Incorrect username or password fucker")
      console.table({ overseerIDs })
      console.log({ usernameOverseer })
    }
  }


  const [usernameStudent, setUsernameStudent] = useState("")
  const [passwordStudent, setPasswordStudent] = useState("")
  const [currentStudent, setCurrentStudent] = useState("")

  const handleChangeStudent = event => {
    if (event.target.name === "usernameStudent") {
      setUsernameOverseer(event.target.value)
    } else if (event.target.name === "password") {
      setPasswordOverseer(event.target.value)
    }
  }


  const handleLoginStudent = e => {
    e.preventDefault()
    if (students.includes(usernameStudent) && passwordStudent === "password") {
      setIsLoggedInStudent(true)
      setCurrentStudent(usernameStudent)
    } else {
      setIsLoggedInStudent(false)
      alert("Incorrect username or password fucker")
      console.table({ students })
      console.log({ usernameStudent })
    }
  }

  const handleStartStudent = () => {
    setStartStudentHandling(!startStudentHandling)
    console.log({ startStudentHandling })
  }

  const handleStartOverseer = () => {
    setStartOverseerHandling(!startOverseerHandling)
    console.log({ startOverseerHandling })
  }

  const addStudent = student => {
    setStudents([...students, student])
  }

  const removeStudent = id => {
    // primary key is studentID so ..
    setStudents(students.filter(student => student.id !== id))
  }

  const updateStudentStatus = (id, newStatus) => {
    localStorage.removeItem("studentsData")
    const updatedStudents = students.map(student => {
      if (student.id === id) {
        return { ...student, status: newStatus }
      }
      return student
    })
    setStudents(updatedStudents)
    setShowStatusModal(false)
  }

  const handleUpdateStatus = () => {
    if (!selectedID) return
    updateStudentStatus(selectedID, newStatus)
    setSelectedID(null)
    setNewStatus("")
  }

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
              />{" "}
              <br />
              <br />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="form-input"
              />{" "}
              <br />
              <br />
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
            <h2>Student Data Management</h2>
            <h5>Welcome AdminID: {currentAdminID}</h5>
            <br />

            {startStudentHandling ? (
              <>
                <div className="form-container">
                  <StudentForm addStudent={addStudent} students={students} overseerIDs={overseerIDs} />
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
                <B onClick={handleStartStudent}>Back</B>
              </>
            ) : (
              <div className="next">
                {startOverseerHandling ? (
                  <>
                    <div>
                      <h3 style={{ color: "#3182CE" }}>Overseer Assignment</h3>
                      <div>
                        <div>
                          {/* <label>Enter Overseer ID:</label> */}
                          <br />
                          <Input
                            type="text"
                            name="overseer"
                            placeholder="Enter Overseer ID"
                            value={selectedOverseer}
                            onChange={handleOverseerSelection}
                            className="form-input"
                          />
                        </div>
                        <div>
                          {/* <label>Select Student:</label> */}
                          <br />
                          <Select
                            value={selectedID}
                            onChange={handleStudentSelection}
                          >
                            <option value="">Select Student</option>
                            {students.map(student => (
                              <option key={student.id} value={student.id}>
                                {student.id}
                              </option>
                            ))}
                          </Select>
                        </div>

                        <br />

                        <B colorScheme="blue" onClick={handleAssignOverseer}>
                          Assign
                        </B>
                        <br />
                        <br />
                        <br />
                        {overseerIDs.length > 0 && (
                          <T variant="simple">
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
                                    <br />
                                    <B
                                      colorScheme="red"
                                      onClick={() =>
                                        handleDeleteAssignment(index)
                                      }
                                    >
                                      Delete
                                    </B>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </T>
                        )}
                      </div>
                    </div>
                    <B onClick={handleStartOverseer}>Back</B>
                  </>
                ) : (
                  <div className="button-area">
                    <B onClick={handleStartStudent}>Handle Students</B> <br />
                    <br />
                    <B onClick={handleStartOverseer}>Handle Overseers</B> <br/><br/>
                    <B>Review Reports</B> {"work in progress :')"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {currentPage === "overseer" && !isLoggedInOverseer && (
          <div className="container">
          <div style={{ marginLeft: "40%", marginRight: "40%" }}>
            <h1>Please login to continue</h1> <br />
            <form onSubmit={handleLoginOverseer} className="form">
              <Input
                type="text"
                name="username"
                placeholder="Overseer ID"
                value={usernameOverseer}
                onChange={handleChangeOverseer}
                className="form-input"
              />{" "}
              <br />
              <br />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={passwordOverseer}
                onChange={handleChangeOverseer}
                className="form-input"
              />{" "}
              <br />
              <br />
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
          </div>
        )}

        {currentPage === "overseer" && isLoggedInOverseer &&(
          <div className="container">
            <h3>Welcome Overseer ID: {currentOverseer}</h3>
            <h5>List of students under supervision:</h5>
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
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.GPA}</td>
                    <td>{student.SCPA}</td>
                    <td>{student.status}</td>
                    <td>{student.monitoredBy}</td>
                    <td><Button>Award CP</Button>&nbsp;<Button>File Report</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h4 style={{color:"red"}}>Overseer Page's full functionalities still under construction :) </h4>
          </div>
        )}

        {currentPage === "student" && !isLoggedInStudent && (
          <div style={{ marginLeft: "40%", marginRight: "40%" }}>
            <h1>Please login to continue</h1> <br />
            <form onSubmit={handleLoginStudent} className="form">
              <Input
                type="text"
                name="usernameStudent"
                placeholder="Student ID"
                value={usernameStudent}
                onChange={handleChangeStudent}
                className="form-input"
              />{" "}
              <br />
              <br />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="form-input"
              />{" "}
              <br />
              <br />
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

        {currentPage === "student" && isLoggedInStudent && (
          <div className="container">
            <h4>Student Page is also under construction ^^ </h4>
          </div>
        )}
      </main>
    </ChakraProvider>
  )
}

export default StudentDataApp