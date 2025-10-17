// ===== Simple Search Filter =====
const searchInput = document.getElementById('searchInput');
const customerContainer = document.getElementById('customerContainer');
const customerCards = customerContainer.getElementsByClassName('customer-card');

searchInput.addEventListener('keyup', function() {
  const filter = searchInput.value.toLowerCase();

  Array.from(customerCards).forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    card.style.display = name.includes(filter) ? '' : 'none';
  });
});
