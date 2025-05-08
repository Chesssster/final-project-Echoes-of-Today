<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2ba22d2ef45603f46e7b700ccae696117d2ae68f
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841
fetch('http://localhost:5000/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error fetching:', err));
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to elements
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  // Set initial toggle position based on sidebar state
  updateTogglePosition();
  
  // Initialize dropdown sections
  const sections = ['navSection', 'accountSection', 'helpSection'];
  sections.forEach(id => {
    document.getElementById(id).style.display = 'block';
  });
  
  // Sidebar toggle click event
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    updateTogglePosition();
  });
  
  // Function to update toggle button position
  function updateTogglePosition() {
    if (sidebar.classList.contains('sidebar-hidden')) {
      toggleContainer.style.left = '0';
    } else {
      toggleContainer.style.left = '250px';
    }
  }
  
  // Section dropdown toggles
  const dropdownToggles = ['navDropdown', 'accountDropdown', 'helpDropdown'];
  
  dropdownToggles.forEach((id, index) => {
    document.getElementById(id).addEventListener('click', function() {
      this.classList.toggle('up');
      const section = document.getElementById(sections[index]);
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    });
  });
  
  // Logout functionality
  document.getElementById('logoutButton').addEventListener('click', function(e) {
    e.preventDefault();
    // Show the logout modal instead of using confirm
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutConfirmModal'));
    logoutModal.show();
  });

  // Add event listener for the confirm logout button in the modal
  document.getElementById('confirmLogoutBtn').addEventListener('click', function() {
    // Hide the modal
    const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutConfirmModal'));
    logoutModal.hide();
    
    // Display logout successful message
    alert("Logged out successfully!");
    
    // Redirect to login page
    window.location.href = 'login.html';
  });
});

// Load journals from localStorage
loadJournals();

// Function to display journals from localStorage
function loadJournals() {
  const journals = JSON.parse(localStorage.getItem('journals')) || [];
  const journalList = document.getElementById('journalList');
  
  if (journals.length === 0) {
    journalList.innerHTML = '<li>No journals written yet.</li>';
  } else {
    journalList.innerHTML = '';
    journals.forEach(journal => {
      const li = document.createElement('li');
      li.classList.add('mb-4');
      li.innerHTML = `
        <h4><a href="#" class="text-decoration-none">${journal.title}</a></h4>
        <p>${journal.content.substring(0, 100)}...</p>
      `;
      journalList.appendChild(li);
    });
  }
}
>>>>>>> 53decd297a9b781ef4866b13b1fa679fc3782829
>>>>>>> 2ba22d2ef45603f46e7b700ccae696117d2ae68f
>>>>>>> b90847c56d71a5980b48ee4cfbeb27ea85806841
