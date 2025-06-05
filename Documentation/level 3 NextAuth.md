# ✅ Level 3: NextAuth.js Auth (with Supabase DB)

- [Access Source Code of this project](../source-code/level3auth/) and run the project locally.
- [Test the Project Live](https://nextjs-level3-auth.vercel.app/)

---

## 🔑 Summary

We’ll use **NextAuth.js** with the **Credentials Provider** to enable authentication via **email + password**.

> 🔸 **Supabase is used only as a database** — we’ll manage the `users` table manually via Prisma with hashed passwords.

---

## ⚙️ What NextAuth Handles

- User **login** via `signIn("credentials")`
- **Session management** using secure **cookies** and **JWT**
- Persistent sessions — automatically handled
- APIs like `useSession()` and `getServerSession()` to access auth state

---

## 🧠 Authentication Flow

- Users **sign up** using a custom form that calls a custom API:
  - Passwords are hashed using bcrypt
  - User is stored in Supabase DB using Prisma
- Users **log in** via `signIn("credentials")`, which:
  - Verifies email + password
  - Returns JWT-based session
- Session automatically persists and updates UI

---

## 🔁 Auth State (via `SessionProvider`)

The app is wrapped in `<SessionProvider>` so all components can access:

- `useSession()` — gives current session and loading state
- `signIn()` — to log in
- `signOut()` — to log out

> Navbar dynamically changes:
> - Logged out: shows **Login**
> - Logged in: shows **Hello, user@email.com** + **Logout**

---

## 🔐 Protected Routes (e.g. `/secret`)

- Uses `useSession()` or `getServerSession()` to check if user is logged in
- If not logged in, redirects to `/login`
- Logged-in users can access protected content

---

## 💻 UI Behavior

- `/login` → custom login form that calls `signIn("credentials")`
- `/signup` → form that posts to `/api/signup` to register user
- Navbar updates dynamically on login/logout
- Session persists across refreshes and tabs

---

## 📦 Tools Used in This Level

- [`next-auth`](https://next-auth.js.org/) – for authentication
- [`prisma`](https://www.prisma.io/) – ORM for Supabase DB
- [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) – for hashing passwords
- [`@prisma/client`](https://www.prisma.io/docs/client/wasm) – DB queries
- [`tailwindcss`](https://tailwindcss.com/) – basic styling
- [`react-hook-form`](https://react-hook-form.com/) – form handling 


- Navigation
  - [Go to Main Doc](../README.md)

---

## Phase By Phase Plan
## Phase 0 (Project Setup)
- **Step 0.1**
  - We'll start fresh by creating a new project called:
    ```
    level3auth
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
    cd level3auth
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


**## Phase 1: Supabase DB + Prisma**
- This phase is all about preparing your database layer using Supabase + Prisma. No authentication just yet -- only a `users` table and basic DB setup.

- **Step 1.1: Create a New Supabase Project**
1. Go to [https://supabase.com/](https://supabase.com/)
2. Click "New Project"
3. Select your organization and name your project (e.g., `level3auth`)
4. Choose a strong database password
5. Select nearest region and hit Create

Once the project is created:
- Go to Navbar and click on `Connect`
- Copy the connection string (URI) -- you'll need it for Prisma

- **Step 1.2: Create a users Table in Supabase**
  - You can do this from the SQL Editor:

  ```sql
  create table users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    password text not null,
    created_at timestamp with time zone default now()
  );
  ```

  - This will store users who register via the signup page in the next phase.

  - **Step 1.3: Install Prisma and Initialize**

  Inside your project directory (level3auth):
  ```
  pnpm add -D prisma
  pnpm add @prisma/client
  npx prisma init
  ```

  This will create:
  ```
  /prisma/schema.prisma
  .env
  ```

- **Step 1.4: Set Up Prisma Schema for Supabase**

  In .env, replace the DATABASE_URL with your Supabase DB connection string:
  ```
  DATABASE_URL="postgresql://your-username:your-password@db.your-project-id.supabase.co:5432/postgres"
  ```

  **⚠️ IPv6 Connection Issues:**
  If you get "Network is unreachable" errors, your system might not support IPv6. Check if your database hostname resolves to IPv6 only:
  ```bash
  dig A db.your-project-id.supabase.co
  ```

  If no IPv4 address is returned, use the **Transaction Pooler** (IPv4 compatible) instead:

  1. In Supabase Dashboard → Settings → Database
  2. Scroll to **Connection pooling** section
  3. Copy the **Transaction pooler** connection string:
  ```
  DATABASE_URL=postgresql://postgres.your-project-id:your-password@aws-0-region.pooler.supabase.com:6543/postgres
  ```

  This pooler is IPv4 compatible and often works better for development environments.

  In prisma/schema.prisma, update it to:
  ```ts
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    password  String
    createdAt DateTime @default(now())
  }
  ```

  💡 Prisma model should match the Supabase table exactly (including field names and types).

- **Step 1.5: Sync Schema with Supabase**

  Run:
  ```
  npx prisma db push
  ```

  **Troubleshooting Connection Issues:**
  - If you get "Can't reach database server" errors, try the IPv4 pooler connection string above
  - Test connectivity: `telnet your-pooler-hostname 6543`
  - If still failing, check if your Supabase project is active (not paused)

  This tells Prisma: "My table already exists in Supabase — just match your schema to it."

  Done! Prisma is now connected to your Supabase DB.
- **Step 1.6 (Optional but Recommended): Create prisma.ts Client**

  Create this file:
  ```
  /lib/prisma.ts
  ```
  ```ts
  import { PrismaClient } from '@/generated/prisma'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma =
    globalForPrisma.prisma ?? new PrismaClient()

  if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma
  ```
    This avoids multiple instances of Prisma client during dev reloads.
  - **How to Test Phase 1 (Supabase + Prisma Setup)**

    We’ll run 2 simple tests:

    Connect to the database using Prisma

    Check if the users table can be read/written from Next.js

    Step 1: Create a Simple API Route to Fetch Users

    Create a new file:
    ```
    /src/app/api/test-users/route.ts
    ```
    ```ts
    import { prisma } from '@/lib/prisma'
    import { NextResponse } from 'next/server'

    export async function GET() {
      try {
        const users = await prisma.users.findMany()
        return NextResponse.json({ users })
      } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
      }
    }
    ```
    Step 2: Test in the Browser

    Start the dev server if it’s not already running:
    ```
    pnpm dev
    ```
    Then visit:

    http://localhost:3000/api/test-users

    You should see:
    ```
    {
      "users": []
    }
    ```
    If you see an empty array: ✅ It means Prisma is correctly connected to Supabase and your users table exists.

##  Phase 2: Setup NextAuth.js (Credentials Provider)
- We are setting up authentication (login) using NextAuth.js with a Credentials Provider, meaning users log in by typing their email and password.

- We want the backend to:
  -  Receive email & password from user
  -  Check if this user exists in the database (Supabase)
  -  Verify the password matches (using bcrypt password hashing)
  -  Create a session (via JWT) so the user stays logged in
- Why NextAuth.js?

  -  It handles sessions, JWTs, and common auth flows for us.

  -  We don’t have to build sessions or tokens from scratch.

  - It provides easy integration with Next.js API routes.
- Why Credentials Provider?

  - Because we want users to login with email and password (custom logic).

  -  Other providers (Google, GitHub) handle login externally — we want manual login.

  -  So we write our own authorize() function to validate users.

- **Step 2.1 Install dependencies**
  ```
  pnpm add next-auth bcryptjs
  ```
  -  next-auth: Library to handle authentication, session management, and token generation.
  -  bcryptjs: Library to securely compare a plaintext password with a hashed password stored in DB. (We never store plaintext passwords!)

- **Step 2.2: Create NextAuth API Route**
  - File location: src/app/api/auth/[...nextauth]/route.ts
  - Why this specific path?

    - `[...nextauth]` = "catch-all route" in Next.js
    - Handles ALL auth-related URLs automatically:

      - `/api/auth/signin` → login page
      - `/api/auth/signout` → logout
      - `/api/auth/session` → check if logged in
      - And many more!



    Complete Code with Explanations:
    ```ts
    import NextAuth from 'next-auth'
    import CredentialsProvider from 'next-auth/providers/credentials'
    import { compare } from 'bcryptjs'
    import { prisma } from '@/lib/prisma'

    const handler = NextAuth({
      // PROVIDERS: Different ways users can log in
      providers: [
        CredentialsProvider({
          name: 'Credentials', // Display name
          
          // CREDENTIALS: What fields to show on login form
          credentials: {
            email: { 
              label: 'Email',        // Text shown to user
              type: 'text'           // HTML input type
            },
            password: { 
              label: 'Password', 
              type: 'password'       // Hides input with dots
            },
          },
          
          // AUTHORIZE: This function runs when user tries to log in
          async authorize(credentials) {
            // Step 1: Check if email and password were provided
            if (!credentials?.email || !credentials.password) {
              console.log('❌ Missing email or password')
              return null // null = login failed
            }

            // Step 2: Look for user in database
            const user = await prisma.users.findUnique({
              where: { email: credentials.email },
            })
            
            // Step 3: Check if user exists and has a password
            if (!user || !user.password) {
              console.log('❌ User not found or no password set')
              return null
            }

            // Step 4: Verify password
            const isValid = await compare(credentials.password, user.password)
            if (!isValid) {
              console.log('❌ Invalid password')
              return null
            }

            // Step 5: Success! Return user data
            console.log('✅ Login successful for:', user.email)
            return {
              id: user.id,
              email: user.email,
              // Add any other user data you want in the session
            }
          },
        }),
      ],
      
      // SESSION: How to store user data
      session: {
        strategy: 'jwt', // Use JSON Web Tokens (stored in browser cookies)
        // Alternative: 'database' (stores sessions in database)
      },
      
      // PAGES: Customize auth pages (optional)
      //pages: {
      //  signIn: '/api/auth/signin', // Use NextAuth's built-in login page
        // Later we can change this to: signIn: '/login' (custom page)
      //},
      
      // SECRET: Used to encrypt JWT tokens
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Export for both GET and POST requests
    export { handler as GET, handler as POST }
    ```
- **Step 2.3 - Environment Variables**
  - in `.env.local` add:
  ```
  NEXTAUTH_SECRET=your_super_secret_key_here
  NEXTAUTH_URL=http://localhost:3000
  ```
  - What is NEXTAUTH_SECRET?

    - Used to encrypt/decrypt JWT tokens
    - If someone knows this, they can fake login tokens
    - Must be at least 32 characters
    - Change it if ever compromised
- **Step 2.4 - Manually Add a Test User (Until Signup Is Built)**

  We’ll insert one test user via Supabase Table Editor.

  But first, hash your password using bcryptjs:

  Create a test script scripts/hash.js:
  ```js
  import { hash } from 'bcryptjs'

  const run = async () => {
    const hashed = await hash('123456', 10)
    console.log(hashed)
  }

  run()
  ```
  Run it:
  ```
  node scripts/hash.js
  ```
  Copy the result and go to:

  Supabase Dashboard → Table Editor → users table → Insert:
  ```
  id: (auto-generated)
  email: test@gmail.com
  password: <paste hashed password>
  ```

- **Understanding Built-in Routes**

  NextAuth automatically creates these URLs for you:

  | URL | What it does | When to use |
  |-----|-------------|-------------|
  | `/api/auth/signin` | Shows login form | Users need to log in |
  | `/api/auth/signout` | Logs user out | Users want to log out |
  | `/api/auth/session` | Returns current user info | Check if someone is logged in |
  | `/api/auth/callback/credentials` | Handles login form submission | Used internally |
  | `/api/auth/csrf` | Security token | Used internally |
  Testing the routes:

    1. Login Page:

        - Go to: http://localhost:3000/api/auth/signin

        - You'll see a basic form with email/password fields


    2. Check Session:

        - Go to: http://localhost:3000/api/auth/session
        - Shows {} if not logged in
        - Shows user data if logged in


    3. Logout:

       - Go to: http://localhost:3000/api/auth/signout
        - Clears your session
  
##  Phase 3: Signup + Login UI
- Goal
  - Until now:
    -  We had the database and NextAuth config set up.
    -   But we didn’t give users a proper way to sign up or log in.
- In this phase, we’ll:

   - Create a custom Signup API route to store new users.

   - Build a Signup form UI to call that route.

    - Build a Login form UI that uses next-auth credentials provider.

   - On successful login, redirect users to /secret page (protected in Phase 5).
- **Step 3.1: Create Signup API Route**

  This is the backend route to register new users into the Supabase database.

  `/app/api/signup/route.ts`
  ```ts
  import { NextResponse } from 'next/server'
  import { prisma } from '@/lib/prisma'
  import { hash } from 'bcryptjs'

  export async function POST(req: Request) {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Check if user already exists in Supabase DB
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password before saving to DB
    const hashedPassword = await hash(password, 10)

    // Create new user
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
  }
  ```
- Why we're doing this:

    - We don't use Supabase Auth — only Supabase DB — so we manually handle signup.

    - We hash the password before saving (never store plain passwords).

    - If a user already exists, we block duplicate registrations.
- **Step 3.2: Signup Form UI**

  `/app/signup/page.tsx`
  ```ts
  'use client'
  import { useState } from 'react'
  import { useRouter } from 'next/navigation'

  export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setSuccess('')

      const res = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        setSuccess('Account created! Redirecting to login...')
        setTimeout(() => router.push('/login'), 1000)
      }
    }

    return (
      <form onSubmit={handleSignup} className="max-w-md mx-auto mt-20 space-y-4 border p-6 rounded">
        <h2 className="text-xl font-bold">Signup</h2>

        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border px-3 py-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Create Account</button>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
    )
  }
  ```
  -  we're doing this:

    - This is the frontend for signup that sends a POST request to our /api/signup route.

    - It handles all errors (like existing user).

    - Redirects to login page after successful signup.

- **Step 3.3: Login Page UI (with next-auth)**

  `/app/login/page.tsx`
  ```ts
  'use client'
  import { useState } from 'react'
  import { signIn } from 'next-auth/react'
  import { useRouter } from 'next/navigation'
  import Link from 'next/link'

  export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/secret')
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="space-y-4 p-6 border rounded w-96">
          <h2 className="text-xl font-bold">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Log In
          </button>
          <Link className="block text-blue-400 underline" href="/signup">Don't have an account? Signup!</Link>
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    )
  }
  ```
  - Why this works:

      - signIn('credentials') triggers the logic inside your [...nextauth].ts route.

     - If credentials are valid, the session starts (stored as JWT).

     - We use redirect: false so we can manually control where to send the user after login.
  - `secret page UI` (Just UI not protected yet)
    ```tsx
    import { ShieldCheckIcon } from '@heroicons/react/24/outline'

    export default function SecretPage() {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-gray-950 border border-gray-800 rounded-xl shadow-lg p-10 text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <ShieldCheckIcon className="h-16 w-16 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Access Granted 🔐</h1>
            <p className="text-gray-400 mb-6">
              You&apos;ve reached the secret area of the app. This route is protected and visible only to authenticated users.
            </p>
            <div className="text-sm text-gray-600">
              You must be someone important. 🤫
            </div>
          </div>
        </div>
      )
    }
    ```


## Phase 4: Auth State + Navbar

In this phase, we’ll connect our frontend UI (Navbar) with the authentication state managed by NextAuth.js using the `useSession()` hook. We’ll dynamically show “Hello, {email}” and Login / Logout buttons based on session state.

- **Step 4.1 — Setup `SessionProvider`**

  In order for `useSession()` to work, we need to wrap our application in NextAuth’s `<SessionProvider>`. Create a new file:

  ```tsx
  // app/providers.tsx
  'use client'

  import { SessionProvider } from 'next-auth/react'
  import React from 'react'

  export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
  }
  ```
  Then update your root layout to use this provider:
  ```tsx
  // app/layout.tsx
  import './globals.css'
  import Navbar from '@/components/Navbar'
  import { Providers } from './providers'

  export const metadata = {
    title: 'Level 3 Auth App',
    description: 'Learning NextAuth + Supabase',
  }

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    )
  }
  ```
- **Step 4.2 — Add Navbar.tsx in /components**

  Replace your old Supabase-based navbar (that used useAuth()) with this NextAuth-based version:
  ```tsx
  // app/components/Navbar.tsx
  'use client'

  import { useSession, signOut } from 'next-auth/react'
  import { useRouter } from 'next/navigation'

  export default function Navbar() {
    const { data: session } = useSession()
    const router = useRouter()

    const handleLogout = async () => {
      await signOut({ redirect: false }) // Prevent automatic redirect
      router.push('/')                   // Redirect manually after logout
    }

    return (
      <div className='flex bg-blue-700 py-2 justify-between'>
        <div>
          <button
            className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer'
            onClick={() => router.push('/')}
          >
            Home
          </button>
        </div>

        <div>
          {session?.user?.email ? (
            <span className='text-white'>Hello, {session.user.email}</span>
          ) : (
            ''
          )}
        </div>

        <div>
          {session ? (
            <button
              className='mx-5 font-bold border text-red-500 px-2 py-1 rounded cursor-pointer'
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer'
              onClick={() => router.push('/login')}
            >
              Login
            </button>
          )}
        </div>
      </div>
    )
  }
  ```
- **Step 4.3 — Understanding What’s Happening**

  | 🔍 Concept        | 📘 Explanation                                                                                                                |
  | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
  | `useSession()`    | Hook provided by NextAuth to check whether a user is logged in. Returns a `session` object containing user data (like email). |
  | `signOut()`       | Method to log the user out and clean up the JWT cookie.                                                                       |
  | `redirect: false` | We use this so we can redirect manually using Next.js router. This gives us more control over navigation.                     |


- **Step 4.4 — Add Navbar to Layout**

  Ensure that the Navbar component is included inside your global layout (as shown in Step 4.1). Because we wrapped everything in `<Providers>`, `useSession()` will now work correctly inside Navbar.
  ```tsx
  // app/layout.tsx
  import './globals.css'
  import Navbar from '@/components/Navbar'
  import { Providers } from './providers'

  export const metadata = {
    title: 'Level 3 Auth App',
    description: 'Learning NextAuth + Supabase',
  }

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </body>
      </html>
    )
  }
  ```

## Phase 5: Protect the Secret Page (Server-Side Auth)

In this phase, we'll secure the /secret route so that only logged-in users can access it. If someone tries to visit it without logging in, we'll redirect them to /login automatically — on the server side before the page even renders.

### What's New Here?
In previous phases, we used useSession() on the client.
Now, we use getServerSession() — a NextAuth function that works server-side and lets us:
- Access the user session before rendering the page.
- Redirect unauthenticated users immediately (faster and secure).

### **Step 5.1 — Create a separate authOptions file**

⚠️ **Important Note:** In Next.js 13+ App Router, you cannot export named exports like `authOptions` directly from route handlers. This causes the error: `"authOptions" is not a valid Route export field`. 

**Solution:** Create a separate file for your auth configuration that can be imported by both your route handler and server components.

Create `/app/api/auth/authOptions.ts`:

```tsx
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// ✅ Export this so we can reuse in server components
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        })
        
        if (!user || !user.password) return null
        
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null
        
        return { id: user.id, email: user.email }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### **Step 5.2 — Update your route handler**

