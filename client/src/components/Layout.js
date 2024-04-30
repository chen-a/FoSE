import React from "react";
import "../styles/LayoutStyles.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const location = useLocation();
  const navigate = useNavigate();
  // logout funtion
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // =========== doctor menu ===============
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },

    {
      name: "Profile",
      path: `/doctor/profile/${user?.id}`,
      icon: "fa-solid fa-user",
    },
  ];
  // =========== nurse menu ===============
  const nurseMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Profile",
      path: `/nurse/profile/${user?.id}`,
      icon: "fa-solid fa-user",
    },
  ];

  // =========== user/patient menu ===============
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "fa-solid fa-user-doctor",
    },
    {
      name: "Apply Nurse",
      path: "/apply-nurse",
      icon: "fa-solid fa-user-nurse",
    },
    {
      name: "Profile",
      path: `/user/profile/${user?.id}`,
      icon: "fa-solid fa-user",
    },
    {
      name: "Bills",
      path: "/bills",
      icon: "fa-solid fa-user-nurse",
    },
  ];

  // admin menu
const adminMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },

  {
    name: "Doctors",
    path: "/admin/doctors",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Nurses",
    path: "/admin/nurses",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "All Users",
    path: "/admin/users",
    icon: "fa-solid fa-user",
  },
  {
    name: "Profile",
    path: `/admin/profile/${user?.id}`,
    icon: "fa-solid fa-user",
  },
];

  // redering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : user?.isNurse
    ? nurseMenu
    : userMenu;
    return (
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6 className="text-light">FoSE</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div className={`menu-item ${isActive && "active"}`} key={menu.path}>
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                );
              })}
              <div className="menu-item" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content">
                <div style={{ cursor: "pointer" }}>
                <Badge
                  // count={user && user.notifcation.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i className="fa-solid fa-bell"></i>
                </Badge>
                </div>
    
                <div className="user-link">{user?.name}</div>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    );
};

export default Layout;
