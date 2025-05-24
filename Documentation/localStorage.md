# What is `localStorage`?
- `localStorage` is part of the **Web Storage API** that allows you to store **key-value pairs** in a user's browser, even after the browser is closed or the page is refreshed.
- Key points:
    - Persistent Storage: Data stays even after the page is reloaded or the browser is closed.
    - String-Based: Both the keys and values must be strings. (Objects must be serialized to strings.)
    - Client-Side Only: Not available in server-side environments (like Node.js or during SSR in Next.js).
    - Same-Origin Policy: Data is stored per domain/protocol/port — separate for https:// vs http://, for example.
- 🛠️ Properties & Methods

    - The localStorage object has the following:
    
        | Method                | Description                                                                  |
        | --------------------- | ---------------------------------------------------------------------------- |
        | `setItem(key, value)` | Stores a value under the given key. Overwrites if the key already exists.    |
        | `getItem(key)`        | Retrieves the value for the given key. Returns `null` if not found.          |
        | `removeItem(key)`     | Deletes the specified key and its value.                                     |
        | `clear()`             | Removes **all** key-value pairs in that origin’s storage.                    |
        | `key(index)`          | Returns the key name at the specified index (0-based). Useful for iteration. |

        | Property | Description                                         |
        | -------- | --------------------------------------------------- |
        | `length` | Returns the total number of stored key-value pairs. |

- 📚 Data Behavior

    - Data stored in localStorage is saved until explicitly deleted by the website or the user.

    - It is synchronous, meaning it blocks the main thread while reading or writing.

    - Unlike sessionStorage, localStorage survives across tabs, windows, and browser restarts (as long as the same origin is used).

- 📐 Storage Limits

    - Most browsers offer 5MB per origin for localStorage (varies slightly).

    - Exceeding the limit throws a QuotaExceededError.