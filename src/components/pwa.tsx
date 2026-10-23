"use client";
import { useEffect, useState } from "react";
export function PwaRegistration() {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {
        setFailed(true);
      });
  }, []);
  return failed ? (
    <p className="pwa-notice" role="status">
      Offline support is unavailable. You can continue learning online.
    </p>
  ) : null;
}
