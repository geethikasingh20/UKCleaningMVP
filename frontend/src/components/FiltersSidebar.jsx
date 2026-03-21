export default function FiltersSidebar({
  filtersOpen,
  setFiltersOpen,
  draftFilters,
  setDraftFilters,
  dateValidation,
  todayIso,
  statusOptions,
  vendorOptions,
  offeringOptions,
  applyFilters,
  clearFilters,
  formatUsFromIso
}) {
  return (
    <aside className={`sidebar ${filtersOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button
          className="filters-toggle"
          onClick={() => setFiltersOpen(false)}
          aria-label="Close filters"
        >
          Close
        </button>
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
        <div className="date-stack">
          <label className="date-field">
            <span>Start date</span>
            <div className="date-input">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={draftFilters.startDate}
                className={dateValidation.startError ? 'invalid' : ''}
                aria-invalid={Boolean(dateValidation.startError)}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
              <button
                type="button"
                className="calendar-btn"
                onClick={(e) => {
                  const target = e.currentTarget
                    .closest('.date-input')
                    ?.querySelector('input[type="date"]');
                  target?.showPicker?.();
                  target?.focus?.();
                }}
                aria-label="Pick start date"
              >
                CAL
              </button>
              <input
                type="date"
                className="date-picker"
                max={todayIso}
                value={dateValidation.startIso}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    startDate: formatUsFromIso(e.target.value)
                  }))
                }
              />
            </div>
            {dateValidation.startError && (
              <p className="error-text">{dateValidation.startError}</p>
            )}
          </label>
          <label className="date-field">
            <span>End date</span>
            <div className="date-input">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={draftFilters.endDate}
                className={dateValidation.endError || dateValidation.rangeError ? 'invalid' : ''}
                aria-invalid={Boolean(dateValidation.endError || dateValidation.rangeError)}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
              <button
                type="button"
                className="calendar-btn"
                onClick={(e) => {
                  const target = e.currentTarget
                    .closest('.date-input')
                    ?.querySelector('input[type="date"]');
                  target?.showPicker?.();
                  target?.focus?.();
                }}
                aria-label="Pick end date"
              >
                CAL
              </button>
              <input
                type="date"
                className="date-picker"
                max={todayIso}
                min={dateValidation.startIso || undefined}
                value={dateValidation.endIso}
                onChange={(e) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    endDate: formatUsFromIso(e.target.value)
                  }))
                }
              />
            </div>
            {dateValidation.endError && (
              <p className="error-text">{dateValidation.endError}</p>
            )}
            {dateValidation.rangeError && (
              <p className="error-text">{dateValidation.rangeError}</p>
            )}
          </label>
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
        <button className="btn primary" onClick={applyFilters} disabled={dateValidation.hasError}>
          Apply Filters
        </button>
        <button className="btn ghost" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </aside>
  );
}





