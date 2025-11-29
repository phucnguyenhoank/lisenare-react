export default function UsernameStep({ data, updateField, next }) {
  const handleNext = () => {
    if (!data.username.trim() || !data.password.trim()) {
      alert("Please enter username and password");
      return;
    }
    next();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>

      <input
        className="border p-2 w-full mb-3 rounded-lg"
        placeholder="Username"
        value={data.username}
        onChange={(e) => updateField({ username: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-3 rounded-lg"
        placeholder="Password"
        type="password"
        value={data.password}
        onChange={(e) => updateField({ password: e.target.value })}
      />

      <button onClick={handleNext} className="bg-black cursor-pointer text-white p-2 w-full rounded-lg">
        Next
      </button>
    </div>
  );
}
