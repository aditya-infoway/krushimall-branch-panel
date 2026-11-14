const ADMIN_APP_URL = (import.meta.env.VITE_ADMIN_APP_URL as string) || "";

// Branch session khatam hone par admin ke login page par bhejta hai
export function redirectToAdminLogin() {
  if (!ADMIN_APP_URL) {
    // Env set nahi hai to branch ke apne login par fallback
    window.location.replace("/krushimall-branch/login");
    return;
  }
  window.location.replace(`${ADMIN_APP_URL.replace(/\/$/, "")}/login`);
}