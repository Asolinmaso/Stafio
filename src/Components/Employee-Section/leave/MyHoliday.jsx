import React, { useState, useEffect } from "react";
import "./MyHoliday.css";
import EmployeeSidebar from "../EmployeeSidebar";
import Topbar from "../Topbar";
import axios from "axios";

const MyHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/myholidays");
        setHolidays(response.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchHolidays();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(holidays.length / rowsPerPage);
  const currentData = holidays.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="layout d-flex">
      <EmployeeSidebar />
      <div className="myholiday-container">
        <Topbar />
        <h2 className="page-title">My Holiday Calendar</h2>

        <div className="holiday-table-container">
          <table className="holiday-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Date</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((holiday, index) => (
                <tr key={holiday.id || index}>
                  <td>{String((currentPage - 1) * rowsPerPage + index + 1).padStart(2, "0")}</td>
                  <td>{holiday.date}</td>
                  <td>{holiday.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="holiday-pagination">
          <div className="showing">
            Showing
            <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={7}>07</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="page-controls">
            <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
            <button className="page-number active">
              {String(currentPage).padStart(2, "0")}
            </button>
            <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, Math.max(1, totalPages)))} disabled={currentPage === Math.max(1, totalPages)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyHoliday;
