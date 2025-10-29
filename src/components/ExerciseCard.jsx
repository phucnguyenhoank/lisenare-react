import { Link } from "react-router-dom";

export default function ExerciseCard({ exercise }) {
  return (
    <Link
      to={`/reading/${exercise.id}`}
      className="block bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
      <p className="text-gray-700 mb-4 line-clamp-3">{exercise.content_text}</p>

      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Difficulty: {exercise.difficulty}
        </span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Time: {exercise.estimated_time} min
        </span>
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
          Questions: {exercise.num_questions}
        </span>
      </div>
    </Link>
  );
}
