import React, { useState } from 'react';
import StudentForm from './StudentForm'
import StudentList from './StudentList';
import "bootstrap/dist/css/bootstrap.min.css"
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap"
import { useLocalStorage } from 'react-use';

function StudentDataApp() {
  const [students, setStudents] = useLocalStorage("studentsData", []);
  const [scholarshipStudents, setScholarshipStudents] = useLocalStorage("scholarshipList", [])
  const [selectedID, setSelectedID] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false)

  const [adminIDs, setAdminIDs] = useLocalStorage("AdminID List", ["O-1325", "O-1326", "O-1375"])
  const [currentAdminID, setCurrentAdminID] = useState("")
  const [startStudentHandling, setStartStudentHandling] = useState(false)
  const [startOverseerHandling, setStartOverseerHandling] = useState(false)


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
    if (adminIDs.includes(username)) {
      setIsLoggedInAdmin(true);
      setCurrentAdminID(username);
    } else {
      setIsLoggedInAdmin(false);
      alert("Incorrect username or password");
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
    <>
      <div className='navbar-section' style={{ marginBottom: "20px" }}>

        <Navbar expand="lg" style={{ backgroundColor: "#caf0f8" }}>
          <Navbar.Brand style={{ marginLeft: "10px" }} href="#grade-tracker">
            SCPA Project
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="my-margin" id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#admin" onClick={() => handlePage("admin")}>Admin</Nav.Link>
              <Nav.Link href="#overseer" onClick={() => handlePage("overseer")}>Overseer</Nav.Link>
              <Nav.Link href="#student" onClick={() => handlePage("student")}>Student</Nav.Link>
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

      <main>

        {currentPage === "admin" && !isLoggedInAdmin && (
          <div className="container">
            <h5>Login</h5>
            <form onSubmit={handleLogin} className="form">
              <input
                type="text"
                name="username"
                placeholder="Admin ID"
                value={username}
                onChange={handleChange}
                className="form-input"
              /> <br /><br />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                className="form-input"
              /> <br /><br />
              <Button type="submit" className="form-button">
                Login
              </Button>
            </form>
          </div>
        )}

        {currentPage === "admin" && isLoggedInAdmin && (
          <div className="container">
            <h3>Welcome  Admin {currentAdminID}</h3>
            <h5>Student Data Management</h5>

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
                <Button onClick={handleStartStudent}>
                  Back
                </Button>
              </>
              :
              <div className='next'>
                {startOverseerHandling ?
                  <>
                    <div>
                      <h6 style={{color:"red"}}>Overseer Handling under construction</h6>
                    </div>
                    <Button onClick={handleStartOverseer}>
                      Back
                    </Button>
                  </>
                  :
                  <div className='button-area'>
                    <Button onClick={handleStartStudent}>
                      Handle Students
                    </Button> <br/><br/>
                    <Button onClick={handleStartOverseer}>
                      Handle Overseers
                    </Button>
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


    </>
  );
}

export default StudentDataApp;