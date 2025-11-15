# N-Device Manager 🔐

A production-ready Next.js 15 application implementing concurrent device limit management with Auth0 authentication and Upstash Redis.

## 📋 Overview

This application enforces a maximum number of concurrent device sessions per user account (N=3). When a user attempts to log in from a 4th device, they must choose to either cancel the login or force logout from one of their existing sessions.

### Key Features

- ✅ **N-Device Concurrent Session Management** (N=3)
- 🔒 **Auth0 Authentication** with phone number collection
- 🚀 **Next.js 15** with App Router
- 💾 **Upstash Redis** for session storage
- 🎨 **Modern, Professional UI** with Tailwind CSS
- 📱 **Graceful Force-Logout** notifications
- 🔄 **Real-time Session Monitoring**
- 🌐 **Public & Private Pages**

## 🛠️ Tech Stack

- **Framework:** Next.js 15.2.3 (App Router)
- **Authentication:** Auth0 (Latest SDK)
- **Database:** Upstash Redis (Serverless)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

## 🏗️ Architecture

### How N-Device Management Works

1. **Session Tracking:**

   - Each login creates a unique device session ID
   - Sessions are stored in Redis with user ID as key
   - Maximum 3 active sessions per user

2. **Login Flow:**

   ```
   User Login → Check Active Sessions →
   If sessions < 3: Allow Login →
   If sessions = 3: Show Force Logout Modal →
   User Selects Device to Logout → New Session Created
   ```

3. **Force Logout Detection:**
   - Each page load checks if current session is still valid
   - If session removed from Redis, user sees logout notification
   - Graceful redirect to login page

### Data Structure (Redis)

```typescript
Key: `user_sessions:{userId}`
Value: {
  sessions: [
    {
      sessionId: "uuid-v4",
      deviceInfo: "Chrome on Windows",
      loginTime: "ISO-8601 timestamp",
      lastActive: "ISO-8601 timestamp",
      ipAddress: "xxx.xxx.xxx.xxx"
    }
  ]
}
TTL: 7 days (configurable)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Auth0 Account
- Upstash Redis Account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/n-device-manager.git
cd n-device-manager
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Auth0 Configuration
AUTH0_SECRET=your_auth0_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token


### 3. Auth0 Setup

1. **Create Auth0 Application:**
   - Go to Auth0 Dashboard → Applications → Create Application
   - Select "Regular Web Application"
   - Copy Client ID and Client Secret

2. **Configure Callback URLs:**
```

Allowed Callback URLs: http://localhost:3000/api/auth/callback
Allowed Logout URLs: http://localhost:3000

````

### 4. Upstash Redis Setup

1. Create account at [upstash.com](https://upstash.com)
2. Create new Redis database (choose region closest to deployment)
3. Copy REST URL and Token to `.env.local`

### 5. Run Development Server

```bash
npm run dev
````

Visit [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
n-device-manager/
├── app/
│   ├── api/
│   │   ├── device/
│   │   │   ├── force-logout/route.ts
│   │   │   ├── list/route.ts
│   │   │   └── register/route.ts
│   │   │   └── validate/route.ts
│   │   └── profile/
│   │       └── complete/route.ts            # Update user profile
│   ├── dashboard/
│   │   └── page.tsx                   # Private page
|   |   └── DashboardClient.tsx
|   |   └── DashboardUI.tsx
|   |   └── DeviceRegisterClient.tsx
|   |   └── DeviceRegisterWrapper.tsx
│   ├── complete-profile/
│   │   └── page.tsx                   # Phone collection
│   ├── layout.tsx
│   └── page.tsx                       # Public page
├── components/
|   |──ui                              #shadcnui
│   ├── DeviceSelectionModal.tsx       # Force logout UI
│   ├── SessionMonitor.tsx             # Real-time check
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── redis.ts                       # Redis client
│   ├── utils.ts
│   └── auth.ts                        # Auth helpers
└── middleware.ts                      # Auth protection
```

## 🔑 Key Implementation Details

### Session Management (`lib/session.ts`)

```typescript
export async function createSession(userId: string, deviceInfo: string) {
  const sessions = await getActiveSessions(userId);

  if (sessions.length >= MAX_DEVICES) {
    return { requiresForceLogout: true, sessions };
  }

  const newSession = {
    sessionId: generateUUID(),
    deviceInfo,
    loginTime: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };

  await redis.setex(
    `user_sessions:${userId}`,
    SESSION_TTL,
    JSON.stringify([...sessions, newSession])
  );

  return { success: true, sessionId: newSession.sessionId };
}
```

### Session Validation Middleware

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const sessionId = request.cookies.get("device_session_id")?.value;

  if (session?.user && sessionId) {
    const isValid = await checkSessionValid(session.user.sub, sessionId);
    if (!isValid) {
      return NextResponse.redirect(new URL("/force-logged-out", request.url));
    }
  }
}
```

### Force Logout Modal Component

- Shows active devices with login time
- Allows user to select which device to logout
- Confirms action before proceeding
- Updates session in Redis atomically

## 🎨 UI/UX Features

- **Responsive Design:** Mobile-first approach
- **Loading States:** Skeleton loaders during data fetch
- **Error Handling:** User-friendly error messages
- **Animations:** Smooth transitions using Tailwind
- **Accessibility:** ARIA labels, keyboard navigation
- **Dark Mode Ready:** Prepared for theme switching

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`

