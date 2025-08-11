// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const CallRinging = () => {
  const caller = useSelector(state=>state.call.callFrom)
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-lg p-5 w-80 flex items-center gap-4 z-50"
    >
      <img
        src={caller.img}
        alt={caller.name}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800">{caller.name}</h2>
        <p className="text-sm text-gray-500">Incoming call...</p>
        <div className="flex gap-3 mt-3">
          <button
            // onClick={onAccept}
            className="bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600 transition"
          >
            Accept
          </button>
          <button
            // onClick={onReject}
            className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 transition"
          >
            Reject
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CallRinging;
