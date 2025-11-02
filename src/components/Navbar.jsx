import AvatarMenu from "./AvatarMenu";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* brand logo */}
        <div className="text-2xl font-bold text-black-600 cursor-pointer">
          <Link to="/">lisenare</Link>
        </div>

        <AvatarMenu />
      </div>
    </nav>
  );
}
