import { useEffect, useState } from "react";
import { apiCall } from "../api/client";

export default function TopicStep({ data, updateField, next, back }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await apiCall("/topics/all", "GET");
        setTopics(res);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    }
    loadTopics();
  }, []);

  const toggle = (topicId) => {
    let newTopics = [...data.preference_topic_ids];
    if (newTopics.includes(topicId)) {
      newTopics = newTopics.filter((id) => id !== topicId);
    } else {
      newTopics.push(topicId);
    }
    updateField({ preference_topic_ids: newTopics });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Your Favorite Topics</h2>
      <p className="text-gray-500 text-sm mb-4">You can change this later.</p>

      {/* Topic list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {topics.map((t) => {
          const selected = data.preference_topic_ids.includes(t.id);

          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`
                w-full p-3 cursor-pointer rounded-lg border transition text-left
                ${selected
                  ? "bg-black text-white border-black shadow"
                  : "hover:bg-gray-100"
                }
              `}
            >
              {t.name}
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
