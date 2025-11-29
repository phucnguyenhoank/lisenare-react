import { Link } from "react-router-dom";
import logo from "../assets/logo-cntt2021.png";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-gray-900">
      {/* Logo */}
      <img src={logo} alt="Faculty Logo" className="w-32 h-auto mb-6" />

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Lisenare</h1>

      {/* Description */}
      <p className="text-lg mb-8 text-center max-w-xl">
        Lisenare is an English learning app created by Nguyen Hoang Phuc & Pham Trung Ky, 
        students from the University of Technology and Education.
      </p>

      {/* Login/Register buttons */}
      <div className="flex gap-4 mb-8">
        <Link
          to="/login"
          className="px-6 py-2 border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition"
        >
          Register
        </Link>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-900 p-6 rounded-lg text-center">
          <h2 className="font-semibold text-2xl mb-2">Nguyen Hoang Phuc</h2>
          <p className="text-gray-700">Creator / Developer</p>
        </div>
        <div className="border border-gray-900 p-6 rounded-lg text-center">
          <h2 className="font-semibold text-2xl mb-2">Pham Trung Ky</h2>
          <p className="text-gray-700">Creator / Developer</p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-gray-500 text-center">
        &copy; 2025 Lisenare. All rights reserved.
      </p>
    </div>
  );
}
