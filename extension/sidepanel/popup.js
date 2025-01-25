const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("open");
    cards.forEach((c) => {
      if (c !== card) {
        c.classList.remove("open");
      }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        console.log(currentTab.url || "No active tab found!");
      } else {
        console.log("No active tab!");
      }
    });
  });
});
