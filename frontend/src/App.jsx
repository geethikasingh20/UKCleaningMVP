import { useEffect, useMemo, useState } from 'react';
import ContentHeader from './components/ContentHeader.jsx';
import FiltersSidebar from './components/FiltersSidebar.jsx';
import ProvidersTable from './components/ProvidersTable.jsx';
import EditModal from './components/EditModal.jsx';
import Toast from './components/Toast.jsx';

const API_ORIGIN = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const API_BASE = `${API_ORIGIN.replace(/\/$/, '')}/api/providers`;
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
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

function parseUsDate(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const normalized = trimmed.replace(/[-.]/g, '/');
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(normalized);
  if (!match) return '';

  const [, mmRaw, ddRaw, yyyy] = match;
  const mm = Number(mmRaw);
  const dd = Number(ddRaw);
  if (mm < 1 || mm > 12) return '';
  if (dd < 1 || dd > 31) return '';

  const mmStr = String(mm).padStart(2, '0');
  const ddStr = String(dd).padStart(2, '0');
  return `${yyyy}-${mmStr}-${ddStr}`;
}

function formatUsFromIso(value) {
  if (!value) return '';
  const [yyyy, mm, dd] = value.split('-');
  if (!yyyy || !mm || !dd) return '';
  return `${mm}/${dd}/${yyyy}`;
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
  const [filtersOpen, setFiltersOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setFiltersOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const todayIso = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const dateValidation = useMemo(() => {
    const startValue = draftFilters.startDate.trim();
    const endValue = draftFilters.endDate.trim();
    const startIso = startValue ? parseUsDate(startValue) : '';
    const endIso = endValue ? parseUsDate(endValue) : '';
    let startError = '';
    let endError = '';
    let rangeError = '';

    if (startValue && !startIso) {
      startError = 'Use MM/DD/YYYY format.';
    } else if (startIso && startIso > todayIso) {
      startError = 'Start date cannot be in the future.';
    }

    if (endValue && !endIso) {
      endError = 'Use MM/DD/YYYY format.';
    } else if (endIso && endIso > todayIso) {
      endError = 'End date cannot be in the future.';
    }

    if (!startError && !endError && startIso && endIso && endIso < startIso) {
      rangeError = 'End date cannot be before start date.';
    }

    const hasError = Boolean(startError || endError || rangeError);
    const message = startError || endError || rangeError || '';

    return { startIso, endIso, startError, endError, rangeError, hasError, message };
  }, [draftFilters, todayIso]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const currentPageIds = useMemo(
    () => providers.map((provider) => provider.id),
    [providers]
  );

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
        const enriched = (data.content || []).map((provider) => ({
          ...provider,
          signupDateFormatted: formatDate(provider.signupDate)
        }));
        setProviders(enriched);
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
    if (dateValidation.hasError) {
      setToast({ type: 'error', message: dateValidation.message });
      return;
    }
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
        <FiltersSidebar
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          dateValidation={dateValidation}
          todayIso={todayIso}
          statusOptions={statusOptions}
          vendorOptions={vendorOptions}
          offeringOptions={offeringOptions}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          formatUsFromIso={formatUsFromIso}
        />

        <main className="content">
          <ContentHeader
            sortBy={sortBy}
            sortDir={sortDir}
            columns={columns}
            searchInput={searchInput}
            onSearchChange={handleSearchChange}
            onSearchKey={handleSearchKey}
            onToggleFilters={() => setFiltersOpen((prev) => !prev)}
          />

          <ProvidersTable
            providers={providers}
            loading={loading}
            columns={columns}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onRowSelect={handleRowSelect}
            openModal={openModal}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </main>
      </div>

      <EditModal provider={modalProvider} onClose={closeModal} onSave={saveModal} />
      <Toast toast={toast} />
    </div>
  );
}





