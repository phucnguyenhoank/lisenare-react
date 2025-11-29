export default function PasswordChangeCard({
  otpMode,
  formValue,
  otpValue,
  otpCountdown,
  setFormValue,
  setOtpValue,
  requestOtp,
  handleOtpSubmit,
}) {
  return (
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
                {otpCountdown}s
              </span>
            )}
          </div>

          <button
            onClick={handleOtpSubmit}
            className="mt-2 px-3 py-1 bg-black text-white rounded text-sm"
          >
            Confirm
          </button>
        </>
      )}
    </div>
  );
}
