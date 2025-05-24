## SSR + CSR

### 🧠 What is SSR?- SSR stands for Server-Side Rendering.

- 🔁 When you visit a page like /secret, Next.js might:
  
  - Run some code on the server
  - Build the HTML on the server
  - Then send that HTML to the browser

- This is called Server-Side Rendering (SSR).
  You're not getting a blank HTML page and loading data later. You're getting a full page already filled with content, generated on the server.

- ✅ Benefits of SSR:
  
  - SEO-friendly (search engines can read your content)
  
  - Faster "first paint" (user sees content sooner)
  
  - Data is loaded before the page hits your browser

## 🤖 Then What's CSR?

- CSR = Client-Side Rendering

- Here:
  
  - Your browser loads a mostly empty HTML
  
  - Then JavaScript runs in the browser
  
  - Then it fetches data and updates the UI
    
    This is what typical React apps do by default.

- 🧨 The Problem: Now here’s the core issue you just ran into 👇
  
  - ❗ In SSR (server-side), there is no browser, so:
    
    - window is undefined
    
    - localStorage is undefined
    
    - document is undefined
    
    Because there's no "window object" on the server — it's not a real browser, it's just Node.js.

- ⚠️ So What Happens?
  
  - If you do this:
    
    ```ts
    localStorage.getItem('isLoggedIn')
    ```
    
      and this code runs on the server, it'll crash your app:
    
      `ReferenceError: localStorage is not defined`

- ✅ The Solution: Check if we’re in the browser
  
  - That’s why we wrap it like this:
    
    ```ts
    if (typeof window === 'undefined') return false
    ```
  
  - This line says: “If I’m on the server (not in the browser), don’t even try to run this. Just return false.”
  
  - This saves you from crashing the page when rendering on the server.

- 📌 Summary

| Term | Meaning                                    | Can use localStorage? |
| ---- | ------------------------------------------ | --------------------- |
| SSR  | Runs on server (before sending to browser) | ❌ No                  |
| CSR  | Runs in browser (React, interactivity)     | ✅ Yes                 |

- In our case:
  
  - We’re storing login info in localStorage (which is browser-only)
  
  - So we need to make sure our code only runs on the client
    
    And that's why that typeof window check is important 🔒