import { GOALS, AGES } from "../constants/userConfig";

export default function GoalAgeStep({ data, updateField, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Goals & Age</h2>
      <p className="text-gray-500 text-sm mb-4">You can change this later.</p>

      {/* Goal Section */}
      <h3 className="font-semibold mb-2">Goal</h3>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-6">
        {GOALS.map((g) => {
          const selected = data.goal_type === g.id;
          return (
            <button
              key={g.id}
              onClick={() => updateField({ goal_type: g.id })}
              className={`
                p-3 rounded-lg border w-full sm:w-auto text-left transition
                ${selected
                  ? "bg-black text-white border-black shadow"
                  : "cursor-pointer hover:bg-gray-100"
                }
              `}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Age Section */}
      <h3 className="font-semibold mb-2">Age Group</h3>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-6">
        {AGES.map((a) => {
          const selected = data.age_group === a.id;
          return (
            <button
              key={a.id}
              onClick={() => updateField({ age_group: a.id })}
              className={`
                p-3 rounded-lg border w-full sm:w-auto text-left transition
                ${selected
                  ? "bg-black text-white border-black shadow"
                  : "cursor-pointer hover:bg-gray-100"
                }
              `}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          className="border p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-100"
        >
          Back
        </button>

        <button
          onClick={next}
          className="bg-black text-white p-2 px-6 cursor-pointer rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
