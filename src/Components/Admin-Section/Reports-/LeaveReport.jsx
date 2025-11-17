import React from "react";
import { FaFilter } from "react-icons/fa";
import "./LeaveReport.css";
import AdminSidebar from "../AdminSidebar";
import Topbar from "../Topbar";
import group10 from "../../../assets/Group10.png";


export default function LeaveReport() {
  const leaveSummary = [
    { type: "Casual Leave", days: "6/7 Day(s)", color: "casual" },
    { type: "Annual Leave", days: "7/8 Day(s)", color: "annual" },
    { type: "Sick Leave", days: "3/5 Day(s)", color: "sick" },
    { type: "LOP", days: "0", color: "lop" },
  ];

  const monthlyData = [
    { month: "Jan", percentage: 0 },
    { month: "Feb", percentage: 85 },
    { month: "Mar", percentage: 35 },
    { month: "Apr", percentage: 0 },
    { month: "May", percentage: 0 },
  ];

  return (
    <div className="leave-report-layout">
      <div className="rightside-logo ">
        <img src={group10} alt="logo"
        className="rightside-logos" />
      </div>
      <AdminSidebar />
      <div className="leave-report-main">
        <Topbar />
        
        {/* Page Header */}
        <div className="leave-report-header">
          <h2>Leave Report</h2>
          <select className="leave-report-dropdown">
            <option>Aiswarya(100539)</option>
          </select>
        </div>

        {/* Leave Summary Cards */}
        <div className="leave-summary-container">
          {leaveSummary.map((leave, idx) => (
            <div key={idx} className={`leave-summary-card ${leave.color}`}>
              <div className="leave-icon-wrapper">
                <div className="leave-icon">✓</div>
              </div>
              <div className="leave-content">
                <div className="leave-days">{leave.days}</div>
                <div className="leave-type">{leave.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Leave Chart */}
        <div className="monthly-chart-section">
          <div className="monthly-chart-header">
            <h3>Monthly Leave Report</h3>
            <button className="chart-filter-btn">
              <FaFilter />
            </button>
          </div>

          <div className="chart-container">
            <div className="chart-y-labels">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0</span>
            </div>

            <div className="chart-content">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{ height: `${item.percentage * 2.4}px` }}
                  ></div>
                  <span className="month-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
