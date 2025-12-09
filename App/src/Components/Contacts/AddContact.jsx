import { useState } from 'react';
import UserSearch from './UserSearch';
import { contactAPI } from '../../Utils/api';

const AddContact = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    setMessage({ type: '', text: '' });
    console.log('Selected user for contact request:', user);
    try {
      await contactAPI.sendRequest(user.email);

      setMessage({
        type: 'success',
        text: `Contact request sent to ${user.fullName}!`,
      });

      // Clear selected user after success
      setTimeout(() => {
        setSelectedUser(null);
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending contact request:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send contact request',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Contact</h1>

      {/* Search Component */}
      <div className="mb-6">
        <UserSearch onUserSelect={handleUserSelect} />
      </div>

      {/* Status Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-400'
              : 'bg-red-100 text-red-800 border border-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Selected User Preview */}
      {selectedUser && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">
            Sending request to:
          </h2>
          <div className="flex items-center">
            <img
              src={selectedUser.profilePicture || '/default-avatar.png'}
              alt={selectedUser.fullName}
              className="w-16 h-16 rounded-full object-cover mr-4"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div>
              <p className="font-semibold text-gray-900">{selectedUser.fullName}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          </div>
          {loading && (
            <div className="mt-3 flex items-center text-blue-600">
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending contact request...
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How to add contacts:</h3>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Search for users by their name or email</li>
          <li>Click on a user to send them a contact request</li>
          <li>They will receive your request and can accept or decline</li>
          <li>Once accepted, you can start calling each other</li>
        </ul>
      </div>
    </div>
  );
};

export default AddContact;
