import { Link } from "react-router-dom";

export default function SlideMenu({ menuOpen, onClose }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}>

      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onClose} className="cursor-pointer">✕</button>
      </div>

      <ul className="mt-4 flex flex-col gap-4 p-4">
        <li><Link to="/my-lessons" className="hover:text-blue-600">My Lessons</Link></li>
        <li><button className="hover:text-blue-600 cursor-pointer">Log Out</button></li>
      </ul>

    </div>
  );
}
