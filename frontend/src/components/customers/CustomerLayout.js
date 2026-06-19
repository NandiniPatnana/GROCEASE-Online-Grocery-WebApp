import React from "react";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <>
      <div className="p-6 mt-12">
        <Outlet /> {/* Renders nested routes like GroceryDashboard and Cart */}
      </div>
    </>
  );
};

export default CustomerLayout;
