
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const categoryButtons = document.querySelectorAll(".category");
  const siteCards = document.querySelectorAll(".site-card");
  const resultText = document.getElementById("resultText");
  const emptyMessage = document.getElementById("emptyMessage");

  let selectedCategory = "all";

  function filterSites() {
    const query = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    let visibleCount = 0;

    siteCards.forEach((card) => {
      const category = (
        card.dataset.category || ""
      ).toLowerCase();

      const text = card.textContent.toLowerCase();

      const matchesCategory =
        selectedCategory === "all" ||
        category === selectedCategory;

      const matchesSearch =
        text.includes(query) ||
        (card.href || "").toLowerCase().includes(query);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    if (resultText) {
      resultText.textContent = query
        ? `${visibleCount} result(s) found`
        : `${visibleCount} websites available`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      selectedCategory = (
        button.dataset.category || "all"
      ).toLowerCase();

      filterSites();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterSites);
  }

  if (clearSearch && searchInput) {
    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      filterSites();
      searchInput.focus();
    });
  }

  // Update category counts automatically.
  document.querySelectorAll("[data-count]").forEach((countElement) => {
    const category = (
      countElement.dataset.count || ""
    ).toLowerCase();

    const count = [...siteCards].filter((card) => {
      return (
        (card.dataset.category || "").toLowerCase() === category
      );
    }).length;

    countElement.textContent = count;
  });

  // PWA service worker registration.
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  }

  filterSites();
});
