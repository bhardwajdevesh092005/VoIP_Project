const ContactRequestCard = ({ name, phone, onAccept, onReject }) => {
  return (
    <li className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-lg font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-500">{phone}</p>
      </div>
      <div className="flex gap-3">
        {/* Accept Button */}
        <button
          onClick={onAccept}
          className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          {/* Tick icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Accept
        </button>

        {/* Reject Button */}
        <button
          onClick={onReject}
          className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          {/* Cross icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Reject
        </button>
      </div>
    </li>
  );
};

export default ContactRequestCard;
