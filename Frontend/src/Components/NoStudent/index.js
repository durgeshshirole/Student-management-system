import React from "react";
import logo from "../../Assets/jscoelogo.png";
import './NoStudent.css';

const NoStudent = () => (
    <div className="no-student p-3">
        <h2>No Student Found</h2>
        <p>
            Add Student Attendance
        </p>
        <img
            className="img-fluid bounce-animation "
            src={logo}
            alt="Logo"
            style={{ width: "15rem", padding: "2rem" }}
        />
    </div>
);

export default NoStudent;