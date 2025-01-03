import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [sid, setSid] = useState("");
  const [gender, setGender] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState({ city: "", state: "", zip: "" });
  const [marks, setMarks] = useState([{ subject: "", score: 0 }]);
  const [attendance, setAttendance] = useState(100);
  const navigate = useNavigate();

  // Handle address field changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  // Handle individual mark field changes
  const handleMarksChange = (index, field, value) => {
    const updatedMarks = [...marks];
    updatedMarks[index][field] = value;
    setMarks(updatedMarks);
  };

  // Add a new mark field
  const addMarkField = () => {
    setMarks([...marks, { subject: "", score: 0 }]);
  };

  // Remove a specific mark field
  const removeMarkField = (index) => {
    setMarks(marks.filter((_, i) => i !== index));
  };

  // Validate form inputs
  const validateForm = () => {
    if (!name.trim()) return "Name is required.";
    if (!sid || isNaN(sid)) return "Valid Sid is required.";
    if (!gender) return "Gender is required.";
    if (!contactNumber.trim()) return "Contact number is required.";
    if (contactNumber.length !== 10) return "Contact number must be 10 digits.";
    if (!marks.length) return "At least one mark entry is required.";
    return null;
  };

  // Submit data to the server
  const sentData = (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      Swal.fire("Validation Error", errorMessage, "error");
      return;
    }

    const newStudent = {
      name,
      sid,
      gender,
      contactNumber,
      address,
      marks,
      attendance,
    };

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("https://sttiss-api.vercel.app/student/add", newStudent)
          .then(() => {
            Swal.fire("Student has been successfully saved!", "", "success");
            navigate("/");
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Failed to save student: ${err.message}`,
            });
          });
      } else if (result.isDenied) {
        Swal.fire("Details are not saved", "", "info");
      }
    });
  };

  return (
    <div className="container p-5">
      <form onSubmit={sentData}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Student Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nim" className="form-label">
            Student ID
          </label>
          <input
            type="number"
            className="form-control"
            id="nim"
            placeholder="Enter your student ID"
            value={sid}
            onChange={(e) => setSid(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gender">Select Your Gender</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label" htmlFor="male">
                Male
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="contactNumber" className="form-label">
            Contact Number
          </label>
          <input
            type="text"
            className="form-control"
            id="contactNumber"
            placeholder="Enter contact number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Address</label>
          {["street", "city", "state", "zip"].map((field) => (
            <input
              key={field}
              type="text"
              className="form-control mb-2"
              name={field}
              placeholder={`Enter ${field}`}
              value={address[field] || ""}
              onChange={handleAddressChange}
            />
          ))}
        </div>
        <div className="mb-3">
          <label>Marks</label>
          {marks.map((mark, index) => (
            <div key={index} className="d-flex mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Subject"
                value={mark.subject}
                onChange={(e) => handleMarksChange(index, "subject", e.target.value)}
              />
              <input
                type="number"
                className="form-control me-2"
                placeholder="Score"
                value={mark.score}
                onChange={(e) => handleMarksChange(index, "score", e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeMarkField(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addMarkField}>
            Add Mark
          </button>
        </div>
        <div className="mb-3">
          <label htmlFor="attendance" className="form-label">
            Attendance (%)
          </label>
          <input
            type="number"
            className="form-control"
            id="attendance"
            placeholder="Enter attendance percentage"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
