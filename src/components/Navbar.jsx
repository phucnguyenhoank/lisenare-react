import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center fixed w-full top-0 z-50">
        {/* Brand */}
        <div className="text-2xl font-bold text-black-600 cursor-pointer">
          <a href="/">lisenare</a>
        </div>

        {/* Avatar */}
        <div className="relative">
          <img
            src="https://i.pravatar.cc/40" // placeholder avatar
            alt="avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {/* Slide menu */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="text-gray-500">
                ✕
              </button>
            </div>
            <ul className="mt-4 flex flex-col gap-4 p-4">
              <li>
                <a href="/my-lessons" className="hover:text-blue-600">
                  My Lessons
                </a>
              </li>
              <li>
                <button className="text-left hover:text-blue-600">Log Out</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer so content is below fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
