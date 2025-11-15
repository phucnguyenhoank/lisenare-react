import { useState } from "react";
import { registerOrLogin } from "../api/users";

export default function UserRegisterForm() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Please wait...");

    try {
      const res = await registerOrLogin(username);
      setMessage(`✅ Logged in as ${res.user.username}`);
    } catch (err) {
      setMessage("❌ " + err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="border p-2 rounded"
      />

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Register / Login
      </button>

      <p>{message}</p>
    </form>
  );
}
