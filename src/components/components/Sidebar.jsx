import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { Roles } from "../utils/roles";
import userimage from "../aasests/profile-img.jpg";
import {
  House,
  Users,
  User,
  UserCog,
  Handshake,
  FolderOpenDot,
  LogOut,
  CalendarHeart, 
  CalendarCheck,
  FileSpreadsheet,
  FileChartLine,
  CalendarCog,
  FileClock,
  FolderGit2,
  ContactRound,
  FolderKey,
  Folders
} from "lucide-react";
export function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});
  const { logout } = useAuth();
  const userRole = localStorage.getItem("user_name");
  const menuItems = {
    [Roles.ADMIN]: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "employee Management", path: "/admin/users" },
    ],
    [Roles.SUPER_ADMIN]: [
      { name: "Dashboard", path: "/superadmin/dashboard", icon: <House /> },
      { name: "employee Management", path: "/superadmin/users", icon: <User /> },
      { name: "Team", path: "/superadmin/team", icon: <Users /> },
      { name: "Roles", path: "/superadmin/roles", icon: <UserCog /> },
      { name: "Clients", path: "/superadmin/clients", icon: <Handshake /> },
      { name: "Projects", path: "/superadmin/projects", icon: <FolderOpenDot />, },
      { name: "Projects Assigned", path: "/superadmin/assigned-projects", icon: <FileSpreadsheet />, },
    ],
    [Roles.BD]: [
      { name: "Dashboard", path: "/billingmanager/dashboard", icon: <House /> },
      { name: "Clients", path: "/billingmanager/clients", icon: <Handshake /> },
      { name: "Projects", path: "/billingmanager/projects", icon: <Folders/> },
      { name: "Teams", path: "/billingmanager/teams", icon: <Users /> },
      { name: "Project Assigned", path: "/billingmanager/projects-assigned", icon: <FileSpreadsheet />  },
      { name: "Manage Sheets", path: "/billingmanager/Manage-sheets" },
    ],
    [Roles.HR]: [
      { name: "Dashboard", path: "/hr/dashboard", icon: <House /> },
      { name: "Employee Management", path: "/hr/employees", icon: <ContactRound /> },
      { name: "Leave Management", path: "/hr/leaves",icon: <CalendarCheck /> },
    ],
    [Roles.PM]: [
      { name: "Dashboard", path: "/projectmanager/dashboard", icon: <House /> },
      { name: "Projects Assigned", path: "/projectmanager/assigned", icon: <FileSpreadsheet /> },
      { name: "Project Management", path: "/projectmanager/assign", icon: <FolderGit2 /> },
      { name: "Performance Sheets", path: "/projectmanager/performance-sheets", icon: <FileChartLine /> },
      { name: "Manage Leaves", path: "/projectmanager/manage-leaves", icon: <CalendarCog /> },
    ],
    [Roles.TEAM]: [
      { name: "Dashboard", path: "/team/dashboard", icon: <House /> },
      { name: "Projects Assigned", path: "/team/projects-assigned", icon: <FileSpreadsheet /> },
      { name: "Performance Sheet", path: "/team/performance-sheet", icon: <FileChartLine /> },
      { name: "Performance History", path: "/team/performance-sheet-History", icon: <FileClock /> },
      { name: "Leaves", path: "/team/leaves",icon: <CalendarHeart />  },
    ],
  };
  const toggleMenu = (path) => {
    setOpenMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };
  return (
    <aside className="bg-white shadow-lg fixed left-0 top-0 h-full w-72 z-10 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-gray-200 flex flex-col justify-between my-2.5 mx-1.5">
      <div>
        <div className="relative flex items-center py-4 px-4 text-center border-b border-gray-200">
          <img
            className="rounded-3xl h-14 w-14 mx-2.5"
            src={userimage}
            alt=""
          />
          <h2 className="text-lg font-semibold text-gray-700 capitalize">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel
          </h2>
          <button className="absolute right-4 top-4 p-2 rounded focus:outline-none xl:hidden">
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="m-2">
          <ul className="flex flex-col gap-2">
            {menuItems[userRole]?.map(({ name, path, icon, children }) => (
              <li key={path}>
                {children ? (
                  <button
                    onClick={() => toggleMenu(path)}
                    className="flex items-center justify-between w-full px-4 py-2 rounded-lg transition-colors font-medium capitalize text-left text-gray-700 hover:bg-gray-100"
                  >
                    <span>{name}</span>
                    {/* <span>{icon}</span> */}
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        openMenus[path] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg transition-colors text-gray-600 font-medium capitalize gap-2 flex flex-row ${
                        isActive
                          ? "bg-black text-white" 
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    {icon}
                    {name}
                  </NavLink>
                )}
                {children && (
                  <ul
                    className={`ml-4 mt-1 bg-gray-50 rounded-lg shadow-inner border-l border-gray-300 pl-4 transition-all duration-300 overflow-hidden ${
                      openMenus[path]
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {children.map(({ name, path }) => (
                      <li key={path}>
                        <NavLink
                          to={path}
                          className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition-colors text-gray-600 font-medium capitalize ${
                              isActive
                                ? "bg-black text-white"
                                : "hover:bg-gray-100"
                            }`
                          }
                        >
                          {name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-2 my-8">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors font-medium capitalize text-gray-700 hover:bg-gray-100"
        >
          <LogOut />
          LogOut
        </button>
      </div>
    </aside>
  );
}
Sidebar.propTypes = {
  user: PropTypes.object,
};
export default Sidebar;