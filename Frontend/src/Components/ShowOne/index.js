import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ShowOne = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    nim: "",
    gender: "",
    contactNumber: "",
    address: { street: "", city: "", state: "", zip: "" },
    marks: [],
    attendance: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://sttiss-api.vercel.app/student/get/${id}`);
        const fetchedUser = response.data.user || {};
        setUser({
          ...fetchedUser,
          marks: fetchedUser.marks || [],
        });
      } catch (error) {
        Swal.fire("Error", "Failed to fetch user details.", "error");
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleAddressChange = (field, value) => {
    setUser({ ...user, address: { ...user.address, [field]: value } });
  };

  const handleMarksChange = (index, field, value) => {
    const updatedMarks = [...user.marks];
    updatedMarks[index][field] = value;
    setUser({ ...user, marks: updatedMarks });
  };

  const addMarkField = () => {
    setUser((prevUser) => ({
      ...prevUser,
      marks: [...prevUser.marks, { subject: "", score: "" }],
    }));
  };

  const removeMarkField = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      marks: prevUser.marks.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://sttiss-api.vercel.app/student/update/${id}`, user);
      Swal.fire("Success", "User details updated successfully.", "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", "Failed to update user details.", "error");
    }
  };

  return (
    <div>
      <h1>Edit Student</h1>
      <form onSubmit={handleFormSubmit}>
        {/* General Details */}
        <div>
          <label>Name</label>
          <input
            type="text"
            value={user.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <label>NIM</label>
          <input
            type="text"
            value={user.nim || ""}
            onChange={(e) => handleInputChange("nim", e.target.value)}
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            value={user.gender || ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Contact Number</label>
          <input
            type="text"
            value={user.contactNumber || ""}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
          />
        </div>
        <div>
          <label>Attendance</label>
          <input
            type="number"
            value={user.attendance || ""}
            onChange={(e) => handleInputChange("attendance", e.target.value)}
          />
        </div>

        {/* Address Section */}
        <div>
          <label>Address</label>
          <input
            type="text"
            placeholder="Street"
            value={user.address.street || ""}
            onChange={(e) => handleAddressChange("street", e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={user.address.city || ""}
            onChange={(e) => handleAddressChange("city", e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            value={user.address.state || ""}
            onChange={(e) => handleAddressChange("state", e.target.value)}
          />
          <input
            type="text"
            placeholder="Zip"
            value={user.address.zip || ""}
            onChange={(e) => handleAddressChange("zip", e.target.value)}
          />
        </div>

        {/* Marks Section */}
        <div>
          <label>Marks</label>
          {user.marks.map((mark, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Subject"
                value={mark.subject || ""}
                onChange={(e) => handleMarksChange(index, "subject", e.target.value)}
              />
              <input
                type="number"
                placeholder="Score"
                value={mark.score || ""}
                onChange={(e) => handleMarksChange(index, "score", e.target.value)}
              />
              <button type="button" onClick={() => removeMarkField(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addMarkField}>
            Add Mark
          </button>
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ShowOne;
