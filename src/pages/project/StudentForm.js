import React, { useState } from 'react'
import { Button, Grid, Input, Select } from "@chakra-ui/react"
import "./style.css"

export default function StudentForm({ addStudent, students, overseerIDs }) {
  const [student, setStudent] = useState({
    id: '',
    firstName: '',
    lastName: '',
    GPA: '',
    SCPA: '',
    status: '',
    monitoredBy: '',
  });

  const handleChange = (event) => {
    setStudent({ ...student, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.table(students)

    const studentExists = students.some((stu) => stu.id === student.id);
    if (studentExists) {
      alert("A student with the same ID already exists");
      return;
    }

    addStudent({ ...student });
    setStudent({
      id: '',
      firstName: '',
      lastName: '',
      GPA: '',
      SCPA: '',
      status: '',
      monitoredBy: '',
    });
  };

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
            <option value="active">Active</option>
            <option value="scholarship">Scholarship</option>
            <option value="graduated">Graduated</option>
            <option value="dishonored">Dishonored</option>
          </Select>

          <Select
            name="monitoredBy"
            value={student.monitoredBy}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Monitored By:</option>
            {overseerIDs.map((overseerID) => (
              <option key={overseerID[0]} value={overseerID[0]}>
                {overseerID[0]}
              </option>
            ))}
          </Select>
        </Grid> <br />

        <Button type="submit" colorScheme="blue" size="md">
          Add Student
        </Button>

        <br />
        <br />

      </form></div>
  )
}