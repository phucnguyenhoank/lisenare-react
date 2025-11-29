// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { UserContext } from "../contexts/UserContext";
import { parseJwt } from "../utils/jwt";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!usernameInput || !password) {
      setMessage("❌ Please enter username and password");
      return;
    }

    setMessage("⏳ Logging in...");
    try {
      const res = await loginUser({ username: usernameInput, password });
      localStorage.setItem("access_token", res.access_token);

      const payload = parseJwt(res.access_token);
      setUsername(payload.sub);

      setMessage("✅ Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome Back</h1>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-medium block mb-1">Username</label>
            <input
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input
              type="password"
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="bg-black text-white p-2 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>

          <div className="flex justify-between text-sm mt-2">
            <button
              className="underline text-gray-600 hover:text-black transition cursor-pointer"
              onClick={() => navigate("/forgot")}
            >
              Forgot password?
            </button>

            <button
              className="underline text-gray-600 hover:text-black transition cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Create account
            </button>
          </div>

          {message && (
            <p className="text-center text-sm mt-3">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

