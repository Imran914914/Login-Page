"use client";
import LoginPage from "./[slug]/page";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Home() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeOoeUqAAAAACxHiEEOGqsTkvB41eLEo-GJaxGh">
      <LoginPage />
    </GoogleReCaptchaProvider>
  );
}
