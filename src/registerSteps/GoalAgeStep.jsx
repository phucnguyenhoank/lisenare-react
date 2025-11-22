const GOALS = [
  { id: 0, label: "General English" },
  { id: 1, label: "IELTS/TOEFL" },
  { id: 2, label: "Professional Skills" },
];

const AGES = [
  { id: 0, label: "Under 18" },
  { id: 1, label: "18–30" },
  { id: 2, label: "30–50" },
  { id: 3, label: "50+" },
];

export default function GoalAgeStep({ data, updateField, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Goals & Age</h2>
      <p className="text-gray-500 text-sm mb-4">You can skip and change this later.</p>

      <h3 className="font-semibold">Goal</h3>
      <div className="flex gap-2 mb-4 flex-wrap">
        {GOALS.map((g) => (
          <button
            key={g.id}
            className={`p-2 rounded border ${
              data.goal_type === g.id ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => updateField({ goal_type: g.id })}
          >
            {g.label}
          </button>
        ))}
      </div>

      <h3 className="font-semibold">Age Group</h3>
      <div className="flex gap-2 mb-4 flex-wrap">
        {AGES.map((a) => (
          <button
            key={a.id}
            className={`p-2 rounded border ${
              data.age_group === a.id ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => updateField({ age_group: a.id })}
          >
            {a.label}
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
