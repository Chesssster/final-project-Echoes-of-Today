document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle functionality
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggleIcon = sidebarToggle.querySelector('.sidebar-toggle-icon');

  // Function to update the toggle icon between hamburger and X
  function updateToggleIcon(isSidebarHidden) {
    if (isSidebarHidden) {
      // Hamburger icon
      sidebarToggleIcon.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
    } else {
      // X icon
      sidebarToggleIcon.innerHTML = `
        <span style="transform: rotate(45deg); top: 6px;"></span>
        <span style="opacity: 0;"></span>
        <span style="transform: rotate(-45deg); top: 6px;"></span>
      `;
    }
  }

  // Set initial toggle icon based on sidebar state
  updateToggleIcon(sidebar.classList.contains('sidebar-hidden'));

  sidebarToggle.addEventListener('click', function() {
    const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    
    if (sidebar.classList.contains('sidebar-hidden')) {
      sidebarToggleContainer.style.left = '0';
      updateToggleIcon(true);
    } else {
      sidebarToggleContainer.style.left = sidebar.offsetWidth + 'px';
      updateToggleIcon(false);
    }
  });

  // Dropdown functionality
  const dropdowns = document.querySelectorAll('.dropdown-icon');
  dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener('click', function() {
      this.classList.toggle('up');
      const sectionId = this.id.replace('Dropdown', 'Section');
      const section = document.getElementById(sectionId);
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    });
  });

  // Form submission handlers
  const accountInfoForm = document.getElementById('accountInfoForm');
  accountInfoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulate saving account info
    showNotification('Account information updated successfully!');
  });

  const passwordForm = document.getElementById('passwordForm');
  passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }
    
    // Simulate password change
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showNotification('Password changed successfully!');
  });

  const preferencesForm = document.getElementById('preferencesForm');
  preferencesForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulate saving preferences
    showNotification('Preferences saved successfully!');
  });

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
    localStorage.setItem('darkMode', this.checked);
  });

  // Load user settings from localStorage
  function loadUserSettings() {
    // Check for dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Load other user settings (simulated)
    document.getElementById('username').value = localStorage.getItem('username') || 'JohnDoe';
    document.getElementById('email').value = localStorage.getItem('email') || 'john.doe@example.com';
    document.getElementById('displayName').value = localStorage.getItem('displayName') || 'John Doe';
    document.getElementById('bio').value = localStorage.getItem('bio') || 'I love journaling my daily experiences.';
    
    // Set privacy level
    document.getElementById('privacyLevel').value = localStorage.getItem('privacyLevel') || 'private';
    
    // Set email notifications
    document.getElementById('emailNotifications').checked = localStorage.getItem('emailNotifications') === 'true';
  }

  // Helper function to show notifications
  function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }

  // Logout button
  const logoutButton = document.getElementById('logoutButton');
  logoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    // Simulate logout
    showNotification('Logging out...');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  });

  // Initialize
  loadUserSettings();
});