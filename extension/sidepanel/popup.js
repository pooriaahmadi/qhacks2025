const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("open");
    cards.forEach((c) => {
      if (c !== card) {
        c.classList.remove("open");
      }
    });
  });
});
