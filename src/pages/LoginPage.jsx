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

      // Decode username from token and update context
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
    <div className="max-w-sm mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-center">Login</h1>

      <input
        className="border p-2 rounded"
        placeholder="Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white p-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        className="text-blue-600 underline p-2 rounded"
        onClick={() => navigate("/register")}
      >
        Register
      </button>

      <button
        className="text-blue-600 underline p-2 rounded"
        onClick={() => navigate("/forgot")}
      >
        Forgot your password?
      </button>

      {message && <p className="text-center">{message}</p>}
    </div>
  );
}
