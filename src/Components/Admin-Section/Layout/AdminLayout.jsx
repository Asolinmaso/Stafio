import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import Topbar from "../Topbar/Topbar";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar-wrapper">
        <AdminSidebar />
      </div>

      <div className="admin-main">
        <div className="admin-topbar">
          <Topbar />
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;