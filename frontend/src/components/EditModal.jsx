export default function EditModal({ provider, onClose, onSave }) {
  if (!provider) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>User Details</h3>

        <div className="modal-section">
          <h4>Contact Details</h4>
          <div className="detail-row">
            <span className="detail-icon email" aria-hidden="true" />
            <span>{provider.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon phone" aria-hidden="true" />
            <span>{provider.phoneNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon location" aria-hidden="true" />
            <span>United Kingdom</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon calendar" aria-hidden="true" />
            <span>{provider.signupDateFormatted || provider.signupDate}</span>
          </div>
        </div>

        <div className="modal-section">
          <h4>Customer Details</h4>
          <div className="detail-row">
            <span className="detail-label">Vendor Type</span>
            <span>{provider.vendorType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Service Offering</span>
            <span>{provider.serviceOffering}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
