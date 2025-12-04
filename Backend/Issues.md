# Issues to Manage

### 1.<span style="color:red"> Another Call Pick

**Description:**  
If user starts a call and picks another call while the first call is ongoing.

**<span style="color:green">Fix:**  
If the call has not been picked, simply send the event `incoming-call:cancelled`. Otherwise, see issue below.

---

### 2. <span style="color:red"> ICE Exchange Interruption

**Description:**  
1. User A requests a call to user B
2. User B accepts the call
3. ICE exchange starts
4. User A suspends the call

**<span style="color:green">Fix:**  
If the end user has picked the call, send an event `call:picked` and disable the end call button for the period until the call has been established.