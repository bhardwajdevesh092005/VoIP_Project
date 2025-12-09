# Redis Interface Architecture

## Domain Separation

```
┌─────────────────────────────────────────────────────────────┐
│                    CallStateManager                         │
│  (Unified interface - delegates to domain managers)         │
└────────┬──────────────────┬──────────────────┬──────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ PresenceManager│  │CallRequestManager│  │ActiveCallManager │
│                │  │                  │  │                  │
│ • Online/      │  │ • Pending calls  │  │ • Active calls   │
│   Offline      │  │ • Call requests  │  │ • ICE tracking   │
│ • In-call      │  │ • Request TTL    │  │ • Call history   │
│ • Friends      │  │ • Request lookup │  │ • Persistence    │
└────────────────┘  └──────────────────┘  └──────────────────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Redis     │
                    │  (Key-Value  │
                    │   Storage)   │
                    └──────────────┘
```

## Call Lifecycle Flow

```
1. CALL INITIATION
   ┌──────────────┐
   │ Call Request │  ← CallRequestManager.createCallRequest()
   │  (Pending)   │    - 60s TTL
   └──────────────┘    - Stored in Redis

2. CALL ACCEPTANCE
   ┌──────────────┐
   │ Active Call  │  ← ActiveCallManager.createActiveCall()
   │   (Created)  │    - status: "active"
   └──────────────┘    - Both users linked

3. ICE CANDIDATES FLOWING
   ┌──────────────┐
   │ Active Call  │  ← ActiveCallManager.markCallConnected()
   │  (Connected) │    - status: "connected"
   └──────────────┘    - connectedAt: timestamp
                       - Ready for persistence

4. CALL ENDING
   ┌──────────────┐
   │ Call History │  ← ActiveCallManager.endActiveCall({ persist: true })
   │  (Persisted) │    - Duration calculated
   └──────────────┘    - Saved to PostgreSQL
                       - Removed from Redis
```

## Presence State Machine

```
        ┌─────────┐
        │ OFFLINE │
        └────┬────┘
             │ markOnline()
             ▼
        ┌─────────┐
        │ ONLINE  │ ←──────────┐
        └────┬────┘            │
             │ markInCall()    │ markOutOfCall()
             ▼                 │
        ┌─────────┐            │
        │ IN-CALL │ ───────────┘
        └────┬────┘
             │ markOffline()
             ▼
        ┌─────────┐
        │ OFFLINE │
        └─────────┘
```

## Redis Data Structure

```
presence:online                    SET     → Online user IDs
presence:incall                    SET     → In-call user IDs
user:{userId}:friends              SET     → User's friend IDs (24h TTL)

calls:active_requests              SET     → Active call request IDs
call:{callerId}:{calleeId}         HASH    → Call request data (60s TTL)

calls:active                       SET     → Active call IDs
call:active:{callId}               HASH    → Active call data
user:{userId}:current_call         STRING  → User's current call ID
```

## Persistence Logic

```
┌─────────────────────────────────────────────────────────────┐
│ Call Status Flow                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  "active"        →    "connected"      →    Persisted      │
│  (Created)            (ICE flowing)         (PostgreSQL)   │
│                                                             │
│  Only "connected" calls are saved to the database          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Persistence Triggers:
1. call:end event (user explicitly ends)
2. Both users offline for 60s (timeout cleanup)
3. cleanupUserCallState (disconnect cleanup)

Database Record:
{
  callId: auto-increment,
  duration: seconds (connectedAt → endTime),
  startTime: Date (connectedAt || startedAt),
  endTime: Date (now),
  users: [callerId, calleeId]  // Many-to-many
}
```

## Manager Responsibilities

### PresenceManager
- **Manages:** User online/offline state, friend relationships
- **Emits:** friend_online, friend_offline, friend_in_call, friend_out_of_call
- **Dependencies:** Prisma (loads friends from DB), Socket.IO (notifications)

### CallRequestManager
- **Manages:** Pending call requests before acceptance
- **TTL:** 60 seconds auto-expiry
- **Lookup:** By caller/callee, by user (incoming/outgoing)

### ActiveCallManager
- **Manages:** Active calls, connection tracking, history persistence
- **Features:** Call expiry on disconnect, reconnection support
- **Persistence:** Only connected calls saved to PostgreSQL

### CallStateManager
- **Combines:** All three managers
- **Provides:** Unified API, utility methods (cleanup, offline checks)
- **Use case:** WebRTC connection handlers, event listeners
