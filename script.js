document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  const categoryButtons = [
    ...document.querySelectorAll(".category")
  ];

  const groups = [
    ...document.querySelectorAll(".site-group")
  ];

  const resultText = document.getElementById("resultText");
  const emptyMessage = document.getElementById("emptyMessage");

  let selectedCategory = "all";

  /* =========================
     CATEGORY OPEN / CLOSE
  ========================= */

  function setGroupOpen(group, open) {
    const header = group.querySelector(".group-header");
    const panel = group.querySelector(".website-grid");

    if (!header || !panel) return;

    header.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;

    group.classList.toggle("expanded", open);
  }

  /* =========================
     COUNT + CATEGORY CLICK
  ========================= */

  groups.forEach((group) => {
    const cards = [
      ...group.querySelectorAll(".website-card")
    ];

    const countElement =
      group.querySelector("[data-count]");

    /* Real website count */
    if (countElement) {
      countElement.textContent = cards.length;
    }

    group.dataset.total = String(cards.length);

    const header =
      group.querySelector(".group-header");

    if (!header) return;

    /*
      পুরো category card click করলে
      open / close হবে।
    */

    head
