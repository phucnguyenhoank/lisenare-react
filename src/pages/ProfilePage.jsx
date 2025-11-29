import { useEffect, useState, useRef } from "react";
import { apiCall } from "../api/client";
import ReadOnlyField from "../components/ReadOnlyField";
import EditableSelectField from "../components/EditableSelectField";
import PasswordChangeCard from "../components/PasswordChangeCard";
import PreferenceTopicsField from "../components/PreferenceTopicsField";
import { FIELD_CONFIG } from "../constants/userConfig";


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

  // Load user
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiCall("/users/me", "GET", null, {
          Authorization: `Bearer ${access_token}`,
        });
        setUser(data);
      } catch {
        setMessage("Failed to load profile");
      }
    }
    fetchUser();
  }, [access_token]);

  // Countdown
  useEffect(() => {
    if (otpCountdown <= 0) return;
    otpTimerRef.current = setInterval(() => {
      setOtpCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(otpTimerRef.current);
  }, [otpCountdown]);

  const handleEdit = (field) => {
    setEditing(field);
    setFormValue(String(user[field] ?? ""));
  };

  const handleSave = async (field) => {
    try {
      const updated = await apiCall(
        "/users/me",
        "PATCH",
        { [field]: Number(formValue) },
        { Authorization: `Bearer ${access_token}` }
      );
      setUser(updated);
      setEditing(null);
      setMessage("Updated successfully");
    } catch {
      setMessage("Update failed");
    }
  };

  const requestOtp = async () => {
    try {
      await apiCall(
        `/auth/request-otp?username=${user.username}`,
        "POST",
        null,
        { Authorization: `Bearer ${access_token}` }
      );
      setOtpMode("password");
      setOtpCountdown(300);
      setOtpValue("");
      setFormValue("");
    } catch {
      setMessage("Failed to send OTP");
    }
  };

  const handleOtpSubmit = async () => {
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
      setOtpMode(false);
      setMessage("Password updated");
    } catch {
      setMessage("Invalid OTP");
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading…</div>;
  
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">

      <ReadOnlyField label="Username" value={user.username} />
      <ReadOnlyField label="Email" value={user.email} />

      {Object.entries(FIELD_CONFIG).map(([key, cfg]) => (
        <EditableSelectField
          key={key}
          label={cfg.label}
          value={user[key]}
          options={cfg.options}
          editing={editing === key}
          onEdit={() => handleEdit(key)}
          onCancel={() => setEditing(null)}
          onSave={() => handleSave(key)}
          formValue={formValue}
          setFormValue={setFormValue}
        />
      ))}

      <PreferenceTopicsField user={user} accessToken={access_token} />

      <PasswordChangeCard
        otpMode={otpMode}
        formValue={formValue}
        otpValue={otpValue}
        otpCountdown={otpCountdown}
        setFormValue={setFormValue}
        setOtpValue={setOtpValue}
        requestOtp={requestOtp}
        handleOtpSubmit={handleOtpSubmit}
      />
    </div>
  );
}
