let loadingInterval = null;
let loadingTimeout = null;

const API_ENDPOINT = "http://127.0.0.1:8000";

const sendTOS = async (domainName, tosText) => {
  const payload = {
    domain: domainName,
    text: tosText,
  };
  const response = await fetch(`${API_ENDPOINT}/generation`, {
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
  const response = await fetch(`${API_ENDPOINT}/generation`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

function loadingDots() {
  numZeros = 0;
  loadingInterval = window.setInterval(function () {
    var loadingElem = document.getElementById("loading");
    if (numZeros >= 3) {
      loadingElem.innerText = "Loading";
      numZeros = 0;
      clearInterval(loadingInterval);
      loadingTimeout = setTimeout(() => {
        loadingDots();
      }, 700);
    } else {
      loadingElem.innerText += ".";
      numZeros++;
    }
  }, 300);
}

loadingDots();

const getCurrentURL = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        resolve(currentTab.url || "No active tab found!");
      } else {
        reject("No active tab!");
      }
    });
  });
};
async function getContent(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });
  const html = await response.text();

  // Parse the HTML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  // Find all <a> tags
  const links = Array.from(doc.querySelectorAll("a")); // Get all anchor tags

  return links; // Return the links if needed
}

function removeJavaScriptAndHTML(input) {
  // Remove script tags and their content
  const noScript = input.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove all HTML tags
  const noHTML = noScript.replace(/<\/?[^>]+>/gi, "");

  return noHTML.trim(); // Trim extra whitespace
}
async function getTOSText(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });
  const html = await response.text();

  // Parse the HTML content
  const doc = new DOMParser().parseFromString(
    DOMPurify.sanitize(html),
    "text/html"
  );

  return doc.body.innerText;
}

getCurrentURL().then((url) => {
  // Get rid of loading
  // clearInterval(loadingInterval);
  // clearTimeout(loadingTimeout);
  getContent(url).then((links) => {
    const keywords = [
      "terms",
      "TOS",
      "terms of service",
      "terms of use",
      "terms and conditions",
      "terms policy",
      "service agreement",
      "user agreement",
      "privacy policy",
      "conditions of use",
      "usage rules",
      "legal notice",
      "platform terms",
      "customer agreement",
      "website terms",
      "site policy",
      "rules and regulations",
      "online agreement",
      "end user agreement",
      "standards and obligations",
      "terms disclosure",
      "service guidelines",
      "contract agreement",
      "legal obligations",
    ];
    const tosLinks = links.filter((link) => {
      let text = link.innerText.toLowerCase();
      if (text.length == 0) {
        text = link.textContent.toLowerCase();
      }
      const href = link.href.toLowerCase();
      return keywords.some(
        (keyword) => text.includes(keyword) || href.includes(keyword)
      );
    });

    const TOSlinks = tosLinks.map((link) => ({
      text: link.innerText,
      href: link.href,
    }));

    if (TOSlinks.length > 0) {
      const TOSLINK = TOSlinks[0].href;
      const domainName = tldts.parse(url).domain; // Parse the URL

      getTOSText(TOSLINK).then((tosText) => {
        sendTOS(domainName, tosText)
          .then((response) => {
            stopLoading();
            // return to main page
            window.location.href = `index.html?domainName=${domainName}`;
          })
          .catch((err) => {
            stopLoading();
            document.getElementById("loading").innerText =
              "Failed to send TOS :(";
          });
      });
    } else {
      stopLoading();
      document.getElementById("loading").innerText = "TOS not found :(";
    }
  });
});

const stopLoading = () => {
  clearInterval(loadingInterval);
  clearTimeout(loadingTimeout);
};
