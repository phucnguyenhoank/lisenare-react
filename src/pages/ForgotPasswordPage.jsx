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
      const res = await apiCall(`/auth/request-otp?username=${username}`, "POST");
      const email = res?.email;
      setMaskedEmail(maskEmail(email));
      setOtpSent(true);
      setMessage(`OTP sent to ${maskEmail(email)}`);
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
      await apiCall("/auth/change-password", "POST", {
        username,
        otp: otpValue,
        new_password: newPassword,
      });

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md border">
        
        <h1 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h1>

        {/* Message */}
        {message && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm mb-3 text-center">
            {message}
            {otpCountdown > 0 && otpSent && <> ({otpCountdown}s remaining)</>}
          </div>
        )}

        {/* Username */}
        {!otpSent && (
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-1">Username</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-3 bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 cursor-pointer transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* OTP & New Password */}
        {otpSent && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">OTP</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:opacity-90 cursor-pointer transition mt-2"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* Back to login */}
        <button
          className="mt-6 block text-center w-full text-gray-600 underline hover:text-black cursor-pointer transition"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}
