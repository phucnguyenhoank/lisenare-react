import { useEffect, useState, useRef } from "react";
import { apiCall } from "../api/client";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formValue, setFormValue] = useState("");
  const [otpMode, setOtpMode] = useState(false); // "password" | false
  const [otpValue, setOtpValue] = useState("");
  const [message, setMessage] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const otpTimerRef = useRef(null);

  const access_token = localStorage.getItem("access_token");

  // Load user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiCall("/users/me", "GET", null, {
          Authorization: `Bearer ${access_token}`,
        });
        setUser(data);
      } catch (err) {
        console.error("Fetch user failed:", err);
        setMessage("Failed to load profile");
      }
    }
    fetchUser();
  }, [access_token]);

  // OTP countdown
  useEffect(() => {
    if (otpCountdown <= 0) {
      clearInterval(otpTimerRef.current);
      return;
    }
    otpTimerRef.current = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(otpTimerRef.current);
  }, [otpCountdown]);

  const handleEdit = (field) => {
    if (field === "username" || field === "email") return;
    setEditing(field);
    setFormValue(user[field]?.toString() || "");
  };

  const handleSave = async (field) => {
    try {
      const updated = await apiCall(
        "/users/me",
        "PATCH",
        { [field]: formValue },
        { Authorization: `Bearer ${access_token}` }
      );
      setUser(updated);
      setEditing(null);
      setMessage(`${field} updated successfully`);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Error updating field");
    }
  };

  // Request OTP for password
  const requestOtp = async () => {
    try {
      await apiCall(`/auth/request-otp?username=${user.username}`, "POST", null, {
        Authorization: `Bearer ${access_token}`,
      });
      setOtpMode("password");
      setMessage("OTP sent to your email!");
      setOtpCountdown(300);
      setOtpValue("");
      setFormValue("");
    } catch (err) {
      console.error("OTP request failed:", err);
      setMessage("Failed to request OTP");
    }
  };

  // Submit OTP
  const handleOtpSubmit = async () => {
    if (!otpValue || !formValue) {
      setMessage("Please enter both OTP and new password");
      return;
    }

    try {
      await apiCall(
        "/auth/change-password",
        "POST",
        {
          username: user.username,
          otp: otpValue,
          new_password: formValue,
        },
        { Authorization: `Bearer ${access_token}` }
      );

      setMessage("Password updated successfully!");
      setOtpMode(false);
      setOtpValue("");
      setFormValue("");
      setOtpCountdown(0);
    } catch (err) {
      console.error("OTP verify/update failed:", err);
      setMessage("Invalid OTP or update failed");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>

      {/* Username (read-only) */}
      <div className="flex items-center justify-between bg-white border p-3 rounded-lg">
        <div>
          <div className="text-sm text-gray-500">Username</div>
          <div className="font-medium text-gray-800">{user.username}</div>
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="flex items-center justify-between bg-white border p-3 rounded-lg">
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-medium text-gray-800">{user.email}</div>
        </div>
      </div>

      {/* Editable profile values */}
      {["user_level", "goal_type", "age_group"].map((field) => (
        <div key={field} className="flex items-center justify-between bg-white border p-3 rounded-lg">
          <div>
            <div className="text-sm text-gray-500">{field.replace("_", " ")}</div>
            {editing === field ? (
              <input
                className="mt-1 w-full border rounded px-2 py-1 text-gray-700"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                autoFocus
              />
            ) : (
              <div className="font-medium text-gray-800">
                {user[field]?.toString()}
              </div>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            {editing === field ? (
              <>
                <button
                  onClick={() => handleSave(field)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(field)}
                className="px-3 py-1 bg-gray-100 border rounded text-sm"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Password change with OTP */}
      <div className="flex flex-col bg-white border p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Password</div>
            <div className="font-medium text-gray-800">********</div>
          </div>
          <button
            onClick={requestOtp}
            className="px-3 py-1 bg-gray-100 border rounded text-sm"
          >
            Send OTP & Change
          </button>
        </div>

        {otpMode === "password" && (
          <>
            <input
              className="mt-2 w-full border rounded px-2 py-1 text-gray-700"
              type="password"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="New password"
            />
            <div className="mt-2 flex items-center space-x-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-gray-700"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="Enter OTP"
              />
              {otpCountdown > 0 && (
                <span className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
                  {otpCountdown}s remaining
                </span>
              )}
            </div>
            <button
              onClick={handleOtpSubmit}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Confirm
            </button>
          </>
        )}
      </div>

      {/* Topics */}
      <div className="bg-white border p-3 rounded-lg">
        <div className="text-sm text-gray-500 mb-2">Preferred Topics</div>
        {user.preference_topics?.length > 0 ? (
          <ul className="list-disc ml-5 space-y-1">
            {user.preference_topics.map((topic) => (
              <li key={topic.id} className="text-gray-800">{topic.name}</li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-sm">No topics selected.</div>
        )}
      </div>
    </div>
  );
}
