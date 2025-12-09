import CallStateManager from "./CallStateManager.js";

/**
 * @deprecated Use CallStateManager instead
 * This class is maintained for backward compatibility only
 */
class PresenceService extends CallStateManager {
    constructor(redis, io) {
        super(redis, io);
    }
}

export default PresenceService;