Update `/app/api/auth/[...nextauth]/route.ts`:

```tsx
import NextAuth from 'next-auth'
import { authOptions } from '../authOptions'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### **Step 5.3 — Create /secret/page.tsx (Server-Side Protected Page)**

```tsx
// app/secret/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/authOptions'
import { redirect } from 'next/navigation'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default async function SecretPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-950 border border-gray-800 rounded-xl shadow-lg p-10 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <ShieldCheckIcon className="h-16 w-16 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Access Granted 🔐</h1>
        <p className="text-gray-400 mb-6">
          You&apos;ve reached the secret area of the app. Only authenticated users can access this.
        </p>
        <div className="text-sm text-gray-600">
          Welcome, {session.user?.email}
        </div>
      </div>
    </div>
  )
}
```

### **Step 5.4 — Why This Approach Works**

| 🔍 Feature | 💡 What It Does |
| -------------------- | ----------------------------------------------------------------- |
| **Separate authOptions file** | Avoids Next.js App Router export restrictions while allowing reuse |
| `getServerSession()` | Checks if the user is logged in (on server) before rendering page |
| `authOptions` import | Reuses the same config from our separate file |
| `redirect()` | Sends guests to `/login` if no valid session |

### **Key Takeaways:**
- ✅ **Do:** Create separate config files for reusable auth options
- ✅ **Do:** Import authOptions in both route handlers and server components
- ❌ **Don't:** Export named exports directly from route.ts files in App Router
- 🎯 **Result:** Clean separation of concerns and proper Next.js 13+ compatibility