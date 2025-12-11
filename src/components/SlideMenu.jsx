import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

export default function SlideMenu({ menuOpen, onClose, onLogout }) {
  const { username } = useContext(UserContext);
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-[9999] transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onClose} className="cursor-pointer text-lg">
          ✕
        </button>
      </div>

      <ul className="mt-4 flex flex-col gap-4 p-4">
        

        <li>
          <Link to="/writing-check" className="hover:text-blue-600" onClick={onClose}>
            Writing Check
          </Link>
        </li>

        <li>
          <Link to="/context-search" className="hover:text-blue-600" onClick={onClose}>
            Context Search
          </Link>
        </li>

        {username && (
          <>
            <li>
              <Link to="/generate-questions" className="hover:text-blue-600" onClick={onClose}>
                Generate Question
              </Link>
            </li>

            <li>
              <Link to="/history" className="hover:text-blue-600" onClick={onClose}>
                History Generate Question
              </Link>
            </li>

            <li>
              <Link to="/submitted-lessons" className="hover:text-blue-600" onClick={onClose}>
                Submitted Lessons
              </Link>
            </li>

            <li>
              <Link to="/profile" className="hover:text-blue-600" onClick={onClose}>
                Profile
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="hover:text-blue-600 cursor-pointer"
              >
                Log Out
              </button>
            </li>
          </>
        )}

      </ul>
    </div>
  );
}
