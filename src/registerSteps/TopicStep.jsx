import { useEffect, useState } from "react";
import { getAllTopics } from "../api/topics";

export default function TopicStep({ data, updateField, next, back }) {
  const [topics, setTopics] = useState([]);

  // Fetch topics from API on mount
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await getAllTopics();
        setTopics(res);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    }
    loadTopics();
  }, []);

  // Toggle selected topic ID
  const toggle = (topicId) => {
    let newTopics = [...data.topics];
    if (newTopics.includes(topicId)) {
      newTopics = newTopics.filter((id) => id !== topicId);
    } else {
      newTopics.push(topicId);
    }
    updateField({ topics: newTopics });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Favorite Topics</h2>
      <p className="text-gray-500 text-sm mb-4">
        You can skip and change this later.
      </p>

      {/* List of topic buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {topics.map((t) => (
          <button
            key={t.id}
            className={`p-2 rounded border ${
              data.topics.includes(t.id)
                ? "bg-blue-600 text-white"
                : ""
            }`}
            onClick={() => toggle(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button onClick={back} className="border p-2 rounded w-1/2">
          Back
        </button>
        <button onClick={next} className="bg-blue-600 text-white p-2 rounded w-1/2">
          Next
        </button>
      </div>
    </div>
  );
}
