export default function EditModal({ provider, onClose, onSave }) {
  if (!provider) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Provider</h3>
        <p className="muted">This is a demo modal. Replace with real edit form.</p>
        <div className="modal-body">
          <div>
            <span>Email</span>
            <strong>{provider.email}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{provider.status}</strong>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
