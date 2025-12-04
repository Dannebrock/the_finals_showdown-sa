// Admin credentials from environment variables
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123"

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS
}

export function setAuthToken(): void {
  if (typeof window !== "undefined") {
    const token = btoa(`${Date.now()}-authenticated`)
    sessionStorage.setItem("admin_token", token)
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!sessionStorage.getItem("admin_token")
}

export function logout(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("admin_token")
  }
}