3. **Update Auth0 URLs:**

   ```
   Allowed Callback URLs: https://your-app.vercel.app/api/auth/callback
   Allowed Logout URLs: https://your-app.vercel.app
   AUTH0_BASE_URL: https://your-app.vercel.app
   ```

4. **Deploy:**
   - Vercel will automatically deploy on push to main branch

## 🧪 Testing

### Test Scenarios

1. **Login from 3 devices:** All should succeed
2. **Login from 4th device:** Should show device selection modal
3. **Force logout device:** Selected device should see logout message
4. **Session persistence:** Refresh should maintain session
5. **Session expiry:** After TTL, should require re-login

### Manual Testing Flow

```bash
# Terminal 1 (Device 1)
npm run dev

# Terminal 2 (Device 2) - Different browser/incognito
npm run dev -- -p 3001

# Terminal 3 (Device 3) - Another browser
npm run dev -- -p 3002

# Terminal 4 (Device 4) - Test force logout
npm run dev -- -p 3003
```

## 📊 Monitoring & Analytics

- **Session Metrics:** Track active sessions per user
- **Force Logout Events:** Monitor how often users hit device limits
- **Redis Performance:** Track response times and memory usage
- **Auth0 Logs:** Monitor login success/failure rates

## 🔒 Security Considerations

- ✅ Sessions stored server-side only
- ✅ Session IDs are cryptographically secure UUIDs
- ✅ Redis connection encrypted (TLS)
- ✅ Auth0 handles authentication securely
- ✅ CSRF protection via Auth0
- ✅ Environment variables never exposed to client
- ✅ Session TTL prevents indefinite sessions

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Unable to connect to Redis"

```bash
# Check Redis URL format
echo $UPSTASH_REDIS_REST_URL
# Should start with https://
```

**Issue:** "Auth0 callback error"

```bash
# Verify callback URL matches exactly
# Check AUTH0_BASE_URL has no trailing slash
```

**Issue:** "Sessions not persisting"

```bash
# Check SESSION_TTL is set
# Verify Redis is accessible from deployment region
```

## 📝 Environment Variables Reference

| Variable                   | Description                | Example                     |
| -------------------------- | -------------------------- | --------------------------- |
| `AUTH0_SECRET`             | Random 32-char string      | `openssl rand -hex 32`      |
| `AUTH0_BASE_URL`           | Your app URL               | `https://app.vercel.app`    |
| `AUTH0_ISSUER_BASE_URL`    | Auth0 domain               | `https://dev-xxx.auth0.com` |
| `AUTH0_CLIENT_ID`          | Auth0 app client ID        | `abc123...`                 |
| `AUTH0_CLIENT_SECRET`      | Auth0 app secret           | `xyz789...`                 |
| `UPSTASH_REDIS_REST_URL`   | Redis endpoint             | `https://xxx.upstash.io`    |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token                | `AXX...`                    |
| `MAX_DEVICES`              | Max concurrent sessions    | `3`                         |
| `SESSION_TTL`              | Session lifetime (seconds) | `604800` (7 days)           |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Auth0** for robust authentication
- **Upstash** for serverless Redis
- **Vercel** for seamless deployment

## 📧 Contact

**Developer:** Your Name

- **Email:** mprakhar07@gmail.com
- **LinkedIn:** [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **GitHub:** [Your GitHub](https://github.com/yourusername)

## 🔗 Links

- **Live Demo:** [https://your-app.vercel.app](https://your-app.vercel.app)
- **GitHub Repository:** [https://github.com/prakhaaar/n-device-manager](https://github.com/prakhaaar/n-device-manager)

---

**Note:** This implementation uses no paid services. All required services (Auth0, Upstash Redis, Vercel) offer generous free tiers suitable for this project.

Built with ❤️ for the Front End Developer Internship Task
