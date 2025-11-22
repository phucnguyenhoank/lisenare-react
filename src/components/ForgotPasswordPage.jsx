import { useState } from "react";
import { apiCall } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [maskedEmail, setMaskedEmail] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  const maskEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");

    const domainName = domain.split(".")[0];
    const domainExt = domain.split(".")[1];

    return `${user.slice(0, 3)}***@${domainName.slice(0, 1)}***.${domainExt}`;
  };

  const sendOtp = async () => {
    if (!username.trim()) {
      setMessage("Please enter username.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await apiCall(
        `/auth/request-otp?username=${username}`,
        "POST"
      );

      const email = res?.email; // Make sure backend returns email

      setMaskedEmail(maskEmail(email));
      setOtpSent(true);
      setMessage(`OTP sent to ${maskEmail(email)}`);

      // Start 5 min countdown (300 seconds)
      setOtpCountdown(300);
      const timer = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("OTP request failed:", err);
      setMessage("User not found or failed to send OTP.");
    }

    setLoading(false);
  };

  const resetPassword = async () => {
    if (!otpValue || !newPassword) {
      setMessage("Please enter OTP and new password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await apiCall(
        "/auth/change-password",
        "POST",
        {
          username,
          otp: otpValue,
          new_password: newPassword,
        },
      );

      setMessage("Password reset successfully! You may login now.");
      setOtpSent(false);
      setOtpValue("");
      setNewPassword("");
    } catch (err) {
      console.error("Password reset failed:", err);
      setMessage("Invalid OTP or reset failed.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-xl bg-white shadow">
      <h1 className="text-xl font-semibold mb-4 text-center">
        Forgot Password
      </h1>

      {/* Message */}
      {message && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm mb-3">
          {message}
          {otpCountdown > 0 && otpSent && (
            <> ({otpCountdown}s remaining)</>
          )}
        </div>
      )}

      {/* Username */}
      <div className="mb-3">
        <label className="text-sm text-gray-600 block">Username</label>
        <input
          className="w-full border rounded px-2 py-1 mt-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={otpSent}
        />
      </div>

      {/* Send OTP Button */}
      {!otpSent && (
        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      )}

      {/* After OTP is sent */}
      {otpSent && (
        <>

          {/* OTP Input */}
          <div className="mt-3 flex items-center space-x-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="OTP"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
            />
            {/* {otpCountdown > 0 && (
              <span className="text-sm text-gray-500">
                {otpCountdown}s
              </span>
            )} */}
          </div>

          {/* New password */}
          <input
            className="w-full border rounded px-2 py-1 mt-3"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            onClick={resetPassword}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded mt-4"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </>

        
      )}
      
      <button
        className="text-blue-600 underline mt-6 block text-center w-full"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>
        
    </div>
    
  );
}
