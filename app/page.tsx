"use client";
import { Suspense } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import LoginPage from "./[slug]/page";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleReCaptchaProvider reCaptchaKey="6LeOoeUqAAAAACxHiEEOGqsTkvB41eLEo-GJaxGh">
        <LoginPage />
      </GoogleReCaptchaProvider>
    </Suspense>
  );
}

