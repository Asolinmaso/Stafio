import React from "react";
import "./MyHoliday.css";
import EmployeeSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";


const Myholiday = () => {
  const holidayData = [
    { id: 1, date: "01 January, Wednesday", title: "New Year's Day" },
    { id: 2, date: "26 January, Sunday", title: "Republic Day" },
    { id: 3, date: "18 April, Friday", title: "Good Friday" },
    { id: 4, date: "21 April, Monday", title: "Easter Monday" },
    { id: 5, date: "06 July, Sunday", title: "Muharram" },
    { id: 6, date: "15 August, Friday", title: "Independence Day" },
    { id: 7, date: "20 October, Monday", title: "Diwali" },
  ];

  return (
    <div className="layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
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
              {holidayData.map((holiday, index) => (
                <tr key={holiday.id}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>{holiday.date}</td>
                  <td>{holiday.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="holiday-pagination">
          <div className="showing">
            Showing
            <select>
              <option>07</option>
              <option>10</option>
              <option>20</option>
            </select>
          </div>
          <div className="page-controls">
            <button className="page-btn">Prev</button>
            <button className="page-number active">01</button>
            <button className="page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myholiday;
