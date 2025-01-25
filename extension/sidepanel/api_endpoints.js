const API_ENDPOINT = "http://127.0.0.1:8000";

const sendTOS = async (domainName, tosText) => {
  const payload = {
    domain: domainName,
    text: tosText,
  };
  const response = await fetch(`${API_ENDPOINT}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send TOS");
  }
  return response.json();
};

const getResults = async (domainName) => {
  const payload = {
    domain: domainName,
  };
  const response = await fetch(`${API_ENDPOINT}/generate`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export { sendTOS, getResults };