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

---

### 3. <span style="color:red"> User (Caller or the Callee joins and rejoins)

**Description**
1. If a user(say caller) rejoins
2. If a user(say callee) joins who was called within the last 60s window
3. If a user currently in call goes through a network blip or a page reload.

**<span style="color:green">FIX:** 