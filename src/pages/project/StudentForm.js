import React, { useState, useEffect } from "react"
import { Button, Grid, Input, Select } from "@chakra-ui/react"
import "./style.css"
import axios from "axios"

export default function StudentForm({ addStudent, students, overseerIDs }) {
  const [student, setStudent] = useState({
    id: "",
    firstName: "",
    lastName: "",
    GPA: "",
    SCPA: "",
    status: "",
    email: "",
    monitoredBy: "",
  })
  const [overseers, setOverseers] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/overseers")
      .then(response => {
        setOverseers(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const handleChange = event => {
    setStudent({ ...student, [event.target.name]: event.target.value })
  }

  const handleSubmit = event => {
    event.preventDefault()

    console.table(students)
    axios
      .get("http://localhost:3000/api/students")
      .then(response => {
        const studentExists = response.data.some(stu => stu.id === student.id)
        if (studentExists) {
          alert("A student with the same ID already exists")
          return
        }
        axios
          .post("http://localhost:3000/addStudent", student)
          .then(response => {
            console.log(response.data)
            setStudent([...students, student])
            setStudent({
              id: "",
              firstName: "",
              lastName: "",
              GPA: "",
              SCPA: "",
              status: "",
              monitoredBy: "",
            })
            window.location.reload()
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })

    addStudent({ ...student })
    setStudent({
      id: "",
      firstName: "",
      lastName: "",
      GPA: "",
      SCPA: "",
      status: "",
      email: "",
      monitoredBy: "",
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form">
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Input
            type="text"
            name="id"
            placeholder="Student ID"
            value={student.id}
            onChange={handleChange}
            className="form-input"
          />
          <Input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={student.firstName}
            onChange={handleChange}
            className="form-input"
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={student.lastName}
            onChange={handleChange}
            className="form-input"
          />
        </Grid>
        <br />
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Input
            type="text"
            name="GPA"
            placeholder="GPA"
            value={student.GPA}
            onChange={handleChange}
            className="form-input"
          />
          <Input
            type="text"
            name="SCPA"
            placeholder="SCPA"
            value={student.SCPA}
            onChange={handleChange}
            className="form-input"
          />
        </Grid>
        <br />
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          <Select
            name="status"
            value={student.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select a status</option>
            <option value="Active">Active</option>
            <option value="Scholarship">Scholarship</option>
            <option value="Graduated">Graduated</option>
            <option value="Dishonored">Dishonored</option>
          </Select>

          <Input
            type="text"
            name="email"
            placeholder="email"
            value={student.email}
            onChange={handleChange}
            className="form-input"
          />

          <Select
            name="monitoredBy"
            value={student.monitoredBy}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Monitored By:</option>
            {overseers
              ? overseers.map(overseerID => (
                  <option
                    key={overseerID.overseer_id}
                    value={overseerID.overseer_id}
                  >
                    {overseerID.overseer_id}
                  </option>
                ))
              : null}
          </Select>
        </Grid>{" "}
        <br />
        <Button type="submit" colorScheme="blue" size="md">
          Add Student
        </Button>
        <br />
        <br />
      </form>
    </div>
  )
}
