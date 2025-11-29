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
      const data = await apiCall(`/context-search/search`, 'POST', { query });
      setResults(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const noResults = !loading && results.length === 0 && query.trim();

  return (
    <div className="min-h-screen bg-white py-10 px-4 text-black">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Context Search
        </h1>

        {/* Search Bar */}
        <form onSubmit={search} className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for quotes..."
            className="flex-1 px-3 py-2 border border-black rounded-xl bg-white text-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-black rounded-xl cursor-pointer bg-black text-white disabled:opacity-50"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-center mb-4 text-sm">
            {error}
          </div>
        )}

        {/* No results */}
        {noResults && (
          <p className="text-center text-sm text-gray-800">
            No quotes found.
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <VideoQuotePlayer quotes={results} query={query} />
        )}
      </div>
    </div>
  );
}
