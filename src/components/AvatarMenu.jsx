import { useState } from "react";
import SlideMenu from "./SlideMenu";

export default function AvatarMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear auth info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/register";
  };

  return (
    <div className="relative">
      <img
        src="https://i.pravatar.cc/40"
        alt="avatar"
        className="w-10 h-10 rounded-full cursor-pointer"
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
