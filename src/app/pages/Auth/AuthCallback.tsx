import { useEffect, useRef } from "react";
import { setSession } from "@/utils/jwt";
import { redirectToAdminLogin } from "@/utils/redirectToAdminLogin";

// Router ka basename same hai: "krushimall-branch" (capacitor me "/")
const BASE =
  import.meta.env.MODE === "capacitor" ? "" : "/krushimall-branch";

export default function AuthCallback() {
  // StrictMode me effect 2 baar chalta hai; doosri baar hash khali hota hai
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("token");
    const userRaw = params.get("user");

    // Token ko URL/history se turant hata do
    window.history.replaceState(null, "", window.location.pathname);

    if (!token) {
      redirectToAdminLogin();
      return;
    }

    try {
      setSession(token);

      // Branch AuthProvider yahi key padhta hai
      if (userRaw && userRaw !== "null") {
        localStorage.setItem("branchUser", userRaw);
      }

      // Full reload, taaki AuthProvider init me naya token utha le
      window.location.replace(`${BASE}/select-company`);
    } catch (err) {
      console.error(err);
      redirectToAdminLogin();
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      Signing you in...
    </div>
  );
}