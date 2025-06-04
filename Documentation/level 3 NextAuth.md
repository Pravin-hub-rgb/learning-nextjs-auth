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

## Phase 1: Supabase DB + Prisma
- This phase is all about preparing your database layer using Supabase + Prisma. No authentication just yet -- only a `users` table and basic DB setup.
- **Step 1.1: Create a New Supabase Project**
  1. Go to [https://supabase.com/](https://supabase.com/)
  2. Click "New Project"
  3. Select your organization an dname your project (e.g., `level3auth`)
  4. Chose a strong database password
  5. Select nearest region and hit Create

  Once the project is create:
  - Go to `Settings -> Database -> Connection string
  - Copy the connection string (URI) -- you'll need it for Prisma