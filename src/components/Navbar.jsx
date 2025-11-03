// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import AvatarMenu from "./AvatarMenu";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* brand logo */}
        <div className="text-2xl font-bold text-black-600 cursor-pointer">
          <Link to="/">lisenare</Link>
        </div>

        {/* dynamic greeting */}
        <div className="flex items-center gap-4">
          {username ? (
            <span className="text-gray-800 font-medium">
              Hello, {username}
            </span>
          ) : (
            <Link to="/register" className="text-blue-600 font-medium">
              Login / Register
            </Link>
          )}

          <AvatarMenu />
        </div>
      </div>
    </nav>
  );
}
