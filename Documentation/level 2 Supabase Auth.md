# Level 2: Supabase Auth
- [Access Source Code of this project](../source-code/level2auth/) and run the project locally.
- [Test the Project Live](https://nextjs-level2-auth.vercel.app/)
- Summary:
  - We'll use Supabase Auth for real authentication with email/password.

- Supabase will handle:

    - User signup, login, and session management

    - Automatically storing the session in localStorage/cookies

- A custom AuthContext:

    - Wraps the entire app to track authentication state

    - Provides global access to:

        - signUp(email, password)

        - signIn(email, password)

        - logout()

        - user, loggedIn, and loading states

- Auth state updates in real-time using Supabase’s onAuthStateChange listener.

- Protected routes (like /secret) are implemented by:

    - Checking auth status via context

    - Redirecting to /login if unauthenticated

- UI behavior:

    - Navbar shows Login or Logout depending on auth state

    - Displays the user’s email if logged in

- Session is persisted automatically by Supabase, and restored on page refresh.

- Navigation
  - [Go to Main Doc](../README.md)

---

## Phase By Phase Plan
## Phase 0 (Project Setup)
- **Step 0.1**
  - We'll start fresh by creating a new project called:
    ```
    level2auth
    ```
  - Create New Next.js Project
    ```
    pnpm create next-app@latest level2auth
    ```
    Complete the setup
    - Select:

      - TypeScript: Yes

      - ESLint: Yes

      - Tailwind CSS: Yes

      - Use src/ directory: Yes

      - App Router: Yes

      - Turbopack: Yes
  - Then move into your project:
    ```
    cd level2auth
    ```
  - And start the dev server:
    ```
    pnpm dev
    ```
  - Open your browser and go to:
    ```
    http://localhost:3000
    ```
- **Step 0.2**
  - Clean the UI
  - Delete unused stuff like `/public/next.svg`, `/vercel.svg`

---

## Phase 1: Supabase Setup & Configuration
This phase will connect your app to a real Supabase project and get the Supabase client ready to use.
- **Step 1.1 - Create a Supabase Project**
  1. Go to https://supabase.com

  2. Sign in with GitHub or Google (or create a new account)

  3.  Click New Project:
      - Name: level2auth
      - Password: any strong DB password (you can save this in a password manager)
      - Region: Choose the one closest to you (e.g., India – Mumbai)

  4. Go to Project > Settings > API

      - Copy:

        - Project URL (starts with https://...supabase.co)

        - Anon public key

        - (Note the Service Role Key but DO NOT use it in the frontend)

     You’ll use URL and anon key in .env.local in the next step.
- **Step 1.2 - Install Supabase JS Client**
  - Run this in terminal
  `pnpm add @supbase/supabase-js`
- **Step 1.3 - Set Up Environment Variables**
  1. Create a file: `.env.local` in the root
  2. Add the credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
- **Step 1.4 – Create Supabase Client**
  - Why do we need a Supabase client?
    - When we use Supabase in our frontend app, we must initialize a connection to Supabase’s backend. This connection lets us:
      - Sign up / log in users
      -  Get their session
      - Fetch or insert data into Supabase tables
      - Perform storage uploads
      - And more...
    - To do that, Supabase provides a JavaScript library:
      ```
      @supabase/supabase-js
      ```
    - This library requires two key pieces of information to connect your app to your Supabase project:
      1. Supabase URL - unique endpoint for your database + API
      2. Anon/Public Key - a public key used by frontend apps to make sage calls
    - These are injected using environment variables.
  - Create `lib/` folder and make `supabase.ts` file and add this inside it:
    ```ts
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```
    - This creates a singleton Supabase client that we can import anywhere in the app.
- **Step 1.5 – Quick Test**
  - In `src/app/page.tsx`, import the client and test:
  ```ts
  'use client';

  import { supabase } from '@/lib/supabase';
  import { useEffect } from 'react';

  export default function Home() {
    useEffect(() => {
      supabase.auth.getSession().then((res) => {
        console.log('Initial session:', res.data.session);
      });
    }, []);

    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Auth Playground - Level 2</h1>
      </main>
    );
  }
  ```
  - Then check your browser dev tools → Console. It should show:
  ```
  Initial session: null
  ```
  - Means Supabase client is connected.

## Phase 2 - Authentication Infrastructure
- Goal:
  - Build the foundation that manages user sessions, tracks authentication state, and makes this data accessible across your entire app.
  - We'll create:
    1. A global Auth Provider to manage login state and user data
    2. A custom `useAuth` hook for easy access to auth across pages and components
    3. Full session persistence and automatic login detection on refresh
    4. Secure login, signup, logout functions inside the provider
  - Supabase Auth API Methods
    | Function                                                | Purpose                       | Usage                    |
      | ------------------------------------------------------- | ----------------------------- | ------------------------ |
      | `supabase.auth.signUp({ email, password })`             | Sign up user                  | Sends verification email |
      | `supabase.auth.signInWithPassword({ email, password })` | Login with email/password     | Verifies credentials     |
      | `supabase.auth.signOut()`                               | Logout current user           | Clears session           |
      | `supabase.auth.getUser()`                               | Get current user if logged in | Used on page refresh     |
      | `supabase.auth.onAuthStateChange()`                     | Watch for login/logout        | Keeps state updated      |

- **2.1 - Signup**
  - Goal:  Build a simple signup form that allows users to register with email and password — no context involved yet. This helps test if the Supabase project and auth setup are working.
  - Tasks:
    - Create `/src/app/signup/page.tsx`
    - Add a form with:
      - email
      - password
    - Call `supabase.auth.signup({ email, password })` directly
    - Redirect to `/login` after signup
    - Display only error messages (if any)
  -  Code: `src/app/signup/page.tsx`
      ```ts
      'use client'

      import { useState } from 'react'
      import { useRouter } from 'next/navigation'
      import { supabase } from '@/lib/supabase'

      export default function SignupPage() {
        const router = useRouter()

        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [error, setError] = useState('')
        const [loading, setLoading] = useState(false)

        const handleSignup = async (e: React.FormEvent) => {
          e.preventDefault()
          setError('')
          setLoading(true)

          const { error } = await supabase.auth.signUp({
            email,
            password
          })

          setLoading(false)

          if (error) {
            setError(error.message)
          } else {
            router.push('/login')
          }
        }

        return (
          <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        )
      }
      ```
  - Testing successfull signup
    - Enter a valid email and password
    - Submit the form
    - Check Supabase Dashboard > Auth> Users - You should see the new user added.

- **Step 2.2 - Login Page**
  - Goal: Let users sign in with their email and password using Supabase.
  - Key Tasks:
    1. Create the file: `src/app/login/page.tsx`
    2. Add a login form with:
      - Email input
      - Password input
      - Submit button
    3. On form submit:
      - Call `supabase.auth.signinWithPassword({email, password})
      - Handle: 
        - Error (invalid login, network)
        - Redirect to `/secret` (we'll protect that page later)
  - Code – `src/app/login/page.tsx`
    ```ts
    'use client';

    import { useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { supabase } from '@/lib/supabase';

    export default function LoginPage() {
      const router = useRouter();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);

      const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        setLoading(false);

        if (error) {
          setError(error.message);
        } else {
          router.push('/secret'); // Redirect to protected page
        }
      };

      return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        </div>
      );
    }
    ```
- **Step 2.3 - Secret Page**
  - Goal: Create a protected page that only logged-in users can access.
  - We'll manually fetch the current user using supabase.auth.getUser() — no context yet.
  - Key Tasks:
    1. Create this file: `src/app/secret/page.tsx`
    2. Use the `useEffect` hook to:
      - Fetch the user on mount using `supabase.auth.getUser()`
      - Redirect to `/login` if no session/user
      - Show a loading state while checking
  - Code - `src/app/secret/page.tsx`
    ```ts
    'use client'

    import React, { useState, useEffect } from 'react'
    import { ShieldCheckIcon } from '@heroicons/react/24/outline'
    import { useRouter } from 'next/navigation'
    import { supabase } from '@/lib/supabase';

    export default function Secret() {
      const router = useRouter()

      // State to track whether user authentication check is still loading
      const [loading, setLoading] = useState(true);

      // useEffect runs once after component mounts to check if user is authenticated
      useEffect(() => {
        // Async function to check current user session from Supabase
        const checkUser = async () => {
          // Get current user from Supabase auth API
          const { data, error } = await supabase.auth.getUser();

          // If error or no user found, redirect to login page
          if (error || !data.user) {
            router.push('/login');
          }

          // Authentication check done, stop loading spinner
          setLoading(false);
        };

        // Call the async checkUser function
        checkUser();
      }, [router]); // Dependency on router instance (stable but required for React rules)

      // While loading, show a simple loading message
      if (loading) {
        return <div className='p-4 text-center'>Loading...</div>;
      }

      // Main secret page content shown only after successful auth check
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-gray-950 border border-gray-800 rounded-xl shadow-lg p-10 text-center animate-fade-in">
            {/* Icon to visually emphasize protected content */}
            <div className="flex justify-center mb-6">
              <ShieldCheckIcon className="h-16 w-16 text-emerald-400" />
            </div>
            {/* Heading */}
            <h1 className="text-3xl font-bold text-white mb-2">Access Granted 🔐</h1>
            {/* Description */}
            <p className="text-gray-400 mb-6">
              You&apos;ve reached the secret area of the app. This route is protected and visible only to authenticated users.
            </p>
            {/* Fun little footer text */}
            <div className="text-sm text-gray-600">
              You must be someone important. 🤫
            </div>
          </div>
        </div>
      )
    }
    ```
- **Step 2.4 - Create AuthContext.tsx**
  - Goal
    - Centralize auth logic (user state, signup, login, logout)
    - Provide this auth info and functions app-wide via React Context
    - Authomaticlly update user state on sesson changes
  - Why do this?
    - Right now, your signup/login pages handle auth logic separately. This means:
      - Duplication of code
      - No centralized state to know if user is logged in on any page
      - Difficult to manage session chagnes (like logout, in another tab)
    - The `AuthContext` solves this by providing a single source of truth for auth state & actions.
  - What we will do:
    - Create React context for auth state: user info and loading status
    - Add functions for login, logout, signup (wrapping Supabase methods)
    - Listen to Supabase's session changes and update user accordingly
    - Provide this context to the entire app (wrap in layout.tsx)
    - Later, update your pages to use this context instead of direct Supabase calls
  - Create `src/contexts/AuthContext.tsx`
    ```ts
    'use client';

    import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
    import { supabase } from '@/lib/supabase';
    import type { User } from '@supabase/supabase-js';

    interface AuthContextType {
      user: User | null;
      loading: boolean;
      signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
      signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
      signOut: () => Promise<void>;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export function AuthProvider({ children }: { children: ReactNode }) {
      const [user, setUser] = useState<User | null>(null);
      const [loading, setLoading] = useState(true);

      // On mount: check active session and set user
      useEffect(() => {
        const getUser = async () => {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            setUser(null);
          } else {
            setUser(data.user);
          }
          setLoading(false);
        };
        getUser();

        // Listen to auth state changes (login, logout, token refresh)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => {
          listener.subscription.unsubscribe();
        };
      }, []);

      // Signup function wrapping supabase.auth.signUp
      const signUp = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        return { error };
      };

      // SignIn function wrapping supabase.auth.signInWithPassword
      const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        return { error };
      };

      // SignOut function wrapping supabase.auth.signOut
      const signOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
      };

      return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
          {children}
        </AuthContext.Provider>
      );
    }

    // Custom hook for consuming auth context easily
    export function useAuth() {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    }
    ```
  - Explanation:

    - `user` and `loading` hold current user info and loading state globally

    - On component mount, we get current user from Supabase and update state

    - We listen for session changes via `onAuthStateChange` and update user accordingly

    - Signup, signin, signout functions wrap Supabase calls, set loading state, and update user accordingly

    - `useAuth` hook lets you consume this context easily anywhere in your app
- **Step 2.5 - Wrap your entire app with `<AuthProvider>`
  - Why?: Wrapping your app with `<AuthProvider>` makes usre every page and component inside your app can access the auth context (user info, login, logout, etc).
  - How to do it:
    - Open your `src/app/layout.tsx` file and wrap the children with `<AuthProvider>`:
      ```ts
      // src/app/layout.tsx
      'use client';

      import { AuthProvider } from '@/contexts/AuthContext';

      export default function RootLayout({ children }: { children: React.ReactNode }) {
        return (
          <html lang="en">
            <body>
              <AuthProvider>
                {children}
              </AuthProvider>
            </body>
          </html>
        );
      }
      ```
- **Step 2.6 - Refactor Signup and Login pages to use AuthContext**
  - Why?
    - Now that auth logic is centralized in context, pages should use that context instead of calling Supabase directly. This keeps things DRY and easier to maintain.
  - signup page :
    ```ts
    'use client'

    import { useState } from 'react'
    import { useRouter } from 'next/navigation'
    import { useAuth } from '@/contexts/AuthContext'

    export default function SignupPage() {
      const router = useRouter()
      const { signUp } = useAuth();

      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [error, setError] = useState('')
      const [loading, setLoading] = useState(false)

      const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await signUp(email, password);

        setLoading(false)

        if (error) {
          setError(error.message)
        } else {
          router.push('/login')
        }
      }

      return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
          <h1 className="text-2xl font-bold mb-4 ">Sign Up</h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      )
    }
    ```
  - login page
    ```ts
    'use client';

    import { useState } from 'react';
    import { useRouter } from 'next/navigation';
    import { useAuth } from '@/contexts/AuthContext';

    export default function LoginPage() {
      const router = useRouter();
      const { signIn } = useAuth();

      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);

      const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signIn(email, password);

        setLoading(false);

        if (error) {
          setError(error.message);
        } else {
          router.push('/secret'); // Redirect to protected page
        }
      };

      return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </form>
        </div>
      );
    }
    ```
- **Step 2.7 - Implement Logout Functionality + State-Based Conditional Rendering**
  - Goal: Add a logout button somewhere (e.g., in your navbar) that calls `signout` form your `AuthContext` and redirects the user back to the login page & control what to show on the navbar based on auth state:

  - Navbar.tsx code:
    ```ts
    'use client'
    import { useRouter } from 'next/navigation'
    import { useAuth } from '@/contexts/AuthContext'

    export default function Navbar() {
      const router = useRouter()
      const { signOut, user } = useAuth()

      const handleLogout = () => {
        signOut()
        router.push('/')
      }

      return (
        <div className='flex bg-blue-700 py-2 justify-between'>
          <div>
            <button className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer' onClick={() => router.push('/')}>Home</button>
          </div>
          <div>
            {
              user ? (
                <span>Hello, {user?.email}</span>
              ) : (
                ""
              )
            }
          </div>
          <div>
            {
              user ? (
                <button className='mx-5 font-bold border text-red-500 px-2 py-1 rounded cursor-pointer' onClick={handleLogout}>Logout</button>
              ) : (
                <button className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer' onClick={() => router.push('/login')}>Login</button>
              )
            }
          </div>
        </div>
      )
    }
    ```

## Set Hosted Redirect URL in Supabase
1. Go to Supabase Dashboard
  - Open [https://supabase.com](https://supabase.com)
  - Select your project
2. Navigate to Authentication Settings
  - Go to `Authentication` -> `URL Configuration`
3. Update Site URL
  - You'll see a field called "Site URL".
  - Replace the `http://localhost:3000` with you deployed app's URL.

    Example:
    ```
    https://your-app.vercel.app
    ```
4. Save Changes

### What This Does

This updates the base URL used for magic links and OAuth redirects. So any future magic link emails will now redirect to your live app instead of your local dev environment.