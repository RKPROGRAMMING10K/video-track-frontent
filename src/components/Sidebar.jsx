import React from "react";
import { Menu } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white hidden md:flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      <nav className="flex flex-col gap-2">
        <a href="/home" className="hover:bg-gray-700 p-2 rounded">Dashboard</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Progress</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Settings</a>
      </nav>
    </div>
  );
};


export default Sidebar;