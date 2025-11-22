export default function EmailStep({ data, updateField, back, submit }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Email Address</h2>
      <p className="text-gray-500 text-sm mb-4">You can skip and change this later.</p>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Email (optional)"
        value={data.email}
        onChange={(e) => updateField({ email: e.target.value })}
      />

      <div className="flex gap-2">
        <button onClick={back} className="border p-2 rounded w-1/2">Back</button>
        <button onClick={submit} className="bg-green-600 text-white p-2 rounded w-1/2">
          Register
        </button>
      </div>
    </div>
  );
}
