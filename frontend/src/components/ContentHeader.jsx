export default function ContentHeader({
  sortBy,
  sortDir,
  columns,
  searchInput,
  onSearchChange,
  onSearchKey,
  onToggleFilters
}) {
  return (
    <div className="content-header">
      <div>
        <h2>Waitlist Table</h2>
        <p className="muted">
          Sorted {sortDir.toUpperCase()} by {columns.find((c) => c.key === sortBy)?.label}
        </p>
      </div>
      <div className="content-actions">
        <button className="filters-toggle" onClick={onToggleFilters}>
          Filters
        </button>
        <div className="search">
          <input
            type="search"
            placeholder="Search providers"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onSearchKey}
          />
          <span className="search-icon">Go</span>
        </div>
      </div>
    </div>
  );
}
