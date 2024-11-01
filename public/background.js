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

        const tempoContext = JSON.parse(decodedToken.tempo_context);

        const workerId = tempoContext.user.accountId;
        const expiryDateString = expiryDate.toISOString();
        const data = { token, expiryDate: expiryDateString, workerId };

        chrome.storage.local.set(data, () => {
          console.log("Token and expiry date stored in local storage", data);
        });
      }
    }
  },
  { urls: ["https://app.eu.tempo.io/*"] },
  ["requestHeaders"]
);
