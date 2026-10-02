document.addEventListener("DOMContentLoaded", function () {
  const groups = document.querySelectorAll(".site-group");
  const categoryButtons = document.querySelectorAll(".category");

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");
  const resultText = document.getElementById("resultText");
  const emptyMessage = document.getElementById("emptyMessage");

  let selectedCategory = "all";


  /* ==============================
     OPEN / CLOSE CATEGORY
  ============================== */

  function openGroup(group) {
    const header = group.querySelector(".group-header");
    const grid = group.querySelector(".website-grid");

    if (!header || !grid) return;

    header.setAttribute("aria-expanded", "true");
    grid.hidden = false;

    group.classList.add("expanded");
  }


  function closeGroup(group) {
    const header = group.querySelector(".group-header");
    const grid = group.querySelector(".website-grid");

    if (!header || !grid) return;

    header.setAttribute("aria-expanded", "false");
    grid.hidden = true;

    group.classList.remove("expanded");
  }


  function toggleGroup(group) {
    const header = group.querySelector(".group-header");

    if (!header) return;

    const opened =
      header.getAttribute("aria-expanded") === "true";

    if (opened) {
      closeGroup(group);
    } else {
      openGroup(group);
    }
  }


  /* ==============================
     COUNT
  ============================== */

  groups.forEach(function (group) {

    const count = group.querySelector("[data-count]");
    const cards = group.querySelectorAll(".website-card");

    if (count) {
      count.textContent = cards.length;
    }

  });


  /* ==============================
     EXPLORE WEBSITE CARD CLICK
  ============================== */

  groups.forEach(function (group) {

    const header = group.querySelector(".group-header");

    if (!header) return;

    header.addEventListener("click", function () {
      toggleGroup(group);
    });

  });


  /* ==============================
     EXPLORE CATEGORIES
  ============================== */

  categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      categoryButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      selectedCategory =
        (button.dataset.category || "all").toLowerCase();


      groups.forEach(function (group) {

        const groupCategory =
          (group.dataset.category || "").toLowerCase();

        if (
          selectedCategory === "all" ||
          groupCategory === selectedCategory
        ) {

          group.hidden = false;

        } else {

          group.hidden = true;
          closeGroup(group);

        }

      });


      /* Selected category automatically opens */

      if (selectedCategory !== "all") {

        groups.forEach(function (group) {

          const groupCategory =
            (group.dataset.category || "").toLowerCase();

          if (groupCategory === selectedCategory) {
            openGroup(group);
          }

        });

      }


      const sites =
        document.getElementById("sites");

      if (sites) {

        sites.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });


  /* ==============================
     SEARCH
  ============================== */

  function searchWebsites() {

    const query =
      searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let found = 0;


    groups.forEach(function (group) {

      const cards =
        group.querySelectorAll(".website-card");

      let groupFound = 0;


      cards.forEach(function (card) {

        const name =
          (card.dataset.name || "").toLowerCase();

        const text =
          card.textContent.toLowerCase();

        const href =
          (card.getAttribute("href") || "").toLowerCase();

        const matches =
          query === "" ||
          name.includes(query) ||
          text.includes(query) ||
          href.includes(query);


        card.hidden = !matches;


        if (matches) {
          groupFound++;
          found++;
        }

      });


      if (query === "") {

        group.hidden =
          !(
            selectedCategory === "all" ||
            group.dataset.category === selectedCategory
          );

      } else if (groupFound > 0) {

        group.hidden = false;
        openGroup(group);

      } else {

        group.hidden = true;
        closeGroup(group);

      }

    });


    if (resultText) {

      resultText.textContent =
        query
          ? `${found} website${found === 1 ? "" : "s"} found`
          : "Browse our website directory.";

    }


    if (emptyMessage) {

      emptyMessage.hidden =
        !(query && found === 0);

    }


    if (clearSearch) {

      clearSearch.hidden =
        !query;

    }

  }


  /* Search typing */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      searchWebsites
    );

  }


  /* Clear */

  if (clearSearch) {

    clearSearch.addEventListener(
      "click",
      function (event) {

        event.preventDefault();
        event.stopPropagation();

        searchInput.value = "";

        searchWebsites();

        searchInput.focus();

      }
    );

  }


  /* ==============================
     INITIAL
  ============================== */

  groups.forEach(function (group) {
    closeGroup(group);
  });

  if (clearSearch) {
    clearSearch.hidden = true;
  }

});
