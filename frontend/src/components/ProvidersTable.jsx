export default function ProvidersTable({
  providers,
  loading,
  columns,
  sortBy,
  sortDir,
  onSort,
  selectedIds,
  onSelectAll,
  onRowSelect,
  openModal,
  page,
  totalPages,
  setPage
}) {
  const currentPageIds = providers.map((provider) => provider.id);
  const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} onClick={() => onSort(column.key)}>
                  <span>{column.label}</span>
                  {sortBy === column.key && (
                    <span className={`sort ${sortDir}`} aria-hidden="true" />
                  )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} className="loading">
                  Loading providers...
                </td>
              </tr>
            ) : providers.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="loading">
                  No providers found.
                </td>
              </tr>
            ) : (
              providers.map((provider) => (
                <tr key={provider.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(provider.id)}
                      onChange={(e) => onRowSelect(provider.id, e.target.checked)}
                    />
                  </td>
                  <td>{provider.email}</td>
                  <td>{provider.phoneNumber}</td>
                  <td>{provider.postcode}</td>
                  <td>{provider.vendorType}</td>
                  <td>{provider.serviceOffering}</td>
                  <td>{provider.signupDateFormatted}</td>
                  <td>
                    <span className={`status ${provider.status.toLowerCase()}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-btn edit"
                      onClick={() => openModal(provider)}
                      aria-label="Edit"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="btn ghost"
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </button>
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-btn ${page === index ? 'active' : ''}`}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="btn ghost"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
