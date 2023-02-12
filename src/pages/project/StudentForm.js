import React, { useState } from 'react'

export default function StudentForm({addStudent, students}) {
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
      <input
        type="text"
        name="id"
        placeholder="Student ID"
        value={student.id}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={student.firstName}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={student.lastName}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="text"
        name="GPA"
        placeholder="GPA"
        value={student.GPA}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="text"
        name="SCPA"
        placeholder="SCPA"
        value={student.SCPA}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="text"
        name="status"
        placeholder="Status"
        value={student.status}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="text"
        name="monitoredBy"
        placeholder="Monitored By"
        value={student.monitoredBy}
        onChange={handleChange}
        className="form-input"
      />
      <button type="submit" className="form-button">
        Add Student
      </button>
    </form></div>
  )
}