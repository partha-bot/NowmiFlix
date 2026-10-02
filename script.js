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

      const car
