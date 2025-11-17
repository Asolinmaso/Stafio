import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import "./EmployeesMyTeam.css";
import { FaFilter } from "react-icons/fa";
import group10 from "../../../assets/Group10.png";


const Employee = () => {
  const [employees] = useState([
    {
      id: 1,
      name: "Sakshi",
      email: "sakshi@gmail.com",
      empId: "100849",
      position: "Project Head",
      department: "Design",
      DateOfJoining: "11-07-2025",
      image: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 2,
      name: "Asolin",
      email: "ignatious@gmail.com",
      empId: "100849",
      position: "Project Head",
      department: "Development",
      DateOfJoining: "11-07-2025",
      image: "https://i.pravatar.cc/40?img=4",
    },
  ]);

  return (
    <div className="employee-page">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="employee-main">
        <Topbar />
        <div className="employee-content">
          <div className="employee-content">
            <div className="employee-header">
              {/* LEFT SIDE */}
              <div className="header-left">
                <h2>My Team</h2>

        

                <input
                  type="text"
                  placeholder="🔍 Search..."
                  className="search-input"
                />
              </div>

              {/* RIGHT SIDE */}
              <div className="header-right1">
                <div className="filter-sort">
                  <button className="filter-btn">
                    <FaFilter /> Filter
                  </button>
                  <select className="sort-select1">
                    <option>Sort By : Newest</option>
                    <option>Sort By : Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <table className="employee-table">
            <thead>
              <tr>
                <th>Name/Email ID</th>
                <th>Employee ID</th>
                 <th>Date Of Joining</th>
                <th>Department</th>
                <th>Position</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-info">
                      <img src={emp.image} alt={emp.name} className="emp-img" />
                      <div>
                        <p className="emp-name">{emp.name}</p>
                        <p className="emp-email">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{emp.empId}</td>
                  <td>{emp.DateOfJoining}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>
                    <button className="view-btn">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <div className="showing">
              Showing{" "}
              <select>
                <option>07</option>
                <option>10</option>
                <option>15</option>
              </select>
            </div>
            <div className="page-nav">
              <button>Prev</button>
              <span className="page-num">01</span>
              <button>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
