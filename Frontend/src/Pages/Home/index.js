import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaRegEdit } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import NoStudent from "../../Components/NoStudent";

export default function Home() {
  const [students, setStudents] = useState([]); // Initialize students as an empty array
  const [selectedIds, setSelectedIds] = useState([]);  // To track selected student IDs
  const [selectAll, setSelectAll] = useState(false);    // To track "Select All" checkbox state

  useEffect(() => {
    const getStudents = () => {
      axios
        .get("https://sttiss-api.vercel.app/student/get")
        .then((res) => {
          setStudents(res.data); // Set the students data
        })
        .catch((err) => alert(err.message));
    };
    getStudents();
  }, []);

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://sttiss-api.vercel.app/student/delete/${id}`)
          .then((res) => {
            Swal.fire("Deleted!", res.data.status, "success");
            // Update table after deleting
            const updatedStudents = students.filter(
              (student) => student._id !== id
            );
            setStudents(updatedStudents);
          })
          .catch((err) => {
            Swal.fire("Not Deleted!", err.message, "error");
          });
      }
    });
  };

  const deleteSelectedUsers = () => {
    if (selectedIds.length === 0) {
      Swal.fire("No Students Selected", "Please select students to delete.", "info");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Send API requests for all selected IDs
        const deleteRequests = selectedIds.map((id) =>
          axios.delete(`https://sttiss-api.vercel.app/student/delete/${id}`)
        );

        // Wait for all requests to complete
        Promise.all(deleteRequests)
          .then(() => {
            Swal.fire(
              "Deleted!",
              "Selected students have been deleted successfully.",
              "success"
            );
            // Update the students state by filtering out deleted IDs
            const updatedStudents = students.filter(
              (student) => !selectedIds.includes(student._id)
            );
            setStudents(updatedStudents);
            setSelectedIds([]); // Clear selected IDs after deletion
            setSelectAll(false); // Reset the "Select All" checkbox
          })
          .catch((err) => {
            Swal.fire("Error!", "Some students could not be deleted. Please try again.", "error");
          });
      }
    });
  };

  const toggleSelection = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id) // Deselect if already selected
        : [...prevSelected, id] // Select if not already selected
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]); // Deselect all if already selected
    } else {
      setSelectedIds(students.map((student) => student._id)); // Select all students
    }
    setSelectAll(!selectAll); // Toggle "Select All" state
  };

  return (
    <div className="text-center mb-4">
      <h5 style={{ textAlign: "center", padding: "3rem", fontWeight: "bold" }}>
        JSCOE STUDENT MANAGEMENT SYSTEM
      </h5>
      <div className="container">
        <div
          className="d-flex justify-content-between align-items-center mb-3"
          style={{ padding: "1em" }}
        >
          {selectedIds.length == 0 && (

            <h3></h3>
          )}
          {selectedIds.length > 0 && (

            <button className="btn btn-danger" onClick={deleteSelectedUsers}>
              Delete Selected
            </button>
          )}
          <div className="d-flex justify-content-end">
            {/* Add Student Button */}
            <Link to="/add-student">
              <button className="btn btn-primary" type="button">
                Add Student
              </button>
            </Link>
          </div>
        </div>

        {/* Students Table */}
        {students && students.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope="col">Sr No</th>
                <th scope="col">Name</th>
                <th scope="col">Sid</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleSelection(item._id)}
                    />
                  </td>
                  <td style={{ color: "red" }}>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.nim}</td>
                  <td
                    className="d-flex align-items-center justify-content-center"
                    style={{ gap: "1em" }}
                  >
                    <Link
                      to={`/get/${item._id}`}
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                    >
                      <FaRegEdit />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger d-flex align-items-center justify-content-center"
                      onClick={() => deleteUser(item._id)}
                    >
                      <BsTrash3 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoStudent />
        )}
      </div>
    </div>
  );
}
