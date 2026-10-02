(function () {
  "use strict";

  function initNowmiFlix() {
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const resultText = document.getElementById("resultText");
    const emptyMessage = document.getElementById("emptyMessage");

    const categoryButtons = Array.from(
      document.querySelectorAll(".category")
    );

    const groups = Array.from(
      document.querySelectorAll(".site-group")
    );

    let selectedCategory = "all";

    if (!searchInput || !groups.length) return;

    function getCategory(group) {
      return (group.dataset.category || "")
        .trim()
        .toLowerCase();
    }

    function setGroupOpen(group, open) {
      const header = group.querySelector(".group-header");
      const grid = group.querySelector(".website-grid");

      if (!header || !grid) return;

      header.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

      grid.hidden = !open;

      group.classList.toggle(
        "expanded",
        open
      );
    }

    function toggleGroup(group) {
      const header =
        group.querySelector(".group-header");

      if (!header) return;

      const isOpen =
        header.getAttribute("aria-expanded") === "true";

      setGroupOpen(group, !isOpen);
    }

    function updateCounts() {
      groups.forEach(function (group) {
        const countElement =
          group.querySelector("[data-count]");

        const cards =
          group.querySelectorAll(".website-card");

        if (countElement) {
          countElement.textContent =
            String(cards.length);
        }
      });
    }

    function searchableText(card) {
      return [
        card.dataset.name || "",
        card.textContent || "",
        card.getAttribute("href") || ""
      ]
        .join(" ")
        .toLowerCase();
    }

    function updateClearButton() {
      if (!clearSearch) return;

      const hasText =
        searchInput.value.trim().length > 0;

      clearSearch.hidden = !hasText;
    }

    function applyFilters(options) {
      const opts = options || {};
      const autoOpen = Boolean(opts.autoOpen);

      const query =
        searchInput.value.trim().toLowerCase();

      let totalVisible = 0;
      let visibleGroups = 0;

      groups.forEach(function (group) {
        const groupCategory =
          getCategory(group);

        const categoryMatches =
          selectedCategory === "all" ||
          groupCategory === selectedCategory;

        const cards = Array.from(
          group.querySelectorAll(".website-card")
        );

        let matchingCards = 0;

        cards.forEach(function (card) {
          const matches =
            categoryMatches &&
            (
              query === "" ||
              searchableText(card).includes(query)
            );

          card.hidden = !matches;

          if (matches) {
            matchingCards++;
            totalVisible++;
          }
        });

        const shouldShowGroup =
          categoryMatches &&
          (
            query === "" ||
            matchingCards > 0
          );

        group.hidden = !shouldShowGroup;

        if (shouldShowGroup) {
          visibleGroups++;
        }

        if (query && shouldShowGroup) {
          setGroupOpen(group, true);
        }

        else if (
          autoOpen &&
          selectedCategory !== "all" &&
          shouldShowGroup
        ) {
          setGroupOpen(group, true);
        }
      });

      if (query) {
        resultText.textContent =
          totalVisible +
          " website" +
          (totalVisible === 1 ? "" : "s") +
          " found";
      }

      else if (selectedCategory === "all") {
        resultText.textContent =
          totalVisible +
          " websites available across " +
          visibleGroups +
          " categories";
      }

      else {
        resultText.textContent =
          totalVisible +
          " website" +
          (totalVisible === 1 ? "" : "s") +
          " in " +
          selectedCategory;
      }

      if (emptyMessage) {
        emptyMessage.hidden =
          !(query && totalVisible === 0);
      }

      updateClearButton();
    }


    /* Category card open / close */

    groups.forEach(function (group) {
      const header =
        group.querySelector(".group-header");

      if (!header) return;

      header.addEventListener(
        "click",
        function () {
          toggleGroup(group);
        }
      );

      header.addEventListener(
        "keydown",
        function (event) {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            toggleGroup(group);
          }
        }
      );
    });


    /* Explore Categories */

    categoryButtons.forEach(function (button) {

      button.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          categoryButtons.forEach(
            function (item) {
              item.classList.remove("active");
            }
          );

          button.classList.add("active");

          selectedCategory =
            (
              button.dataset.category ||
              "all"
            )
              .trim()
              .toLowerCase();

          applyFilters({
            autoOpen:
              selectedCategory !== "all"
          });

          const sites =
            document.getElementById("sites");

          if (sites) {
            setTimeout(function () {
              sites.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
            }, 60);
          }
        }
      );

    });


    /* Search */

    searchInput.addEventListener(
      "input",
      function () {
        applyFilters();
      }
    );

    searchInput.addEventListener(
      "search",
      function () {
        applyFilters();
      }
    );


    /* Clear search */

    if (clearSearch) {

      clearSearch.addEventListener(
        "click",
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          searchInput.value = "";

          applyFilters();

          searchInput.focus();
        }
      );

    }


    /* Start */

    updateCounts();

    applyFilters();
  }


  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initNowmiFlix
    );
  }

  else {
    initNowmiFlix();
  }

})();
