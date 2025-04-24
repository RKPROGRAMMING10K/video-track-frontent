import React from "react";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <button className="md:hidden">
        <Menu className="h-6 w-6 text-gray-700" />
      </button>
      <h1 className="text-xl font-semibold">Lecture Tracker</h1>
    </header>
  );
};

export default Header;
