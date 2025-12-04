<div align="center">

# VoIP Connect

### Real-Time Voice Communication Platform

[![GitHub](https://img.shields.io/badge/GitHub-VoIP_Project-blue?logo=github)](https://github.com/bhardwajdevesh092005/VoIP_Project)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack VoIP (Voice over Internet Protocol) application built with React, Node.js, WebRTC, and PostgreSQL. Features include real-time voice calls, contact management, and intelligent user search powered by Trie data structures.

</div>

---

## Features

### Completed Features

<details>
<summary><b>User Authentication</b></summary>

- Email/Password registration and login
- Google OAuth 2.0 integration
- OTP-based passwordless login
- JWT-based authentication with token refresh
- Secure session management

</details>

<details>
<summary><b>Contact Management</b></summary>

- Send/receive contact requests
- Accept/reject contact requests
- View contacts list
- Remove contacts
- Real-time contact updates

</details>

<details>
<summary><b>User Search (Trie-Based)</b></summary>

- Lightning-fast O(m) prefix search
- Search by name or email
- 150ms debounced search
- Case-insensitive matching
- Auto-complete functionality

</details>

<details>
<summary><b>UI/UX</b></summary>

- Dark/Light mode toggle
- Responsive design (mobile-first)
- Smooth animations and transitions
- Modern gradient backgrounds
- Toast notifications

</details>

---

## Tech Stack

<table>
<tr>
<td valign="top" width="33%">

### Frontend
- **Framework:** React 18 with Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Build Tool:** Vite

</td>
<td valign="top" width="33%">

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis
- **Authentication:** Passport.js, JWT
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer
- **WebRTC:** Socket.io

</td>
<td valign="top" width="33%">

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **MongoDB:** For future features
- **Version Control:** Git + Husky
- **Search Engine:** C++ Trie (Native Addon)

</td>
</tr>
</table>

---

## Project Structure

```
VoIP_Project/
├── App/                          # Frontend React Application
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Calling/          # Call UI components
│   │   │   ├── Contacts/         # Contact management & search
│   │   │   ├── Home/             # Home page & keypad
│   │   │   ├── Login_SignUp/     # Auth components
│   │   │   ├── Navbar/           # Navigation bar
│   │   │   └── Profile/          # User profile
│   │   ├── Redux_Store/          # Redux state management
│   │   ├── Utils/                # API service, search service
│   │   └── assets/               # Static assets
│   └── public/                   # Public assets
│
├── Backend/                      # Node.js Backend Server
│   ├── controllers/              # Request handlers
│   │   ├── contactController/    # Contact CRUD operations
│   │   └── userController/       # User auth & management
│   ├── middlewares/              # Auth, file upload middlewares
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic services
│   │   ├── search.service.js     # Trie search service
│   │   ├── passport.service.js   # OAuth configuration
│   │   └── cloudinary.service.js # Image upload
│   ├── prisma/                   # Database schema & migrations
│   ├── trie_addon/               # C++ Trie native module
│   │   ├── trie/
│   │   │   ├── trie.hpp          # Trie header
│   │   │   ├── trie.cpp          # Trie implementation
│   │   │   └── addon.cpp         # Node.js bindings
│   │   └── binding.gyp           # Build configuration
│   ├── Utils/                    # Helper utilities
│   └── WebRTC/                   # WebRTC signaling
│
├── data/                         # Docker volume mounts
│   ├── postgres_data/
│   ├── mongo/
│   └── redis/
│
└── docker-compose.yml            # Docker services configuration
```

---

## Installation & Setup

### Prerequisites

```bash
Node.js (v18 or higher)
Docker & Docker Compose
Python 3 (for building C++ addon)
Git
```

---

### Step 1: Clone Repository

```bash
git clone https://github.com/bhardwajdevesh092005/VoIP_Project.git
cd VoIP_Project
```

---

### Step 2: Setup Environment Variables

Create `.env` files in respective directories:

**Backend/.env**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
POSTGRESS_URL=postgresql://user:password@localhost:5432/voip_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=voip_db

# Redis
REDIS_URL=redis://localhost:6379

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/user/googleCallBack

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin
```

**App/.env**
```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

### Step 3: Start Docker Services

```bash
docker-compose up -d
```

**Services Started:**
- PostgreSQL (port 5432)
- PgAdmin (port 5050)
- MongoDB (port 27017)
- Redis (port 6379)

---

### Step 4: Setup Backend

```bash
cd Backend

# Install dependencies
npm install

# Build C++ Trie addon
npm rebuild

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

### Step 5: Setup Frontend

```bash
cd App

# Install dependencies
npm install

# Start development server
npm run dev
```

---

### Step 6: Access Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api/v1 |
| PgAdmin | http://localhost:5050 |
| API Docs | `Backend/routes/API_DOCUMENTATION.md` |

---

## API Endpoints

<details>
<summary><b>User Routes</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/user/register` | Register new user | No |
| POST | `/api/v1/user/login` | Login with email/password | No |
| POST | `/api/v1/user/getOTP` | Request OTP | No |
| POST | `/api/v1/user/otpLogin` | Login with OTP | No |
| GET | `/api/v1/user/googleLogin` | Google OAuth login | No |
| GET | `/api/v1/user/googleCallBack` | OAuth callback | No |
| GET | `/api/v1/user/refreshToken` | Refresh access token | No |
| GET | `/api/v1/user/search?query=` | Search users | Yes |

</details>

<details>
<summary><b>Contact Routes</b></summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/contact/sendRequest` | Send contact request | Yes |
| POST | `/api/v1/contact/decideRequest` | Accept/reject request | Yes |
| GET | `/api/v1/contact/getContacts` | Get contacts list | Yes |
| GET | `/api/v1/contact/getContactRequests` | Get pending requests | Yes |
| DELETE | `/api/v1/contact/removeContact/:requestId` | Remove contact | Yes |

</details>

---

## Key Technologies Explained

<details>
<summary><b>Trie Data Structure (C++ Native Addon)</b></summary>

The search feature uses a custom-built Trie data structure implemented in C++ for maximum performance:

**Features:**
- **O(m) search complexity** where m = query length
- **Case-insensitive** search
- **Prefix matching** for autocomplete
- **In-memory** for instant results
- **Auto-syncs** with database on server start

**Why C++?**
- 10-100x faster than JavaScript implementation
- Efficient memory usage
- Native performance for high-frequency operations

</details>

<details>
<summary><b>WebRTC Architecture</b></summary>

_(To be implemented)_

- Peer-to-peer voice connections
- STUN/TURN servers for NAT traversal
- Socket.io for signaling
- ICE candidates exchange

</details>

---

## TODO List

### Phase 1: Core Features (In Progress)
- ~~[x] User Authentication System~~
  - ~~[x] Email/Password auth~~
  - ~~[x] Google OAuth integration~~
  - ~~[x] OTP-based login~~
  - ~~[x] JWT token management~~
  - ~~[x] Session handling~~
  
- ~~[x] Contact Management~~
  - ~~[x] Send contact requests~~
  - ~~[x] Accept/reject requests~~
  - ~~[x] View contacts~~
  - ~~[x] Remove contacts~~
  - ~~[x] Real-time updates~~

- ~~[x] User Search Feature~~
  - ~~[x] Build C++ Trie data structure~~
  - ~~[x] Implement Node.js bindings~~
  - ~~[x] Create search API endpoint~~
  - ~~[x] Frontend search component~~
  - ~~[x] 150ms debounced search~~
  - ~~[x] Auto-complete UI~~

- [ ] Database Integration
  - ~~[x] PostgreSQL setup with Prisma~~
  - ~~[x] User model~~
  - ~~[x] ContactRequest model~~
  - ~~[x] OTP model~~
  - [ ] Call history model (schema exists, needs implementation)
  - [ ] Message model (future)

### Phase 2: WebRTC Voice Calling (Next Priority)
- [ ] WebRTC Setup
  - [ ] Configure STUN/TURN servers
  - [ ] Implement signaling server with Socket.io
  - [ ] Create peer connection management
  - [ ] Handle ICE candidate exchange
  - [ ] Implement SDP offer/answer flow

- [ ] Calling Features
  - [ ] Initiate voice calls
  - [ ] Accept/reject incoming calls
  - [ ] End calls
  - [ ] Call status indicators
  - [ ] Ringing notifications
  - [ ] Busy/unavailable states

- [ ] Call UI Components
  - ~~[x] CallRinging component (basic UI)~~
  - ~~[x] CallScreen component (basic UI)~~
  - [ ] Connect UI to WebRTC logic
  - [ ] Call controls (mute, speaker, end)
  - [ ] Call timer
  - [ ] Audio level indicators

- [ ] Call History
  - [ ] Store call logs in database
  - [ ] Display call history
  - [ ] Call duration tracking
  - [ ] Missed calls indicator
  - [ ] Call back functionality

### Phase 3: Enhanced Features
- [ ] User Profile
  - ~~[x] Basic profile page~~
  - [ ] Edit profile information
  - [ ] Change password
  - [ ] Upload/change avatar
  - [ ] Account settings
  - [ ] Privacy settings

- [ ] Contact Features
  - [ ] Contact groups/favorites
  - [ ] Block/unblock users
  - [ ] Contact notes
  - [ ] Last seen/online status
  - [ ] Contact search filters

- [ ] Notifications
  - [ ] Browser push notifications
  - [ ] Email notifications
  - [ ] Notification preferences
  - [ ] Notification center
  - [ ] Unread counts

- [ ] Group Calls (Future)
  - [ ] Create group calls
  - [ ] Invite participants
  - [ ] Multi-party audio mixing
  - [ ] Group call management
  - [ ] Screen sharing (optional)

### Phase 4: UI/UX Improvements
- [ ] Frontend Polish
  - ~~[x] Dark/Light mode~~
  - ~~[x] Responsive design basics~~
  - [ ] Mobile optimization
  - [ ] Tablet layout
  - [ ] Touch gestures
  - [ ] Keyboard shortcuts

- [ ] Accessibility
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Screen reader support
  - [ ] High contrast mode
  - [ ] Font size controls

- [ ] Performance
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
  - [ ] Bundle size reduction
  - [ ] Caching strategies

- [ ] User Experience
  - [ ] Loading skeletons
  - [ ] Error boundaries
  - [ ] Offline mode handling
  - [ ] Progressive Web App (PWA)
  - [ ] Better error messages

### Phase 5: Security & Testing
- [ ] Security Enhancements
  - [ ] Rate limiting on APIs
  - [ ] CORS configuration refinement
  - [ ] XSS protection
  - [ ] CSRF tokens
  - [ ] SQL injection prevention
  - [ ] Secure headers (Helmet.js)

- [ ] Testing
  - [ ] Backend unit tests (Jest)
  - [ ] Frontend component tests (Vitest)
  - [ ] Integration tests
  - [ ] E2E tests (Cypress/Playwright)
  - [ ] API endpoint tests
  - [ ] WebRTC connection tests

- [ ] Code Quality
  - ~~[x] ESLint configuration~~
  - ~~[x] Prettier configuration~~
  - ~~[x] Husky pre-commit hooks~~
  - [ ] Code coverage reporting
  - [ ] Performance monitoring
  - [ ] Error tracking (Sentry)

### Phase 6: DevOps & Deployment
- [ ] CI/CD Pipeline
  - [ ] GitHub Actions workflow
  - [ ] Automated testing
  - [ ] Build automation
  - [ ] Docker image building
  - [ ] Deployment automation

- [ ] Production Setup
  - [ ] Environment configuration
  - [ ] HTTPS/SSL certificates
  - [ ] CDN for static assets
  - [ ] Database backup strategy
  - [ ] Monitoring & logging
  - [ ] Error tracking

- [ ] Scalability
  - [ ] Load balancing
  - [ ] Horizontal scaling
  - [ ] Database optimization
  - [ ] Redis caching strategy
  - [ ] Media server (Janus/Mediasoup)

- [ ] Documentation
  - ~~[x] API documentation~~
  - ~~[x] Project README~~
  - [ ] User documentation
  - [ ] Deployment guide
  - [ ] Contribution guidelines
  - [ ] Architecture diagrams

### Phase 7: Advanced Features (Future)
- [ ] Messaging System
  - [ ] Text messaging
  - [ ] File sharing
  - [ ] Voice messages
  - [ ] Read receipts
  - [ ] Typing indicators

- [ ] Video Calling
  - [ ] One-to-one video calls
  - [ ] Video call UI
  - [ ] Camera controls
  - [ ] Video quality settings
  - [ ] Screen sharing

- [ ] Analytics
  - [ ] User analytics
  - [ ] Call quality metrics
  - [ ] Usage statistics
  - [ ] Admin dashboard
  - [ ] Reports generation

- [ ] Multi-language Support
  - [ ] i18n setup
  - [ ] Language selection
  - [ ] RTL support
  - [ ] Translation files

---

## Known Issues

> **Note:** These are documented issues currently being addressed.

| Issue | Description | Status |
|-------|-------------|--------|
| Trie Addon Segfault | Exit Code 139 when running `node index.js` in trie_addon folder | Fixed in production |
| WebRTC Not Implemented | Call UI exists but not connected to WebRTC logic | In Progress |
| Call History Model | Prisma schema exists but backend implementation pending | Planned |

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

---

## License

This project is licensed under the **MIT License**.

---



## Author

**Devesh Bhardwaj**

[![GitHub](https://img.shields.io/badge/GitHub-bhardwajdevesh092005-181717?logo=github)](https://github.com/bhardwajdevesh092005)

---

## Acknowledgments

- **React & Vite** teams for excellent developer experience
- **Prisma** for intuitive database management
- **WebRTC** community for protocols and documentation
- **Tailwind CSS** for rapid UI development

---

## Support

For issues and questions:
- [Open an issue on GitHub](https://github.com/bhardwajdevesh092005/VoIP_Project/issues)
- Check existing documentation in `/Backend/routes/API_DOCUMENTATION.md`

---

**Last Updated:** December 3, 2025
