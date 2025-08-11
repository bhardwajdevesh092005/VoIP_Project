const UserCard = ({ img, name, phone, status, statusColor = "text-gray-500" }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center w-64">
      <img
        src={img}
        alt={name}
        className="w-24 h-24 rounded-full border-4 border-indigo-500"
      />
      <h2 className="mt-4 text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-500">{phone}</p>
      {status && (
        <p
          className={`mt-3 font-medium ${
            statusColor === "pulse" ? "text-indigo-500 animate-pulse" : statusColor
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default UserCard;
