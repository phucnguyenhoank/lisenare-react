export default function EmailStep({ data, updateField, back, submit }) {
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const disabled = !isValidEmail(data.email);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Email Address</h2>
      <p className="text-red-700 bg-red-100 px-4 py-2 text-sm rounded-md border-l-4 border-red-500 mb-4">
        <span className="text-red-500 text-lg">⚠️</span>
        This email will be used in case you want to reset your password.
      </p>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Email"
        value={data.email}
        onChange={(e) => updateField({ email: e.target.value })}
      />

      <div className="flex gap-2">
        <button
          onClick={back}
          className="border p-2 cursor-pointer rounded w-1/2"
        >
          Back
        </button>

        <button
          onClick={submit}
          disabled={disabled}
          className={`p-2 cursor-pointer rounded w-1/2 text-white
            ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
        >
          Register
        </button>
      </div>
    </div>
  );
}
