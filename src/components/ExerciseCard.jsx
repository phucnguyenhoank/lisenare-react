import React from "react";

export default function ExerciseCard({ exercise }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
      <p className="text-gray-700 mb-3">{exercise.description}</p>
      
      <div className="flex flex-wrap gap-2">
        {exercise.tags.map(tag => (
          <span key={tag.tag_id} className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
            {tag.type}: {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
