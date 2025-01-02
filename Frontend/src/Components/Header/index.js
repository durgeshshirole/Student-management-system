import React, { useState } from "react";
import logo from "../../Assets/jscoelogo.png";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Example state for login
  const [userType, setUserType] = useState("teacher"); // 'teacher' or 'student'
  const [userName, setUserName] = useState("John Doe"); // Example user name

  const handleLogout = () => {
    // Logic for logging out
    setIsLoggedIn(false);
    setUserType(null);
    setUserName("");
    console.log("User logged out");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              className="img-fluid"
              src={logo}
              alt="Logo STTISS"
              style={{ width: "3rem" }}
            />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              {isLoggedIn && userType === "teacher" && (
                <li className="nav-item">
                  <a className="nav-link active" href="/add-student">
                    Create Student
                  </a>
                </li>
              )}
              {isLoggedIn && userType === "teacher" && (
                <li className="nav-item">
                  <a className="nav-link active" href="/announcements">
                    Announcements
                  </a>
                </li>
              )}
            </ul>
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                <span className="me-3">
                  Welcome, {userName} ({userType})
                </span>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex">
                <a className="btn btn-outline-primary me-2" href="/login">
                  Login
                </a>
                <a className="btn btn-outline-success" href="/signup">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
