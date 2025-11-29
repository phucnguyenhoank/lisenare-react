import { useState, useEffect } from "react";
import { apiCall } from "../api/client";

export default function PreferenceTopicsField({ user, accessToken }) {
  const [allTopics, setAllTopics] = useState([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchTopics() {
      try {
        const topics = await apiCall("/topics/all", "GET");
        setAllTopics(topics);
      } catch {
        setMessage("Failed to load topics");
      }
    }

    fetchTopics();
  }, []);

  useEffect(() => {
    if (user?.preference_topics?.length) {
      setSelectedTopicIds(user.preference_topics.map((t) => t.id));
    }
  }, [user]);

  const toggleTopic = (id) => {
    if (selectedTopicIds.includes(id)) {
      setSelectedTopicIds(selectedTopicIds.filter((t) => t !== id));
    } else {
      setSelectedTopicIds([...selectedTopicIds, id]);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await apiCall(
        "/users/me",
        "PATCH",
        { preference_topic_ids: selectedTopicIds },
        { Authorization: `Bearer ${accessToken}` }
      );
      setMessage("Topics updated successfully");
      setEditing(false);
    } catch {
      setMessage("Failed to update topics");
    }
  };

  return (
    <div className="bg-white border p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500 font-medium">Preferred Topics</div>
        {!editing && (
          <button
            className="px-3 py-1 bg-gray-100 border rounded text-sm"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            {allTopics.map((topic) => (
              <label key={topic.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTopicIds.includes(topic.id)}
                  onChange={() => toggleTopic(topic.id)}
                />
                <span className="text-gray-800">{topic.name}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-2 mt-3">
            <button
              className="px-3 py-1 bg-black text-white rounded text-sm"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <ul className="list-disc ml-5 space-y-1">
          {selectedTopicIds.length
            ? selectedTopicIds
                .map((id) => allTopics.find((t) => t.id === id)?.name)
                .filter(Boolean)
                .map((name) => (
                  <li key={name} className="text-gray-800">
                    {name}
                  </li>
                ))
            : <li className="text-gray-500 text-sm">No topics selected.</li>
          }
        </ul>
      )}

      {message && <div className="text-sm text-green-600 mt-2">{message}</div>}
    </div>
  );
}
