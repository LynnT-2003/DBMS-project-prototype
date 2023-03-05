import React, { useState, useEffect } from "react"
import axios from "axios"
import StudentForm from "./StudentForm"
import StudentList from "./StudentList"
import "bootstrap/dist/css/bootstrap.min.css"
import { Navbar, Nav, NavDropdown, Button, Table, Modal } from "react-bootstrap"
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
  Alert,
  AlertIcon,
  Select,
  Table as T,
} from "@chakra-ui/react"

import scpa from "../../images/scpa_logo.png"

function StudentDataApp() {
  const [cpAmount, setCpAmount] = useState("")
  const [studentToAward, setStudentToAward] = useState("")

  const [students, setStudents] = useLocalStorage("studentsData", [])
  const [students_db, setStudentsDB] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [scholarshipStudents, setScholarshipStudents] = useLocalStorage(
    "scholarshipList",
    []
  )
  const [overseers, setOverseers] = useState([])

  // Fetch initial data on component mount
  useEffect(() => {
    fetchOverseers()
  }, [])

  // Fetch data every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchOverseers, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchOverseers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/overseers")
      setOverseers(response.data)
      console.log(
        "Fetching overseers API from http://localhost:3000/api/overseers"
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/students")
      .then(response => {
        setStudentsDB(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/students")
      setStudentsDB(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const [applications_db, setApplicationsDB] = useState([])

  useEffect(() => {
    getScholarshipApplications()
    const interval = setInterval(() => {
      getScholarshipApplications()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const getScholarshipApplications = () => {
    console.log("Fetching scholarship applications from applicationsDB")
    console.log()
    axios
      .get("http://localhost:3000/api/scholarshipApplications")
      .then(response => {
        setApplicationsDB(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const [selectedID, setSelectedID] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [showStatusModal, setShowStatusModal] = useState(false)

  const [adminIDs, setAdminIDs] = useLocalStorage("AdminID List", [
    "A-1325",
    "A-1326",
    "A-1375",
  ])
  const [overseerIDs, setOverseerIDs] = useLocalStorage("OverseerID List", [
    ["O-001", "Special"],
  ])
  const [currentAdminID, setCurrentAdminID] = useState("")
  const [startStudentHandling, setStartStudentHandling] = useState(false)
  const [startOverseerHandling, setStartOverseerHandling] = useState(false)
  const [selectedOverseer, setSelectedOverseer] = useState("")
  const [showAlert, setShowAlert] = useState(false)

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

      // Update database
      axios
        .post("http://localhost:3000/api/assignOverseer", {
          overseerID: selectedOverseer,
          studentID: selectedID,
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)

          alert(
            "Could not add overseer successfully into the database. Please try again"
          )
        })
      setSelectedOverseer("")
      setSelectedID("")
    }
  }

  // function handleDeleteAssignment(index) {
  //   const newList = [...overseerIDs]
  //   newList.splice(index, 1)
  //   setOverseerIDs(newList)
  // }

  const handleDeleteOverseer = id => {
    axios
      .delete(`http://localhost:3000/api/overseers/${id}`)
      .then(response => {
        console.log(`Overseer with id ${id} deleted successfully`)
        // Update the list of overseers
        fetchOverseers()
      })
      .catch(error => {
        console.log(error)
      })
  }

  function handleAwardCPSubmit() {
    console.log("this shouldn't be looping")
    console.log("Student to award CP:", studentToAward)
    console.log("Amount to award CP:", cpAmount)
    axios
      .post("http://localhost:3000/api/awardCP", {
        student_id: studentToAward,
        cp: cpAmount,
      })
      .then(response => {
        setShowAwardCPModal(false)
      })
      .catch(error => {
        console.log("Error awarding CP fuck:", error)
      })
  }

  function displayAlert() {
    setShowAlert(true)
  }

  function notDisplayAlert() {
    setShowAlert(false)
  }

  const [currentPage, setCurrentPage] = useState("admin")
  function handlePage(page) {
    setCurrentPage(page)
  }

  const [showAwardCPModal, setShowAwardCPModal] = useState(false)

  const handleAwardCPShow = student => {
    setStudentToAward(student)
    setShowAwardCPModal(true)
  }

  const handleAwardCPhide = () => setShowAwardCPModal(false)

  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false)
  const [isLoggedInOverseer, setIsLoggedInOverseer] = useState(false)
  const [isLoggedInStudent, setIsLoggedInStudent] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleChange = event => {
    if (event.target.name === "username") {
      setUsername(event.target.value)
      notDisplayAlert()
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
      displayAlert()
      console.table({ adminIDs })
      console.log({ username })
    }
  }

  const handleLogout = () => {
    setIsLoggedInAdmin(false)
    setCurrentAdminID("")
  }

  const [usernameOverseer, setUsernameOverseer] = useState("")
  const [passwordOverseer, setPasswordOverseer] = useState("")
  const [currentOverseer, setCurrentOverseer] = useState("")

  const handleChangeOverseer = event => {
    if (event.target.name === "username") {
      setUsernameOverseer(event.target.value)
      notDisplayAlert()
    } else if (event.target.name === "password") {
      setPasswordOverseer(event.target.value)
    }
  }

  const handleLoginOverseer = e => {
    e.preventDefault()
    const overseer = overseers.find(o => o.overseer_id === usernameOverseer)
    if (overseer && passwordOverseer === "password") {
      setIsLoggedInOverseer(true)
      setCurrentOverseer(usernameOverseer)
      notDisplayAlert()
    } else {
      setIsLoggedInOverseer(false)
      displayAlert()
      console.table({ overseerIDs })
      console.log({ usernameOverseer })
    }
  }

  const handleLogoutOverseer = () => {
    setIsLoggedInOverseer(false)
    setCurrentOverseer("")
  }

  const [usernameStudent, setUsernameStudent] = useState("")
  const [passwordStudent, setPasswordStudent] = useState("")
  const [currentStudent, setCurrentStudent] = useState("")

  // studentInfo

  useEffect(() => {
    fetch(`http://localhost:3000/api/students/${currentStudent}`)
      .then(response => response.json())
      .then(data => setStudentInfo(data))
      .catch(error => console.error("Error fetching student data:", error))
  }, [currentStudent])

  const handleChangeStudent = event => {
    if (event.target.name === "username") {
      setUsernameStudent(event.target.value)
      notDisplayAlert()
    } else if (event.target.name === "password") {
      setPasswordStudent(event.target.value)
    }
  }

  const handleLoginStudent = e => {
    e.preventDefault()
    const student = students_db.find(
      s => s.student_id === parseInt(usernameStudent)
    )
    console.table(students_db)
    console.log(student, usernameStudent)
    if (student && passwordStudent === "password") {
      setIsLoggedInStudent(true)
      setCurrentStudent(usernameStudent)
    } else {
      setIsLoggedInStudent(false)
      displayAlert()
      console.table({ students_db })
      console.log({ usernameStudent })
    }
  }

  const handleLogoutStudent = () => {
    setIsLoggedInStudent(false)
    setCurrentStudent("")
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

  function applyForScholarship(studentForScholarApp) {
    axios
      .post("http://localhost:3000/api/scholarshipApplication", {
        student_id: studentForScholarApp,
      })
      .then(response => {
        alert("Successfully applied for scholarship")
      })
      .catch(error => {
        console.log(error)
        alert(studentForScholarApp)
      })
  }

  function approveScholarship(student_id) {
    axios
      .put(`http://localhost:3000/api/scholarshipApplication/${student_id}`, {
        result: "approved",
      })
      .then(response => {
        console.log(response)
        // Refresh the scholarships table
        alert("Successfully approved application")
        getScholarshipApplications()
      })
      .catch(error => {
        console.log(error)
      })
  }

  function rejectScholarship(student_id) {
    console.log("rejecting application")
    axios
      .put(
        `http://localhost:3000/api/scholarshipApplication/${student_id}/reject`
      )
      .then(response => {
        alert("Scholarship rejected successfully")
        getScholarshipApplications()
      })
      .catch(error => {
        console.error("Error rejecting scholarship: ", error)
      })
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
              <Nav.Link
                href="#admin"
                style={{ color: "white" }}
                onClick={() => handlePage("admin")}
              >
                Admin
              </Nav.Link>
              <Nav.Link
                href="#overseer"
                style={{ color: "white" }}
                onClick={() => handlePage("overseer")}
              >
                Overseer
              </Nav.Link>
              <Nav.Link
                href="#student"
                style={{ color: "white" }}
                onClick={() => handlePage("student")}
              >
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
          <div
            style={{ marginLeft: "40%", marginRight: "40%", paddingTop: "5%" }}
          >
            <img src={scpa} alt="logo" />
            <h5>Please login to continue</h5> <br />
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
              <br />
              <br />
              {showAlert && (
                <Alert status="error">
                  <AlertIcon />
                  Wrong Username or Password, Please try again!
                </Alert>
              )}
            </form>
          </div>
        )}

        {currentPage === "admin" && isLoggedInAdmin && (
          <div className="container">
            <h2>Student Data Management</h2>
            <br />
            <h5>Welcome AdminID: {currentAdminID}</h5>
            <br />

            {startStudentHandling ? (
              <>
                <div className="form-container">
                  <StudentForm
                    addStudent={addStudent}
                    students={students}
                    overseerIDs={overseerIDs}
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

                  <h3>
                    <u>Pending Scholarship Applications</u>
                  </h3>

                  <T>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications_db
                        .filter(scholarship => scholarship.result === "pending")
                        .map(scholarship => (
                          <tr key={scholarship.student_id}>
                            <td>{scholarship.student_id}</td>
                            <td>{scholarship.result}...</td>
                            <td>
                              <B
                                onClick={() =>
                                  approveScholarship(scholarship.student_id)
                                }
                              >
                                Approve
                              </B>{" "}
                              &nbsp; &nbsp;{" "}
                              <B
                                onClick={() =>
                                  rejectScholarship(scholarship.student_id)
                                }
                              >
                                Reject
                              </B>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </T>
                  <br />
                  <br />
                  <br />
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
                            onChange={handleOverseerSelection} // sets selectedOverseer
                            className="form-input"
                          />
                        </div>
                        <div>
                          {/* <label>Select Student:</label> */}
                          <br />
                          <Select
                            value={selectedID}
                            onChange={handleStudentSelection} // sets selectedID
                          >
                            <option value="">Select Student</option>
                            {students_db.map(student => (
                              <option
                                key={student.student_id}
                                value={student.student_id}
                              >
                                {student.student_id}
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
                        {/* {overseerIDs.length > 0 && (
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
                        )} */}

                        {overseerIDs.length > 0 && (
                          <T variant="simple">
                            <thead>
                              <tr>
                                <th>Overseer ID</th>
                                <th>Student ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {overseers.map(overseer => (
                                <tr key={overseer.id}>
                                  <td>{overseer.overseer_id}</td>
                                  <td>{overseer.student_id}</td>
                                  <td>
                                    <br />
                                    <B
                                      colorScheme="red"
                                      onClick={() =>
                                        handleDeleteOverseer(
                                          overseer.overseer_id
                                        )
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
                    <B onClick={handleStartOverseer}>Handle Overseers</B> <br />
                    <br />
                    <B>Review Reports</B> <br /> <br />
                    <B colorScheme="red" onClick={handleLogout}>
                      Logout
                    </B>
                  </div>
                )}
              </div>
            )}
            {/* <br />

            <T>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications_db
                  .filter(scholarship => scholarship.result === "pending")
                  .map(scholarship => (
                    <tr key={scholarship.student_id}>
                      <td>{scholarship.student_id}</td>
                      <td>{scholarship.result}...</td>
                      <td>
                        <B
                          onClick={() =>
                            approveScholarship(scholarship.student_id)
                          }
                        >
                          Approve
                        </B>{" "}
                        &nbsp; &nbsp;{" "}
                        <B
                          onClick={() =>
                            rejectScholarship(scholarship.student_id)
                          }
                        >
                          Reject
                        </B>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </T> */}
          </div>
        )}
        {currentPage === "overseer" && !isLoggedInOverseer && (
          <div
            style={{ marginLeft: "40%", marginRight: "40%", paddingTop: "5%" }}
          >
            <img src={scpa} alt="logo" />
            <h5>Please login to continue</h5> <br />
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
              <br />
              <br />
              {showAlert && (
                <Alert status="error">
                  <AlertIcon />
                  Wrong Username or Password, Please try again!
                </Alert>
              )}
            </form>
          </div>
        )}

        {currentPage === "overseer" && isLoggedInOverseer && (
          <div className="container">
            <h3>Welcome Overseer ID: {currentOverseer}</h3>
            <h5>List of students under supervision:</h5>
            <br />
            <br />
            <br />
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
                {students_db
                  .filter(student => student.monitored_by === currentOverseer)
                  .map(student => (
                    <tr key={student.student_id}>
                      <td>{student.student_id}</td>
                      <td>{student.first_name}</td>
                      <td>{student.last_name}</td>
                      <td>{student.GPA}</td>
                      <td>{student.SCPA}</td>
                      <td>{student.Status}</td>
                      <td>{student.monitored_by}</td>
                      <td>
                        <B
                          colorScheme={"blue"}
                          onClick={() => handleAwardCPShow(student.student_id)}
                        >
                          Award CP
                        </B>
                        &nbsp;
                        <B colorScheme={"blue"}>File Report</B>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <Modal
              show={showAwardCPModal}
              onHide={() => setShowAwardCPModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Award CP to {studentToAward}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="form-group">
                    <label htmlFor="cp-amount">
                      Please enter how much CP to award:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="cp-amount"
                      placeholder="Enter amount"
                      value={cpAmount}
                      onChange={e => setCpAmount(e.target.value)}
                    />
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowAwardCPModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAwardCPSubmit}>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
            <br />
            <B colorScheme="red" onClick={handleLogoutOverseer}>
              Logout
            </B>
          </div>
        )}

        {currentPage === "student" && !isLoggedInStudent && (
          <div
            style={{ marginLeft: "40%", marginRight: "40%", paddingTop: "5%" }}
          >
            <img src={scpa} alt="logo" />
            <h5>Please login to continue</h5> <br />
            <form onSubmit={handleLoginStudent} className="form">
              <Input
                type="text"
                name="username"
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
                value={passwordStudent}
                onChange={handleChangeStudent}
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
              <br />
              <br />
              {showAlert && (
                <Alert status="error">
                  <AlertIcon />
                  Wrong Username or Password, Please try again!
                </Alert>
              )}
            </form>
          </div>
        )}

        {currentPage === "student" && isLoggedInStudent && (
          <div className="container">
            {/* <h3>Welcome Student ID: {currentStudent}</h3> */}

            {/* <Table>
              <thead>
                <tr>
                  <th>student ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>GPA</th>
                  <th>SCPA</th>
                  <th>Status</th>
                  <th>Monitored By</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter(student => student.id === currentStudent)
                  .map((student, index) => (
                    <tr key={index}>
                      <td>{student.id}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{student.GPA}</td>
                      <td>{student.SCPA}</td>
                      <td>{student.status}</td>
                      <td>{student.monitoredBy}</td>
                    </tr>
                  ))}
              </tbody>
            </Table> */}

            <div className="student-card">
              <h3>Welcome Student ID: {currentStudent}</h3>
              <br />
              <br />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <b>Student ID:</b>
                    </td>
                    <td>{studentInfo.student_id}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>First Name:</b>
                    </td>
                    <td>{studentInfo.first_name}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Last Name:</b>
                    </td>
                    <td>{studentInfo.last_name}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>GPA:</b>
                    </td>
                    <td>{studentInfo.GPA}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>SCPA:</b>
                    </td>
                    <td>{studentInfo.SCPA}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Status:</b>
                    </td>
                    <td>{studentInfo.Status}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Email:</b>
                    </td>
                    <td>{studentInfo.email}</td>
                  </tr>
                  {/* <tr>
                    <td>
                      <b>Monitored By:</b>
                    </td>
                    
                    <td>{studentInfo.monitored_by}</td>
                  </tr> */}
                </tbody>
              </table>
              {/* {students_db
                .filter(student => student.student_id === currentStudent)
                .map((student, index) => (
                  <div key={index} className="card-info">
                    <div className="card-item">
                      <p>
                        <b>Student ID:&nbsp; </b>
                      </p>
                      <p>{student.student_id}</p>
                    </div>
                    <div className="card-item">
                      <p>
                        <b>First Name</b>
                      </p>

                      <p>{student.first_name}</p>
                    </div>
                    <div className="card-item">
                      <p>
                        <b>Last Name:</b>
                      </p>

                      <p>{student.last_name}</p>
                    </div>
                    <div className="card-item">
                      <p>
                        <b>GPA:</b>
                      </p>

                      <p>{student.GPA}</p>
                    </div>
                    <div className="card-item">
                      <p>
                        <b>SCPA:</b>
                      </p>

                      <p>{student.SCPA}</p>
                    </div>
                    <div className="card-item">
                      <p>
                        <b>Status:</b>
                      </p>

                      <p>{student.status}</p>
                    </div>
                  </div>
                ))} */}
              <br />
              <B
                colorScheme={"blue"}
                isDisabled={
                  students_db.filter(
                    student => student.student_id === parseInt(currentStudent)
                  )[0].GPA < 3.85 ||
                  students_db.filter(
                    student => student.student_id === parseInt(currentStudent)
                  )[0].SCPA < 3.85
                }
                onClick={() => applyForScholarship(currentStudent)}
              >
                Apply Scholarship
              </B>{" "}
              <br />
              <B colorScheme="red" onClick={handleLogoutStudent}>
                Logout
              </B>
            </div>
            <div style={{ alignItems: "center" }}></div>
          </div>
        )}
      </main>
    </ChakraProvider>
  )
}

export default StudentDataApp
