# Level 1: Client-only Authentication

- Summary:
  - We'll use `localStorage` for data persistence combined with React Context for state management
  - An `AuthContext` will provide global access to authentication state and methods
  - There's *no real signup or backend.* We'll fake login with hardcoded credentials.

## Step-by-Step Plan

1. **Set Up the Project**
   
   - Framework: Next.js 15 (App Router)
   
   - Styling: Tailwind CSS
   
   - Add basic routes: /, /login, /secret, /profile
   
   - Add a Navbar with conditional "Login" or "Logout" based on auth context

2. **Fake User Data**
   
   ```ts
   // lib/fakeUser.ts
   export const fakeUser = {
   email: 'test@example.com',
   password: 'password123',
   name: 'Test User',
   }
   ```
   
   - The `lib/` folder is short for *library*, it's where we keep *helper logic (not UI)* like:
     - Auth Logic
     - Database wrappers
     - Utility functions (formatDate, getInitials, etc.)
   - It keeps things *clean and reusable*.

3. **Auth Logic (localStorage + Context)**
- File: `auth-local.ts`: This file is part of our `/lib` folder, and it acts like a mini local "auth service" — just like how real projects have services for Supabase, Firebase, NextAuth, etc.

-  Goal of `auth-local.ts`
  
  - Imports the dummy user from fakeUser.ts
  
  - Provides functions that simulate login/logout/auth state
  
  - Talks to the browser's localStorage to "pretend" you're logged in
    
    Think of it as a fake backend-auth system — just to help you learn the basics of auth without any real backend yet.

- What this file will contain
  
  ```ts
  import { fakeUser } from './fakeUser'
  
  export function login(...) { ... }
  export function logout() { ... }
  export function isAuthenticated() { ... }
  export function getCurrentUser() { ... }
  ```

- `login()` Function 
  
  -  Goal: Simulate logging in a user by:
    
    - Checking if entered email & password match the dummy user.
    - If yes, saving the login status and user data in localStorage.
  
  - File: `lib/auth-local.ts`
    
    ```ts
    import { fakeUser } from './fakeUser'
    
    export function login(email: string, password: string) {
    const { email: correctEmail, password: correctPassword } = fakeUser
    
    if (email === correctEmail && password === correctPassword) {
        // Save user state in browser's localStorage
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(fakeUser))
        return true
    }
    
    return false 
    }
    // return true/false: Tells the UI if login was successful
    ```
  
  - Learn out [localStorage Object](localStorage.md)

- `logout()` Function
  
  ```ts
  export function logout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  }
  ```

- `isAuthenticated()` Function
  
  ```ts
  export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false // SSR Safety
  return localStorage.getItem('isLoggedIn') === 'true'
  }
  ```
  
  - [Learn about SSR Safety](SSR&CSR.md)

- `getCurrentUser()` Function
  
  ```ts
  export function getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  ```

## 4. **Creating the Auth Context**

-  Why Use AuthContext?
  
  - Provides a central source of truth for authentication state
  - Makes auth state and methods available anywhere in your app
  - Components only re-render when auth state changes
  - Follows React's recommended pattern for sharing state between components

- Create this file: `/context/AuthContext.tsx`
  
  ```tsx
  'use client'
  
  import { createContext, useContext, useEffect, useState } from 'react'
  import { 
    isAuthenticated as checkAuth, 
    login as doLogin, 
    logout as doLogout, 
    getCurrentUser 
  } from '@/lib/auth-local'
  
  // Define the shape of our auth context
  type AuthContextType = {
    isAuthenticated: boolean
    user: { name: string; email: string } | null
    login: (email: string, password: string) => boolean
    logout: () => void
  }
  
  // Create the context
  const AuthContext = createContext<AuthContextType | undefined>(undefined)
  
  // Provider component that wraps your app and makes auth object available to any child component that calls useAuth()
  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  
    useEffect(() => {
      // Check auth status when the component mounts
      setIsAuthenticated(checkAuth())
      setUser(getCurrentUser())
    }, [])
  
    const login = (email: string, password: string): boolean => {
      const success = doLogin(email, password)
      if (success) {
        setIsAuthenticated(true)
        setUser(getCurrentUser())
      }
      return success
    }
  
    const logout = () => {
      doLogout()
      setIsAuthenticated(false)
      setUser(null)
    }
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }
  
  // Custom hook to use the auth context
  export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
      throw new Error('useAuth must be used within AuthProvider')
    }
    return context
  }
  ```

## 5. **Wrap Your App with AuthProvider**

- Update your root layout: `app/layout.tsx`
  
  ```tsx
  import { AuthProvider } from '@/context/AuthContext'
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </body>
      </html>
    )
  }
  ```

## 6. **Updated Login Page Using Context**

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(email, password)

    if (success) {
      router.push('/secret')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Email:</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  )
}
```

## 7. **Navbar Component Using Auth Context**

```tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          My App
        </Link>

        <div className="space-x-4">
          <Link href="/">Home</Link>

          {isAuthenticated ? (
            <>
              <Link href="/secret">Secret Page</Link>
              <Link href="/profile">Profile</Link>
              <span className="mr-4">Hello, {user?.name || user?.email}</span>
              <button 
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
```

## 8. **Protected Route Component**

```tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
```

## 9. **Secret Page Example**

```tsx
'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

export default function SecretPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Secret Page</h1>
        <p>This content is only visible to authenticated users!</p>
      </div>
    </ProtectedRoute>
  )
}
```

## 10. **User Profile Page Example**

```tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl mb-4">User Information</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
```

## How to Test It

1. Open the app and navigate to `/login`

2. Enter the test credentials:
   
   ```
   Email: test@example.com
   Password: password123
   ```

3. After successful login, you should:
   
   - See your name in the navbar
   - Be redirected to the `/secret` page
   - Be able to access the `/profile` page
   - No longer be able to access `/login` (it should redirect you)

4. Click "Logout" and verify:
   
   - You're redirected to the homepage
   - The navbar shows "Login" instead of your name
   - Attempting to visit `/secret` or `/profile` redirects you to login

## Key Benefits of This Approach

- **Centralized Auth Logic**: All authentication state and logic is managed in one place
- **Reactive UI Updates**: Components automatically react to auth state changes
- **Better Code Organization**: Components consume auth state without implementation details
- **DRY Code**: No duplicate localStorage access or auth checks scattered around components
- **Easy Transition to Real Auth**: When you move to a real backend auth solution, you only need to update the AuthContext implementation, not every component

This pattern is the foundation for more advanced authentication systems and is used in production applications with backend authentication services.