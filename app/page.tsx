"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import LoginPage from "./[slug]/page";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeOoeUqAAAAACxHiEEOGqsTkvB41eLEo-GJaxGh">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}

