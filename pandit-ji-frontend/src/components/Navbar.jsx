import { NavLink } from "react-router-dom";
import { Home, BarChart2, User } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed bottom-4 left-0 w-full z-50 flex justify-center">

      {/* 🔥 GLASS NAVBAR */}
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-lg rounded-2xl px-6 py-3 flex justify-between items-center gap-8 w-[90%] max-w-md">

        {/* HOME */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition ${
              isActive ? "text-pink-600 scale-110" : "text-gray-500"
            }`
          }
        >
          <Home size={20} />
          Home
        </NavLink>

        {/* REPORT */}
        <NavLink
          to="/report"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition ${
              isActive ? "text-pink-600 scale-110" : "text-gray-500"
            }`
          }
        >
          <BarChart2 size={20} />
          Report
        </NavLink>

        {/* PROFILE */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition ${
              isActive ? "text-pink-600 scale-110" : "text-gray-500"
            }`
          }
        >
          <User size={20} />
          Profile
        </NavLink>

      </div>
    </div>
  );
};

export default Navbar;