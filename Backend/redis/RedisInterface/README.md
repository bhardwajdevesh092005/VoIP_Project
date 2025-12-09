# Redis Interface - Domain-Separated Managers

This directory contains Redis managers separated by domain responsibility for better maintainability and testing.

## Structure

### Core Managers

#### `PresenceManager.js`
Manages user online/offline presence and friend notifications.

**Key Methods:**
- `markOnline(userId)` - Mark user as online, notify friends
- `markOffline(userId)` - Mark user as offline, notify friends
- `markInCall(userId)` - Move user to in-call state
- `markOutOfCall(userId)` - Move user back to online state
- `isOnline(userId)` - Check if user is online
- `isInCall(userId)` - Check if user is in a call
- `getOnlineFriends(userId)` - Get list of online friends
- `getAllFriends(userId)` - Get all friends
- `addFriend(userId1, userId2)` - Add friend relationship
- `removeFriend(userId1, userId2)` - Remove friend relationship

#### `CallRequestManager.js`
Manages pending call requests (before they become active calls).

**Key Methods:**
- `createCallRequest(callerId, calleeId, offer)` - Create new call request
- `getCallRequest(callerId, calleeId)` - Get call request data
- `deleteCallRequest(callerId, calleeId)` - Delete call request
- `getPendingIncomingCall(userId)` - Get user's pending incoming call
- `getPendingOutgoingCall(userId)` - Get user's pending outgoing call

#### `ActiveCallManager.js`
Manages active calls and call history persistence.

**Key Methods:**
- `createActiveCall(callerId, calleeId, offer, answer)` - Create active call
- `markCallConnected(callId)` - Mark call as connected (on first ICE)
- `getActiveCall(callId)` - Get call data by ID
- `getUserCurrentCall(userId)` - Get user's current active call
- `endActiveCall(callId, options)` - End call and optionally persist to DB
- `setActiveCallExpiry(callId, ttl)` - Set TTL on call (both users offline)
- `removeActiveCallExpiry(callId)` - Remove TTL (user reconnected)
- `persistCallHistory(callData, meta)` - Save call record to PostgreSQL

**Call Persistence:**
Only calls with `status: "connected"` are persisted to the database. The call is marked as connected when ICE candidates start flowing (first `handleIceCandidate` event).

Persistence happens when:
- User explicitly ends the call (`call:end` event)
- Both users stay offline for 60 seconds (cleanup timeout)
- Call cleanup on user disconnect

Database record includes:
- Duration (seconds)
- Start time (connectedAt timestamp)
- End time (when call ended)
- Both user IDs (connected via many-to-many relation)

### Unified Manager

#### `CallStateManager.js`
Combines all three managers and provides utility methods for checking call state and cleanup operations.

**Usage:**
```javascript
import CallStateManager from './redis/RedisInterface/CallStateManager.js';

const manager = new CallStateManager(redisClient, socketIoServer);

// All methods from PresenceManager, CallRequestManager, and ActiveCallManager
await manager.markOnline(userId);
await manager.createCallRequest(callerId, calleeId, offer);
await manager.endActiveCall(callId, { persist: true, reason: "user-ended" });
```

**Additional Methods:**
- `areBothUsersOffline(callId)` - Check if both call participants are offline
- `cleanupUserCallState(userId)` - Clean up all call-related state for a user

### Backward Compatibility

#### `WebRTC_Redis.js`
Thin wrapper around `CallStateManager` for backward compatibility. Existing code using `PresenceService` will continue to work without changes.

**Status:** Deprecated - new code should use `CallStateManager` directly.

## Migration Guide

### Old Code
```javascript
import PresenceService from '../../redis/RedisInterface/WebRTC_Redis.js';

const presenceManager = new PresenceService(redis, io);
await presenceManager.markOnline(userId);
await presenceManager.createCallRequest(callerId, calleeId, offer);
```

### New Code (Recommended)
```javascript
import CallStateManager from '../../redis/RedisInterface/CallStateManager.js';

const callStateManager = new CallStateManager(redis, io);
await callStateManager.markOnline(userId);
await callStateManager.createCallRequest(callerId, calleeId, offer);
```

### Importing Specific Managers
```javascript
import { PresenceManager, CallRequestManager, ActiveCallManager } from '../../redis/RedisInterface/index.js';

// Use individual managers if you only need specific functionality
const presenceManager = new PresenceManager(redis, io);
const callRequestManager = new CallRequestManager(redis);
const activeCallManager = new ActiveCallManager(redis);
```

## File Organization

```
redis/RedisInterface/
├── index.js                  # Exports all managers
├── redisKeys.js             # Redis key constants
├── PresenceManager.js       # User presence & friends
├── CallRequestManager.js    # Pending call requests
├── ActiveCallManager.js     # Active calls & persistence
├── CallStateManager.js      # Unified manager
└── WebRTC_Redis.js         # Backward compatibility wrapper (deprecated)
```

## Testing

Each manager can be tested independently:

```javascript
// Test PresenceManager in isolation
const presenceManager = new PresenceManager(mockRedis, mockIo);

// Test CallRequestManager without presence logic
const callRequestManager = new CallRequestManager(mockRedis);

// Test ActiveCallManager with mock database
const activeCallManager = new ActiveCallManager(mockRedis);
```

## Best Practices

1. **Use CallStateManager** for WebRTC connection handling (combines all functionality)
2. **Use individual managers** for focused operations (e.g., only updating presence)
3. **Always persist calls** when ending via `endActiveCall({ persist: true })`
4. **Mark calls as connected** when ICE candidates start flowing
5. **Handle cleanup** using `cleanupUserCallState` on user disconnect
