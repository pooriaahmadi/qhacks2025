function onWebsiteLoad() {
  // Should call whenever we load a webpage (gotta make this work lol)
  const websiteName = "Spotify";
  const websiteNameElem = document.getElementById("web-name");
  websiteNameElem.innerText = `Here's what we found from ${websiteName}:`;
}

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
const API_ENDPOINT = "http://127.0.0.1:8000";
const getResults = async (domainName) => {
  console.log(domainName);
  const response = await fetch(
    `${API_ENDPOINT}/generation?domain=${domainName}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};

const COLORS = ["red", "red", "orange", "orange", "green"];
const main = async () => {
  const domainName = tldts.parse(await getCurrentURL()).domain; // Parse the URL
  const faults = (await getResults(domainName)).response.faults;
  let cardss = document.querySelector(".cards");
  for (let i = 0; i < faults.length && i < 5; i++) {
    const fault = faults[i];
    const element = document.createElement("div");
    element.innerHTML = `
        <div class="card ${COLORS[i]}">
          <div class="wrapper">
          <div class="text">
            <h2>${fault.FaultHeading}</h2>
          </div>
          <div class="note">
            <img src="images/note.png" />
          </div>
          <div class="triangle">
            <img src="images/triangle.svg" />
          </div>
        </div>
        <p class="hidden">
          <strong>Reason: </strong>${fault.FaultDescription}
        </p>
        <p class="hidden2">
          <strong>Citation: </strong>"${fault.FaultQuote}"
        </p>
        </div>
      `;
    cardss.appendChild(element);
  }

  ///////////
  const cards = document.querySelectorAll(".card");
  const triangles = document.querySelectorAll(".triangle");
  const notes = document.querySelectorAll(".note");

  notes.forEach((note, index) => {
    note.addEventListener("click", () => {
      cards[index].classList.toggle("open2");
      cards[index].classList.remove("open1");

      cards.forEach((n) => {
        if (n !== cards[index]) {
          n.classList.remove("open1", "open2");
        }
      });
    });
  });

  triangles.forEach((triangle, index) => {
    triangle.addEventListener("click", () => {
      cards[index].classList.toggle("open1");
      cards[index].classList.remove("open2");
      cards.forEach((c) => {
        if (c !== cards[index]) {
          c.classList.remove("open1", "open2");
        }
      });
    });
  });
};

main();
