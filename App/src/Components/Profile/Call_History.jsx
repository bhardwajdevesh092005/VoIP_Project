const CallHistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Call History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {history.length > 0 ? (
          <ul className="space-y-3">
            {history.map((call, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2 text-gray-700"
              >
                <span>{call.name}</span>
                <span className="text-sm text-gray-500">{call.time}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No call history available.</p>
        )}
      </div>
    </div>
  );
};

export default CallHistoryModal;
