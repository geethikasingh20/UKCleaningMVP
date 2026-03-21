import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8080/api/providers';
const PAGE_SIZE = 10;

const vendorOptions = ['Independent', 'Company'];
const offeringOptions = ['Housekeeping', 'Window Cleaning', 'Car Valet'];
const statusOptions = ['Onboarded', 'Rejected'];

const initialFilters = {
  postcode: '',
  status: '',
  startDate: '',
  endDate: '',
  vendorType: '',
  serviceOffering: ''
};

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'postcode', label: 'Postcode' },
  { key: 'vendorType', label: 'Vendor Type' },
  { key: 'serviceOffering', label: 'Service Offering' },
  { key: 'signupDate', label: 'Signup Date' },
  { key: 'status', label: 'Status' }
];

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB');
}

function parseUsDate(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) return '';
  const [, mm, dd, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('signupDate');
  const [sortDir, setSortDir] = useState('desc');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [modalProvider, setModalProvider] = useState(null);
  const [toast, setToast] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const currentPageIds = useMemo(
    () => providers.map((provider) => provider.id),
    [providers]
  );

  const allSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.has(id));

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', PAGE_SIZE.toString());
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);

    if (debouncedSearch.trim()) {
      params.set('search', debouncedSearch.trim());
    }

    if (filters.postcode.trim()) params.set('postcode', filters.postcode.trim());
    if (filters.status) params.set('status', filters.status);
    if (filters.vendorType) params.set('vendorType', filters.vendorType);
    if (filters.serviceOffering) params.set('serviceOffering', filters.serviceOffering);

    const startDate = parseUsDate(filters.startDate);
    const endDate = parseUsDate(filters.endDate);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    async function fetchProviders() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}?${params.toString()}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setProviders(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load providers', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
    return () => controller.abort();
  }, [page, sortBy, sortDir, debouncedSearch, filters]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (checked) {
        currentPageIds.forEach((id) => updated.add(id));
      } else {
        currentPageIds.forEach((id) => updated.delete(id));
      }
      return updated;
    });
  };

  const handleRowSelect = (id, checked) => {
    setSelectedIds((prev) => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setPage(0);
    setToast({ type: 'success', message: 'Filters applied successfully.' });
  };

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setPage(0);
    setToast({ type: 'success', message: 'Filters cleared.' });
  };

  const handleSearchKey = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(searchInput.trim());
      setPage(0);
    }
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setSearchTerm(value.trim());
    setPage(0);
  };

  const openModal = (provider) => {
    setModalProvider(provider);
  };

  const closeModal = () => {
    setModalProvider(null);
  };

  const saveModal = () => {
    setModalProvider(null);
    setToast({ type: 'success', message: 'Provider updated (demo).' });
  };

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Waitlist</p>
          <h1>Service Providers</h1>
          <p className="subtitle">
            Review onboarding status, update vendor details, and keep the waitlist tidy.
          </p>
        </div>
        <div className="stat-card">
          <div>
            <span className="stat-label">Selected</span>
            <strong>{selectedIds.size}</strong>
          </div>
          <div>
            <span className="stat-label">Results</span>
            <strong>{providers.length}</strong>
          </div>
        </div>
      </div>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Filters</h2>
            <span className="chip">UK Waitlist</span>
          </div>

          <label className="field">
            <span>Postcode</span>
            <input
              type="text"
              placeholder="e.g. SW1A 1AA"
              value={draftFilters.postcode}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, postcode: e.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Registration Status</span>
            <select
              value={draftFilters.status}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">Any status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="field">
            <span>Date Registered</span>
            <div className="date-grid">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={draftFilters.startDate}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={draftFilters.endDate}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>

          <label className="field">
            <span>Vendor Type</span>
            <select
              value={draftFilters.vendorType}
              onChange={(e) =>
                setDraftFilters((prev) => ({ ...prev, vendorType: e.target.value }))
              }
            >
              <option value="">All vendors</option>
              {vendorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Service Offering</span>
            <select
              value={draftFilters.serviceOffering}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  serviceOffering: e.target.value
                }))
              }
            >
              <option value="">All services</option>
              {offeringOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="sidebar-actions">
            <button className="btn primary" onClick={applyFilters}>
              Apply Filters
            </button>
            <button className="btn ghost" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </aside>

        <main className="content">
          <div className="content-header">
            <div>
              <h2>Waitlist Table</h2>
              <p className="muted">Sorted {sortDir.toUpperCase()} by {columns.find(c => c.key === sortBy)?.label}</p>
            </div>
            <div className="search">
              <input
                type="search"
                placeholder="Search providers"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKey}
              />
              <span className="search-icon">?</span>
            </div>
          </div>

          <div className="table-card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    {columns.map((column) => (
                      <th key={column.key} onClick={() => handleSort(column.key)}>
                        <span>{column.label}</span>
                        {sortBy === column.key && (
                          <span className="sort">{sortDir === 'asc' ? '?' : '?'}</span>
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
                            onChange={(e) => handleRowSelect(provider.id, e.target.checked)}
                          />
                        </td>
                        <td>{provider.email}</td>
                        <td>{provider.phoneNumber}</td>
                        <td>{provider.postcode}</td>
                        <td>{provider.vendorType}</td>
                        <td>{provider.serviceOffering}</td>
                        <td>{formatDate(provider.signupDate)}</td>
                        <td>
                          <span className={`status ${provider.status.toLowerCase()}`}>
                            {provider.status}
                          </span>
                        </td>
                        <td>
                          <button className="icon-btn" onClick={() => openModal(provider)}>
                            ?
                          </button>
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
        </main>
      </div>

      {modalProvider && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Provider</h3>
            <p className="muted">This is a demo modal. Replace with real edit form.</p>
            <div className="modal-body">
              <div>
                <span>Email</span>
                <strong>{modalProvider.email}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{modalProvider.status}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={closeModal}>Cancel</button>
              <button className="btn primary" onClick={saveModal}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
