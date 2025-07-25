import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // API Call on debounced value
  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/search/users?q=${debouncedSearch}`);
        const data = await res.json();
        setResults(data.items || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>GitHub User Search</h2>
      <input
        type="text"
        placeholder="Search GitHub Users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', width: '250px' }}
      />
      <br /><br />

      {loading && <p>Loading...</p>}

      {!loading && results.length > 0 && (
        <ul>
          {results.map((user) => (
            <li key={user.id} style={{ margin: '10px 0', listStyle: 'none' }}>
              <img src={user.avatar_url} alt={user.login} width="40" style={{ borderRadius: '50%', marginRight: '10px' }} />
              <a href={user.html_url} target="_blank" rel="noreferrer">
                {user.login}
              </a>
            </li>
          ))}
        </ul>
      )}

      {!loading && debouncedSearch && results.length === 0 && (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default App;
