
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const categoryButtons = document.querySelectorAll(".category");
  const groups = [...document.querySelectorAll(".site-group")];
  const resultText = document.getElementById("resultText");
  const emptyMessage = document.getElementById("emptyMessage");

  let selectedCategory = "all";

  // Automatically count website cards in each category.
  groups.forEach((group) => {
    const count = group.querySelectorAll(".website-card").length;
    const countElement = group.querySelector("[data-count]");

    if (countElement) {
      countElement.textContent = count;
    }

    group.dataset.total = String(count);

    const header = group.querySelector(".group-header");
    const panel = group.querySelector(".website-grid");

    if (header && panel) {
      header.addEventListener("click", () => {
        const isOpen =
          header.getAttribute("aria-expanded") === "true";

        header.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
        group.classList.toggle("expanded", !isOpen);
      });
    }
  });

  function filterSites() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleLinks = 0;
    let visibleGroups = 0;

    groups.forEach((group) => {
      const categoryMatches =
        selectedCategory === "all" ||
        group.dataset.category === selectedCategory;

      const header = group.querySelector(".group-header");
      const panel = group.querySelector(".website-grid");
      const cards = [...group.querySelectorAll(".website-card")];

      let groupMatches = 0;

      cards.forEach((card) => {
        const searchable =
          `${card.textContent} ${card.href}`.toLowerCase();

        const matches =
          categoryMatches && searchable.includes(query);

        card.hidden = !matches;

        if (matches) {
          visibleLinks++;
          groupMatches++;
        }
      });

      const showGroup =
        categoryMatches && (query ? groupMatches > 0 : true);

      group.hidden = !showGroup;

      if (showGroup) visibleGroups++;

      if (header && panel) {
        if (query && showGroup) {
          header.setAttribute("aria-expanded", "true");
          panel.hidden = false;
          group.classList.add("expanded");
        } else if (query && !showGroup) {
          header.setAttribute("aria-expanded", "false");
          panel.hidden = true;
          group.classList.remove("expanded");
        }
      }
    });

    resultText.textContent = query
      ? `${visibleLinks} website(s) found`
      : `${visibleLinks} websites available across ${visibleGroups} categories`;

    emptyMessage.hidden = visibleLinks !== 0 || !query;
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((item) =>
        item.classList.remove("active")
      );

      button.classList.add("active");
      selectedCategory = button.dataset.category;
      filterSites();

      document.getElementById("sites").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  searchInput.addEventListener("input", filterSites);

  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    filterSites();
    searchInput.focus();
  });

  filterSites();
});
