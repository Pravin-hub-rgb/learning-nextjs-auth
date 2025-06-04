# Level 2: Supabase Auth Implementation Roadmap

## 🎯 Overview
Create a **brand new Next.js 15 project** for **Supabase Authentication**. This fresh start will help you understand the architectural differences from Level 1 and implement real user management with email/password authentication, session handling, and database integration.

## 📋 Prerequisites Checklist
- [x] Level 1 (Client-only Auth) completed ✅
- [x] Keep Level 1 project intact for comparison
- [ ] Supabase account created
- [ ] Node.js and npm installed
- [ ] Basic understanding of async/await
- [ ] Familiarity with React hooks

---

## 🗺️ Implementation Roadmap

### **Phase 0: New Project Setup** (15 mins)

#### Step 0.1: Create New Next.js Project
```bash
npx create-next-app@latest auth-playground-supabase
cd auth-playground-supabase
```
**Options to select:**
- TypeScript: No (unless you prefer it)
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Turbopack: Yes (for faster dev)

#### Step 0.2: Clean Up & Basic Structure
- [ ] Remove default Next.js boilerplate
- [ ] Create basic folder structure:
```
src/
├── app/
├── components/
├── contexts/
├── hooks/
└── lib/
```
- [ ] Test that `npm run dev` works

### **Phase 1: Supabase Setup & Configuration** (30 mins)

#### Step 1.1: Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com) and create account
- [ ] Create new project: "auth-playground-supabase"
- [ ] Choose region closest to you
- [ ] Wait for database setup (2-3 minutes)
- [ ] Note down from Settings > API:
  - Project URL
  - Anon/Public Key
  - Service Role Key (keep secret!)

#### Step 1.2: Install Dependencies
```bash
npm install @supabase/supabase-js
```

#### Step 1.3: Environment Setup
- [ ] Create `.env.local` file
- [ ] Add Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
- [ ] Add `.env.local` to `.gitignore`

#### Step 1.4: Configure Supabase Client
- [ ] Create `src/lib/supabase.js`
- [ ] Initialize Supabase client with your credentials
- [ ] Export client for app-wide use
- [ ] Test connection with simple query

---

### **Phase 2: Authentication Infrastructure** (45 mins)

#### Step 2.1: Auth Context Provider
- [ ] Create `src/contexts/AuthContext.js`
- [ ] Implement auth state management:
  - Current user state
  - Loading state
  - Login function
  - Logout function
  - Signup function
- [ ] Handle Supabase auth state changes with `onAuthStateChange`
- [ ] Wrap app with AuthProvider in `src/app/layout.js`

#### Step 2.2: Auth Hook
- [ ] Create `src/hooks/useAuth.js`
- [ ] Export auth context consumer hook
- [ ] Add comprehensive error handling
- [ ] Add TypeScript support (optional)

#### Step 2.3: Session Persistence
- [ ] Implement automatic session detection
- [ ] Handle page refresh scenarios
- [ ] Manage loading states during auth checks

---

### **Phase 3: Create All Pages from Scratch** (60 mins)

#### Step 3.1: Home Page (`src/app/page.js`)
- [ ] Create welcoming home page
- [ ] Show different content for authenticated vs unauthenticated users
- [ ] Add navigation links to other pages
- [ ] Display current auth status

#### Step 3.2: Login Page (`src/app/login/page.js`)
- [ ] Create login form with email/password fields
- [ ] Implement `signInWithPassword()` from Supabase
- [ ] Add proper error handling:
  - Invalid credentials
  - Network errors 
  - Email not confirmed
- [ ] Add loading states with spinners
- [ ] Redirect to `/secret` on successful login
- [ ] Add "Don't have an account? Sign up" link

#### Step 3.3: Signup Page (`src/app/signup/page.js`)
- [ ] Create signup form with email/password/confirm fields
- [ ] Implement `signUp()` with email/password
- [ ] Handle email confirmation flow
- [ ] Add client-side validation:
  - Password strength requirements
  - Email format validation
  - Confirm password matching
- [ ] Show "Check your email for confirmation" message
- [ ] Add "Already have an account? Login" link

#### Step 3.4: Secret Page (`src/app/secret/page.js`)
- [ ] Create protected content page
- [ ] Add route protection logic
- [ ] Show user-specific content
- [ ] Add "Back to Home" navigation

---

### **Phase 4: Navigation & UI Components** (30 mins)

