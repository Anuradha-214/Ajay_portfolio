
document.addEventListener("DOMContentLoaded", () => {
  // Portfolio category filtering
  const filterButtons = document.querySelectorAll(".filter");
  const workCards = document.querySelectorAll(".work-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update the active filter button
      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const selectedCategory = button.dataset.filter;

      // Show all images or only the selected category
      workCards.forEach((card) => {
        const matchesCategory =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        card.hidden = !matchesCategory;
      });
    });
  });

  // Set the current year automatically in the footer
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
