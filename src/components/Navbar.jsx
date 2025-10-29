import Brand from "./Brand";
import AvatarMenu from "./AvatarMenu";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Brand />
        <AvatarMenu />
      </div>
    </nav>
  );
}
