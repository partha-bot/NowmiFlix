document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const categoryButtons = document.querySelectorAll(".category");
  const siteCards = document.querySelectorAll(".site-card");
  const resultText = document.getElementById("resultText");
  const emptyMessage = document.getElementById("emptyMessage");

  let selectedCategory = "all";

  function filterSites() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    siteCards.forEach((card) => {
      const category = card.dataset.category;
      const text = card.textContent.toLowerCase();

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const matchesSearch = text.includes(query);
      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) {
        visibleCount++;
      }
    });

    resultText.textContent = query
      ? `${visibleCount} result(s) found`
      : `${visibleCount} categories available`;

    emptyMessage.hidden = visibleCount !== 0;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      selectedCategory = button.dataset.category;

      filterSites();
    });
  });

  s
