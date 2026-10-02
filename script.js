document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const categoryPills = document.querySelectorAll('.category-pills .pill');
  const categoryBlocks = document.querySelectorAll('.category-block');

  // 1. Calculate actual website count dynamically
  function updateCounts() {
    categoryBlocks.forEach(block => {
      const siteCards = block.querySelectorAll('.site-card');
      const countBadge = block.querySelector('.count-badge');
      if (countBadge) {
        countBadge.textContent = siteCards.length;
      }
    });
  }
  updateCounts();

  // 2. Expand/Collapse Category on full header/card click
  categoryBlocks.forEach(block => {
    const header = block.querySelector('.category-header');
    header.addEventListener('click', () => {
      block.classList.toggle('expanded');
    });
  });

  // 3. Category Filter Pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      // Clear search to avoid conflicting filters
      if (searchInput.value.trim() !== '') {
        searchInput.value = '';
        clearBtn.classList.remove('active');
      }

      categoryBlocks.forEach(block => {
        const cat = block.getAttribute('data-c
