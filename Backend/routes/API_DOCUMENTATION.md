# VoIP Platform API Documentation

**Base URL:** `http://localhost:3000/api/v1`

**Version:** 1.0.0

---

## Table of Contents
- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
- [Contact Endpoints](#contact-endpoints)
- [Error Responses](#error-responses)

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. Tokens are sent via:
- **Cookies:** `accessToken`, `refreshToken`
- **Headers:** `Authorization: Bearer <token>`

### Protected Routes
Routes marked with 🔒 require authentication via the `verifyJwt` middleware.

---

## User Endpoints

### 1. Register User
**POST** `/user/register`

Register a new user with email authentication.

#### Request
**Content-Type:** `multipart/form-data`

**Body Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | string | Yes | User's full name |
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 6 characters recommended) |
| otp | number | Yes | OTP received via email |
| avatar | file | Yes | Profile picture (image file) |

#### Success Response
**Code:** `201 Created`

```json
{
  "statusCode": 201,
  "message": "User Created Successfully",
  "data": {
    "userID": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "profilePicture": "https://cloudinary.com/..."
  }
}
```

#### Error Responses
- `400` - Missing required fields
- `401` - Invalid or expired OTP
- `409` - User with email already exists

---

### 2. Login User (Email/Password)
**POST** `/user/login`

Login with email and password.

#### Request
**Content-Type:** `application/json`

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Success Response
**Code:** `200 OK`

**Cookies Set:**
- `accessToken` (httpOnly, secure)
- `refreshToken` (httpOnly, secure)

```json
{
  "statusCode": 200,
  "message": "User Logged In Successfully",
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "userID": 1,
    "updatedAt": "2025-11-27T10:30:00.000Z",
    "loggedIn": true
  }
}
```

#### Error Responses
- `400` - Missing email or password / Email does not exist
- `401` - Wrong password

---

### 3. Send OTP
**POST** `/user/getOTP`

Request an OTP for email verification or login.

#### Request
**Content-Type:** `application/json`

```json
{
  "email": "john@example.com"
}
```

#### Success Response
**Code:** `200 OK`

```json
{
  "statusCode": 200,
  "message": "OTP Sent Successfully",
  "data": null
}
```

**Note:** OTP is valid for **10 minutes** and sent to the provided email.

#### Error Responses
- `400` - Email not provided

---

### 4. Login with OTP
**POST** `/user/otpLogin`

Login using email and OTP (passwordless login).

#### Request
**Content-Type:** `application/json`

```json
{
  "email": "john@example.com",
  "otp": 123456
}
```

#### Success Response
**Code:** `200 OK`

**Cookies Set:**
- `accessToken` (httpOnly, secure)
- `refreshToken` (httpOnly, secure)

```json
{
  "statusCode": 200,
  "message": "User Logged In Successfully",
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "userID": 1,
    "updatedAt": "2025-11-27T10:30:00.000Z",
    "loggedIn": true
  }
}
```

#### Error Responses
- `401` - Missing email/OTP, User not registered, Invalid/Expired OTP

---

### 5. Google OAuth Login
**GET** `/user/googleLogin`

Initiates Google OAuth 2.0 authentication flow.

#### Request
No parameters required. Simply redirect user to this endpoint.

#### Response
Redirects to Google's OAuth consent screen.

---

### 6. Google OAuth Callback
**GET** `/user/googleCallBack`

Google OAuth callback endpoint (handled automatically by Passport.js).

#### Success Response
**Redirects to:** `http://localhost:5173` (Frontend)

**Cookies Set:**
- `accessToken` (httpOnly, secure)
- `refreshToken` (httpOnly, secure)

#### Error Response
**Redirects to:** `/login` on failure

---

### 7. Refresh Access Token
**GET** `/user/refreshToken`

Generate new access and refresh tokens using a valid refresh token. Use this endpoint when the access token expires to get a new one without requiring the user to log in again.

#### Request
**Authentication:** Requires valid refresh token in cookies or Authorization header

**Headers (Optional):**
```
Authorization: Bearer <refresh_token>
```

**Cookies (Optional):**
- `refreshToken`: Valid refresh token

**Note:** The refresh token can be provided either in cookies or in the Authorization header. Cookies are preferred for web applications.

#### Success Response
**Code:** `200 OK`

**Cookies Updated:**
- `accessToken` (new token, httpOnly, secure)
- `refreshToken` (new token, httpOnly, secure)

```json
{
  "statusCode": 200,
  "message": "Tokens refreshed successfully",
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "userID": 1,
    "updatedAt": "2025-11-27T10:30:00.000Z",
    "loggedIn": true
  }
}
```

#### Error Responses
- `401 Unauthorized` - No refresh token provided
  ```json
  {
    "statusCode": 401,
    "message": "No refresh token provided",
    "data": null
  }
  ```
- `401 Unauthorized` - Invalid refresh token or user not found
  ```json
  {
    "statusCode": 401,
    "message": "Invalid refresh token - User not found",
    "data": null
  }
  ```
- `401 Unauthorized` - Refresh token expired or already used
  ```json
  {
    "statusCode": 401,
    "message": "Refresh token is expired or used",
    "data": null
  }
  ```

#### Implementation Notes
- The endpoint validates the refresh token against the one stored in the database
- After validation, both access and refresh tokens are rotated (new tokens generated)
- The old refresh token becomes invalid after successful refresh
- This implements refresh token rotation for enhanced security

---

## Contact Endpoints

### 1. Send Contact Request 🔒
**POST** `/contact/sendRequest`

Send a contact/friend request to another user.

**Authentication Required:** Yes

#### Request
**Content-Type:** `application/json`

```json
{
  "email": "friend@example.com"
}
```

#### Success Response
**Code:** `201 Created`

```json
{
  "statusCode": 201,
  "message": "Request Sent",
  "data": null
}
```

#### Error Responses
- `400` - Missing email, Cannot send request to yourself, Request already exists
- `401` - Invalid/Missing authentication token
- `404` - User with email not found

---

### 2. Accept Contact Request 🔒
**POST** `/contact/decideRequest`

Accept or Reject a pending contact request.

**Authentication Required:** Yes

#### Request
**Content-Type:** `application/json`

```json
{
  "requestId": 5,
  "accept": 1
}
```

**Parameters:**
- `requestId`: ID of the contact request
- `accept`: `1` for accept, `2` for reject

#### Success Response
**Code:** `200 OK`

```json
{
  "statusCode": 200,
  "message": "Contact Request Accepted Successfully",
  "data": {
    "requestId": 5,
    "senderId": 2,
    "recieverId": 1,
    "status": 1,
    "createdOn": "2025-11-27T10:00:00.000Z",
    "fromUser": {
      "userID": 2,
      "fullName": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

#### Error Responses
- `400` - Request already accepted/rejected
- `401` - Invalid/Missing authentication token
- `403` - Not authorized to update this request
- `404` - Contact request not found

---

## Error Responses

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message description",
  "data": null
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication failed or token missing |
| 403 | Forbidden | User not authorized for this action |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Data Models

### User Model
```typescript
{
  userID: number
  fullName: string
  email: string (unique)
  password?: string
  refreshToken?: string
  profilePicture?: string
  isGoogleAuth: boolean
  isEmailAuth: boolean
  updatedAt: DateTime
  createdAt: DateTime
}
```

### Contact Request Model
```typescript
{
  requestId: number
  senderId: number
  recieverId: number
  status: number // 0 = pending, 1 = accepted, 2 = rejected
  createdOn: DateTime
}
```

### OTP Model
```typescript
{
  email: string (unique)
  otp: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Authentication Flow

### Email/Password Registration
1. **POST** `/user/getOTP` - Request OTP
2. Check email for OTP (valid 10 minutes)
3. **POST** `/user/register` - Register with OTP + credentials + avatar
4. User created, login required

### Email/Password Login
1. **POST** `/user/login` - Login with credentials
2. Receive access & refresh tokens in cookies
3. Use tokens for authenticated requests

### OTP Login
1. **POST** `/user/getOTP` - Request OTP
2. Check email for OTP (valid 10 minutes)
3. **POST** `/user/otpLogin` - Login with OTP
4. Receive access & refresh tokens in cookies

### Google OAuth
1. Redirect to **GET** `/user/googleLogin`
2. User authenticates with Google
3. Redirected to `/user/googleCallBack`
4. Frontend receives tokens in cookies
5. User logged in automatically

### Token Refresh
1. Access token expires (1 day)
2. **POST** `/user/refreshToken` with refresh token
3. Receive new access & refresh tokens
4. Continue making requests

---

## Rate Limiting

**OTP Requests:** Currently no rate limiting (TODO: Add 5-minute cooldown)

---

## CORS Configuration

- **Origin:** `*` (All origins allowed)
- **Credentials:** `true` (Cookies enabled)

---

## Notes

1. **File Upload:** Avatar images are uploaded to Cloudinary
2. **Token Expiry:**
   - Access Token: 1 day
   - Refresh Token: 10 days
3. **OTP Validity:** 10 minutes
4. **Cookies:** All auth cookies are `httpOnly` and `secure`
5. **Session:** Express session enabled with 24-hour expiry

---

## Example Usage (JavaScript/Fetch)

### Register User
```javascript
const formData = new FormData();
formData.append('fullName', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'password123');
formData.append('otp', '123456');
formData.append('avatar', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/v1/user/register', {
  method: 'POST',
  body: formData
});

const data = await response.json();
```

### Login
```javascript
const response = await fetch('http://localhost:3000/api/v1/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

```

### Send Contact Request (Authenticated)
```javascript
const response = await fetch('http://localhost:3000/api/v1/contact/sendRequest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Sends cookies
  body: JSON.stringify({
    email: 'friend@example.com'
  })
});

const data = await response.json();
```

### Refresh Tokens
```javascript
const response = await fetch('http://localhost:3000/api/v1/user/refreshToken', {
  method: 'GET',
  credentials: 'include', // Sends cookies with refresh token
});

**Last Updated:** November 27, 2025
