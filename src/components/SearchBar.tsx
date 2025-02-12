import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blogs..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

<style>
  .search-bar {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .search-input {
    flex: 1;
  }

  @media (max-width: 768px) {
    .search-bar {
      flex-direction: column;
    }
  }
</style>
