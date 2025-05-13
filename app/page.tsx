"use client";
import LoginPage from "./[slug]/page";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Suspense } from "react";

export default function Home() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeOoeUqAAAAACxHiEEOGqsTkvB41eLEo-GJaxGh">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}
