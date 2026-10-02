document.addEventListener("DOMContentLoaded", function () {
  "use strict";

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


  /* =========================================
     CATEGORY OPEN / CLOSE
  ========================================= */

  function setGroupOpen(group, open) {
    const header = group.querySelector(".group-header");
    const grid = group.querySelector(".website-grid");

    if (!header || !grid) return;

    header.setAttribute(
      "aria-expanded",
      open ? "true" : "false"
    );

    grid.hidden = !open;

    group.classList.toggle("expanded", open);
  }


  function toggleGroup(group) {
    const header = group.querySelector(".group-header");

    if (!header) return;

    const isOpen =
      header.getAttribute("aria-expanded") === "true";

    setGroupOpen(group, !isOpen);
  }


  /* =========================================
     WEBSITE COUNT
  ========================================= */

  function updateCounts() {
    groups.forEach(function (group) {
      const countElement =
        group.querySelector("[data-count]");

      const cards =
        group.querySelectorAll(".website-card");

      if (countElement) {
        countElement.textContent = cards.length;
      }
    });
  }


  /* =========================================
     SEARCHABLE TEXT
  ========================================= */

  function getSearchText(card) {
    return [
      card.dataset.name || "",
      card.textContent || "",
      card.getAttribute("href") || ""
    ]
      .join(" ")
      .toLowerCase();
  }


  /* =========================================
     CLEAR BUTTON
  ========================================= */

  function updateClearButton() {
    if (!clearSearch) return;

    const hasText =
      searchInput &&
      searchInput.value.trim().length > 0;

    clearSearch.hidden = !hasText;
  }


  /* =========================================
     FILTER
  ========================================= */

  function applyFilters(autoOpen = false) {
    if (!searchInput) return;

    const query =
      searchInput.value.trim().toLowerCase();

    let totalVisible = 0;
    let visibleGroups = 0;

    groups.forEach(function (group) {

      const groupCategory =
        (group.dataset.category || "")
          .trim()
          .toLowerCase();

      const categoryMatches =
        selectedCategory === "all" ||
        groupCategory === selectedCategory;

      const cards = Array.from(
        group.querySelectorAll(".website-card")
      );

      let matchingCards = 0;


      /* Check each website */

      cards.forEach(function (card) {

        const matches =
          categoryMatches &&
          (
            query === "" ||
            getSearchText(card).includes(query)
          );

        card.hidden = !matches;

        if (matches) {
          matchingCards++;
          totalVisible++;
        }

      });


      /*
        Category without websites যেমন Games:
        category নিজে দেখাবে, কিন্তু card থাকবে না।
      */

      const isEmptyCategory =
        cards.length === 0;

      const shouldShow =
        categoryMatches &&
        (
          query === "" ||
          matchingCards > 0
        );


      group.hidden = !shouldShow;


      if (shouldShow) {
        visibleGroups++;
      }


      /* Auto open selected/search result */

      if (
        shouldShow &&
        (
          query !== "" ||
          autoOpen
        )
      ) {
        setGroupOpen(group, true);
      }


      /*
        Search result না থাকলে category close
      */

      if (
        query !== "" &&
        matchingCards === 0
      ) {
        setGroupOpen(group, false);
      }


      /*
        Empty category-তে search করলে
        category hide হবে।
      */

      if (
        query !== "" &&
        isEmptyCategory
      ) {
        group.hidden = true;
      }

    });


    /* =========================================
       RESULT TEXT
    ========================================= */

    if (query !== "") {

      resultText.textContent =
        totalVisible +
        " website" +
        (totalVisible === 1 ? "" : "s") +
        " found";

    } else if (selectedCategory === "all") {

      resultText.textContent =
        totalVisible +
        " websites available across " +
        visibleGroups +
        " categories";

    } else {

      resultText.textContent =
        totalVisible +
        " website" +
        (totalVisible === 1 ? "" : "s") +
        " in " +
        selectedCategory;

    }


    /* Empty search message */

    if (emptyMessage) {
      emptyMessage.hidden =
        !(query !== "" && totalVisible === 0);
    }


    updateClearButton();
  }


  /* =========================================
     EXPLORE WEBSITE CATEGORY CLICK
  ========================================= */

  groups.forEach(function (group) {

    const header =
      group.querySelector(".group-header");

    if (!header) return;


    /*
      পুরো category card clickable
    */

    header.addEventListener(
      "click",
      function (event) {

        /*
          Website link থাকলে সেটার click আটকাবে না
        */

        if (event.target.closest("a")) {
          return;
        }

        toggleGroup(group);
      }
    );


    /*
      Keyboard support
    */

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


  /* =========================================
     EXPLORE CATEGORIES
  ========================================= */

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


        applyFilters(
          selectedCategory !== "all"
        );


        /* Scroll to Explore Websites */

        const sites =
          document.getElementById("sites");

        if (sites) {

          setTimeout(function () {

            sites.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }, 80);

        }

      }
    );

  });


  /* =========================================
     SEARCH INPUT
  ========================================= */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      function () {
        applyFilters(false);
      }
    );


    searchInput.addEventListener(
      "search",
      function () {
        applyFilters(false);
      }
    );

  }


  /* =========================================
     CLEAR SEARCH
  ========================================= */

  if (clearSearch) {

    clearSearch.addEventListener(
      "click",
      function (event) {

        event.preventDefault();
        event.stopPropagation();

        searchInput.value = "";

        applyFilters(false);

        searchInput.focus();

      }
    );

  }


  /* =========================================
     INITIAL LOAD
  ========================================= */

  updateCounts();

  applyFilters(false);

});