#### Step 4.1: Navbar Component
- [ ] Create `src/components/Navbar.js`
- [ ] Show real user email/name from Supabase
- [ ] Display login/logout buttons based on auth state
- [ ] Handle loading states in navbar
- [ ] Add navigation links to all pages
- [ ] Implement logout functionality with `signOut()`

#### Step 4.2: Route Protection Logic
- [ ] Create route protection for `/secret` page
- [ ] Use real auth state instead of localStorage
- [ ] Add loading spinner while checking authentication
- [ ] Implement proper redirects to `/login`
- [ ] Handle edge cases (session expired, etc.)

#### Step 4.3: Layout Integration
- [ ] Add Navbar to main layout (`src/app/layout.js`)
- [ ] Ensure AuthProvider wraps the entire app
- [ ] Add global styles and Tailwind classes

---

### **Phase 5: Advanced Features** (Optional - 30 mins)

#### Step 5.1: Email Confirmation
- [ ] Configure email templates in Supabase dashboard
- [ ] Handle email confirmation redirects
- [ ] Add resend confirmation functionality

#### Step 5.2: Password Reset
- [ ] Create `/forgot-password` page
- [ ] Implement `resetPasswordForEmail()`
- [ ] Handle reset password flow

#### Step 5.3: User Profile
- [ ] Create `/profile` page
- [ ] Show user metadata
- [ ] Allow profile updates

---

## 🧪 Testing Checklist

### Core Authentication Flow
- [ ] **Signup**: Create new account with email/password
- [ ] **Email Confirmation**: Receive and click confirmation email
- [ ] **Login**: Sign in with confirmed account
- [ ] **Session Persistence**: Refresh page, still logged in
- [ ] **Route Protection**: `/secret` redirects when not logged in
- [ ] **Route Protection**: `/secret` accessible when logged in
- [ ] **Logout**: Sign out clears session
- [ ] **Navbar Updates**: Login/logout buttons update correctly

### Error Handling
- [ ] Invalid login credentials show error
- [ ] Signup with existing email shows error
- [ ] Network errors handled gracefully
- [ ] Loading states work properly

### Edge Cases
- [ ] Direct URL access to `/secret` when not logged in
- [ ] Browser back/forward button behavior
- [ ] Multiple tab scenarios
- [ ] Session timeout handling

---

## 🚀 Key Differences from Level 1

| Aspect | Level 1 (Client-only) | Level 2 (Supabase) |
|--------|----------------------|-------------------|
| **User Storage** | localStorage only | Supabase database |
| **Session Management** | Manual localStorage | Automatic JWT tokens |
| **Security** | Client-side only | Server-side validation |
| **Persistence** | Browser only | Cross-device/browser |
| **User Management** | Fake users | Real user accounts |
| **Email Verification** | None | Built-in email flow |
| **Password Reset** | None | Built-in reset flow |

---

## 📁 Expected File Structure
```
auth-playground-supabase/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.js           # Login with Supabase
│   │   ├── signup/
│   │   │   └── page.js           # Real signup functionality  
│   │   ├── secret/
│   │   │   └── page.js           # Protected with Supabase auth
│   │   ├── layout.js             # Root layout with AuthProvider
│   │   ├── page.js               # Home page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── Navbar.js             # Navigation with auth state
│   ├── contexts/
│   │   └── AuthContext.js        # Supabase auth context
│   ├── hooks/
│   │   └── useAuth.js            # Auth hook
│   └── lib/
│       └── supabase.js           # Supabase client
├── .env.local                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## ⏱️ Estimated Timeline
- **Phase 0**: 15 minutes (New Project Setup)
- **Phase 1**: 30 minutes (Supabase Setup)
- **Phase 2**: 45 minutes (Auth Infrastructure) 
- **Phase 3**: 60 minutes (All Pages from Scratch)
- **Phase 4**: 30 minutes (Navigation & Protection)
- **Phase 5**: 30 minutes (Optional Advanced Features)
- **Testing**: 20 minutes

**Total**: ~4 hours for complete fresh implementation

---

## 🎓 Learning Outcomes
By completing Level 2, you'll understand:
- Real authentication vs. fake client-side auth
- JWT tokens and session management
- Email verification flows
- Server-side user management
- Authentication state synchronization
- Production-ready auth patterns

Ready to start with Phase 1? Let me know when you want to begin the implementation!