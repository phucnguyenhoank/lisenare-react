const LEVELS = [
  { id: 0, code: "A1", label: "Beginner" },
  { id: 1, code: "A2", label: "Elementary" },
  { id: 2, code: "B1", label: "Intermediate" },
  { id: 3, code: "B2", label: "Upper Intermediate" },
  { id: 4, code: "C1", label: "Advanced" },
  { id: 5, code: "C2", label: "Proficiency" },
];

export default function LevelStep({ data, updateField, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your English Level</h2>
      <p className="text-gray-500 text-sm mb-4">You can skip and change this later.</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            className={`p-2 rounded border ${
              data.user_level === level.id ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => updateField({ user_level: level.id })}
          >
            {level.code} – {level.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={back} className="border p-2 rounded w-1/2">Back</button>
        <button onClick={next} className="bg-blue-600 text-white p-2 rounded w-1/2">Next</button>
      </div>
    </div>
  );
}
