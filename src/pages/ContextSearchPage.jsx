import { useState } from 'react';
import { apiCall } from '../api/client';
import VideoQuotePlayer from '../components/VideoQuotePlayer';

export default function ContextSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await apiCall(`/context-search/search?q=${encodeURIComponent(query)}`);
      setResults(data || []);
    } catch (err) {
      setError('Failed to search. Check console or server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Context Search
        </h1>

        <form onSubmit={search} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for quotes... (e.g. jump off)"
            className="w-full px-4 py-3 text-base sm:text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md transition duration-200"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="text-red-600 text-center font-medium mb-4">{error}</div>
        )}

        {results.length > 0 && <VideoQuotePlayer quotes={results} />}
      </div>
    </div>
  );
}
