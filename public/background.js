chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    const authHeader = details.requestHeaders?.find(
      (header) => header.name.toLowerCase() === "authorization"
    );
    if (authHeader) {
      const token = authHeader.value?.replace("Tempo-Bearer ", "");

      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expiryDate = new Date(decodedToken.exp * 1000);

        const expiryDateString = expiryDate.toISOString();
        const data = { token, expiryDate: expiryDateString };

        chrome.storage.local.set(data, () => {
          console.log("Token and expiry date stored in local storage", _data);
        });
      }
    }
  },
  { urls: ["https://app.eu.tempo.io/*"] },
  ["requestHeaders"]
);
