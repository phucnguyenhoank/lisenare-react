import { useState, useContext } from "react";
import SlideMenu from "./SlideMenu";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function HamburgerMenu() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setUsername } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
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
