# WebRTC Socket.IO Event Reference

> Comprehensive list of Socket.IO events for WebRTC-based voice calling system

---

## Authentication & Connection Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `auth:handshake` | Client → Server | Initial authentication handshake with JWT token |
| `auth:success` | Server → Client | Authentication successful, user connected |
| `auth:error` | Server → Client | Authentication failed, connection rejected |
| `user:online` | Server → Broadcast | User came online, notify contacts |
| `user:offline` | Server → Broadcast | User went offline, notify contacts |
| `user:list` | Server → Client | Send list of online users/contacts |

---

## Call Signaling Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `call:request` | Client → Server | Initiate call to another user |
| `call:incoming` | Server → Client | Incoming call notification to receiver |
| `call:accept` | Client → Server | Receiver accepts the call |
| `call:accepted` | Server → Client | Notify caller that call was accepted |
| `call:reject` | Client → Server | Receiver rejects the call |
| `call:rejected` | Server → Client | Notify caller that call was rejected |
| `call:busy` | Server → Client | Callee is already in another call |
| `call:cancel` | Client → Server | Caller cancels the call before answer |
| `call:cancelled` | Server → Client | Notify receiver that call was cancelled |

---

## WebRTC Signaling Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `webrtc:offer` | Client → Server → Client | SDP offer from caller to establish connection |
| `webrtc:answer` | Client → Server → Client | SDP answer from callee to complete handshake |
| `webrtc:ice-candidate` | Client ↔ Server ↔ Client | ICE candidates for NAT traversal (bidirectional) |

---

## In-Call Control Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `call:mute` | Client → Server → Client | User muted their microphone |
| `call:unmute` | Client → Server → Client | User unmuted their microphone |
| `call:video-off` | Client → Server → Client | User turned off video (future feature) |
| `call:video-on` | Client → Server → Client | User turned on video (future feature) |
| `call:hold` | Client → Server → Client | User put call on hold |
| `call:resume` | Client → Server → Client | User resumed call from hold |

---

## Call Termination Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `call:end` | Client → Server | User ends the active call |
| `call:ended` | Server → Client | Notify other party that call ended |

---

## Connection Management Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `disconnect` | Client/Server | Socket connection dropped |
| `reconnect:attempt` | Client → Server | Client attempting to reconnect |
| `reconnect:success` | Server → Client | Reconnection successful |
| `reconnect:failed` | Server → Client | Reconnection failed after max attempts |

---

## Event Flow Examples

### Successful Call Flow
```
Caller                  Server                  Callee
  |                       |                       |
  |--call:request-------->|                       |
  |                       |--call:incoming------->|
  |                       |                       |
  |                       |<--call:accept---------|
  |<--call:accepted-------|                       |
  |                       |                       |
  |--webrtc:offer-------->|--webrtc:offer-------->|
  |                       |                       |
  |<--webrtc:answer-------|<--webrtc:answer-------|
  |                       |                       |
  |<--webrtc:ice--------->|<--webrtc:ice--------->|
  |                       |                       |
  |      (Call Active - P2P Connection)          |
  |                       |                       |
  |--call:end------------>|                       |
  |                       |--call:ended---------->|
```

### Rejected Call Flow
```
Caller                  Server                  Callee
  |                       |                       |
  |--call:request-------->|                       |
  |                       |--call:incoming------->|
  |                       |                       |
  |                       |<--call:reject---------|
  |<--call:rejected-------|                       |
```

### Cancelled Call Flow
```
Caller                  Server                  Callee
  |                       |                       |
  |--call:request-------->|                       |
  |                       |--call:incoming------->|
  |                       |                       |
  |--call:cancel--------->|                       |
  |                       |--call:cancelled------>|
```

---

## Implementation Notes

- All events should include proper error handling
- Implement timeouts for call:incoming (e.g., 30 seconds)
- Store active call states in Redis for scalability
- Log all call events for debugging and analytics
- Validate user permissions before forwarding events
- Use rooms/namespaces to isolate call sessions
