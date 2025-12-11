import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../api/client";

export default function SubmittedSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await apiCall("/users/me", "GET", null, {
          Authorization: `Bearer ${access_token}`,
        });
        const data = await apiCall(`/study_sessions/users/${user.id}/submitted`);
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading sessions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (sessions.length === 0) return <div>No submitted sessions.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-semibold text-center mb-8">
        Submitted Study Sessions
      </h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {sessions.map((session) => (
          <li
            key={session.id}
            className="border border-gray-300 rounded-lg p-4 mb-4 hover:bg-gray-50 transition"
          >
            <Link to={`/study-session/${session.id}`} className="block">
              <p><strong>Session ID:</strong> {session.id}</p>
              <p><strong>Reading ID:</strong> {session.reading_id}</p>
              <p><strong>Submit time:</strong> {new Date(session.last_update).toLocaleString()}</p>
              {/* <p><strong>Score:</strong> {session.score}</p>
              <p><strong>Event:</strong> {session.last_event_type}</p> */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
