"use client";
import { useLanguage } from "./language";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
export function SignInButton({ configured }: { configured: boolean }) {
  const { t } = useLanguage();
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={!configured || pending}
      className="google-button"
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6M12 22c2.8 0 5.1-.9 6.9-2.4l-3.4-2.6c-.9.6-2 1-3.5 1a6 6 0 0 1-5.7-4.1H2.8v2.7A10.4 10.4 0 0 0 12 22M6.3 13.9a6.2 6.2 0 0 1 0-3.8V7.4H2.8a10.1 10.1 0 0 0 0 9.2M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 2.8 7.4l3.5 2.7A6 6 0 0 1 12 6"
        />
      </svg>
      {pending ? t("Connecting to Google…") : t("Continue with Google")}
    </Button>
  );
}
