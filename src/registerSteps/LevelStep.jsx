import { LEVELS } from "../constants/userConfig";

export default function LevelStep({ data, updateField, next, back }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your English Level</h2>
      <p className="text-gray-500 text-sm mb-4">You can change this later.</p>

      {/* Level options */}
      <div className="flex flex-col gap-2 mb-6">
        {LEVELS.map((level) => {
          const selected = data.user_level === level.id;

          return (
            <button
              key={level.id}
              onClick={() => updateField({ user_level: level.id })}
              className={`
                w-full p-3 cursor-pointer rounded-lg border text-left transition
                ${selected ? "bg-black text-white border-black shadow" : "hover:bg-gray-100"}
              `}
            >
              <div className="font-semibold">{level.code}</div>
              <div className="text-sm opacity-80">{level.label}</div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button onClick={back} className="border p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-100">
          Back
        </button>

        <button onClick={next} className="bg-black text-white p-2 px-6 cursor-pointer rounded-lg">
          Next
        </button>
      </div>
    </div>
  );
}

