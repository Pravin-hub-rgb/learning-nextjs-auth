import { fakeUser } from "./fakeUser";

export function login(email: string, password: string) {
    const { email: correctEmail, password: correctPassword } = fakeUser;

    if (email === correctEmail && password === correctPassword) {
        // Save user state in browser's localStorage
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify(fakeUser))
        return true
    }

    return false
}

export function logout() {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
}

export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('isLoggedIn') === 'true'
}

export function getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}