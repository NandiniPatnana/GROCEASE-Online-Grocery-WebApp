import React from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
          <div className="p-6 mt-12">
            <Outlet /> {/* Renders nested routes like GroceryDashboard and Cart */}
          </div>
    </>
  );
};

export default AdminLayout;
