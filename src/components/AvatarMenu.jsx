import { useState } from "react";
import SlideMenu from "./SlideMenu";
import { FaBars } from "react-icons/fa";

export default function AvatarMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/register";
  };

  return (
    <div className="relative">
      <FaBars 
        className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <SlideMenu
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}
