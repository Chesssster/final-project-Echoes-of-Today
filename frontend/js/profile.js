document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarToggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggleIcon = sidebarToggle.querySelector('.sidebar-toggle-icon');
  
  // Section dropdowns
  const navDropdown = document.getElementById('navDropdown');
  const accountDropdown = document.getElementById('accountDropdown');
  const helpDropdown = document.getElementById('helpDropdown');
  
  // Sections
  const navSection = document.getElementById('navSection');
  const accountSection = document.getElementById('accountSection');
  const helpSection = document.getElementById('helpSection');
  
  // Profile elements
  const changePhotoBtn = document.querySelector('.profile-picture-container button');
  const profilePicture = document.querySelector('.profile-picture img');
  const profileName = document.querySelector('.profile-info h3');
  const profileUsername = document.querySelector('.profile-info .username-display');
  const profileBio = document.querySelector('.profile-bio');
  const editUsernameBtn = document.querySelector('.edit-username-btn');
  const editBioBtn = document.querySelector('.edit-bio-btn');
  
  // Timeline element
  const timelineContainer = document.querySelector('.timeline');
  
  // API Base URL - using the one defined in config.js
  const API_ENDPOINT = API_BASE_URL + '/api';
  
  // Check for saved sidebar state
  const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
  
  // Check if user is logged in
  const checkAuth = () => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Redirect to login if not logged in
      window.location.href = 'login.html';
      return null;
    }
    return JSON.parse(userData).user;
  };
  
  // Initialize by checking authentication
  const currentUser = checkAuth();
  
  // Load sidebar user information
  if (currentUser) {
    const sidebarUserName = document.getElementById('user-name');
    const sidebarUserRole = document.getElementById('user-role');
    
    if (sidebarUserName) {
      sidebarUserName.textContent = currentUser.name || 'User';
    }
    
    if (sidebarUserRole) {
      sidebarUserRole.textContent = currentUser.role || 'Member';
    }
  }
  
  // Initialize sidebar state based on saved preference
  if (sidebarHidden) {
    sidebar.classList.add('sidebar-hidden');
    mainContent.classList.add('main-content-expanded');
    sidebarToggleContainer.style.left = '0';
    updateToggleIcon(true);
  } else {
    updateToggleIcon(false);
  }
  
  // Function to update toggle icon appearance
  function updateToggleIcon(isHidden) {
    if (isHidden) {
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
  
  // Toggle sidebar state
  sidebarToggle.addEventListener('click', function() {
    const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    
    // Update toggle button position
    if (sidebar.classList.contains('sidebar-hidden')) {
      sidebarToggleContainer.style.left = '0';
    } else {
      sidebarToggleContainer.style.left = '250px';
    }
    
    // Save sidebar state to localStorage
    localStorage.setItem('sidebarHidden', sidebar.classList.contains('sidebar-hidden'));
    
    // Update toggle icon
    updateToggleIcon(!isSidebarHidden);
  });
  
  // Dropdown functionality
  const dropdowns = document.querySelectorAll('.dropdown-icon');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function() {
      this.classList.toggle('up');
      const sectionId = this.id.replace('Dropdown', 'Section');
      document.getElementById(sectionId).style.display = this.classList.contains('up') ? 'block' : 'none';
    });
  });
  
  // Handle logout button
  const logoutButton = document.getElementById('logoutButton');
  const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
  
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Show logout modal using Bootstrap's modal API
      const logoutModal = new bootstrap.Modal(document.getElementById('logoutConfirmModal'));
      logoutModal.show();
    });
  }
  
  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', function() {
      // Clear user session data
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('sidebarHidden');
      
      // Also clear any tab identifiers from localStorage
      const tabKeys = Object.keys(localStorage).filter(key => key.startsWith('activeTab_'));
      tabKeys.forEach(key => localStorage.removeItem(key));
      
      // Redirect to login page
      window.location.href = 'index.html';
    });
  }
  
  // Load user profile data
  function loadUserProfile() {
    if (!currentUser) return;
    
    // Set username with @ symbol
    const usernameElement = document.querySelector('.username-display');
    if (usernameElement) {
      usernameElement.textContent = '@' + currentUser.name.toLowerCase().replace(/\s+/g, '');
    }
    
    // Set bio if available
    if (profileBio) {
      // Get bio text (the first child node that's a text node)
      const bioTextNode = Array.from(profileBio.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (bioTextNode) {
        // If user has a bio in their data, use that, otherwise keep the default
        if (currentUser.bio) {
          bioTextNode.textContent = currentUser.bio;
        }
      }
    }
    
    // Make sure sidebar username is set
    const sidebarUserName = document.getElementById('user-name');
    const sidebarUserRole = document.getElementById('user-role');
    
    if (sidebarUserName) {
      sidebarUserName.textContent = currentUser.name || 'User';
    }
    
    if (sidebarUserRole) {
      sidebarUserRole.textContent = currentUser.role || 'Member';
    }
    
    // Fetch profile picture
    fetchProfilePicture();
    
    // Fetch user's activity
    fetchUserActivity();
  }
  
  // Fetch profile picture
  async function fetchProfilePicture() {
    try {
      const response = await fetch(`${API_ENDPOINT}/profile-pictures/${currentUser.id}`);
      
      if (response.ok) {
        const data = await response.json();
        profilePicture.src = data.imageUrl;
      } else {
        // Use placeholder if no profile picture found
        profilePicture.src = 'https://via.placeholder.com/150';
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      profilePicture.src = 'https://via.placeholder.com/150';
    }
  }
  
  // Profile picture file input (hidden)
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);
  
  // Change photo button click handler
  changePhotoBtn.addEventListener('click', function() {
    fileInput.click();
  });
  
  // File input change handler
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = async function(e) {
        const imageData = e.target.result;
        
        // Display the selected image immediately
        profilePicture.src = imageData;
        
        // Show loading state
        changePhotoBtn.disabled = true;
        changePhotoBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Uploading...';
        
        try {
          const response = await fetch(`${API_ENDPOINT}/profile-pictures`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: currentUser.id,
              imageData: imageData
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload profile picture');
          }
          
          const result = await response.json();
          console.log('Profile picture updated successfully');
          showNotification('Profile picture updated successfully!', 'success');
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          showNotification(error.message || 'Failed to update profile picture. Please try again.', 'error');
          // Revert to previous image if available
          fetchProfilePicture();
        } finally {
          // Reset button state
          changePhotoBtn.disabled = false;
          changePhotoBtn.innerHTML = 'Change Photo';
        }
      };
      
      reader.onerror = function() {
        console.error('Error reading file');
        showNotification('Error reading file. Please try again.', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // Fetch user's recent activity
  async function fetchUserActivity() {
    try {
      const response = await fetch(`${API_ENDPOINT}/users/profile/${currentUser.id}`);
      
      if (response.ok) {
        const data = await response.json();
        displayUserActivity(data.recentActivity);
      } else {
        console.error('Failed to fetch user activity');
        timelineContainer.innerHTML = '<p class="text-center text-muted">No recent activity found</p>';
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
      timelineContainer.innerHTML = '<p class="text-center text-muted">Error loading activity</p>';
    }
  }
  
  // Display user's recent activity
  function displayUserActivity(activities) {
    if (!activities || activities.length === 0) {
      timelineContainer.innerHTML = '<p class="text-center text-muted">No recent activity found</p>';
      return;
    }
    
    timelineContainer.innerHTML = '';
    
    // Group activities by date
    const groupedActivities = groupActivitiesByDate(activities);
    
    // Create timeline items
    Object.keys(groupedActivities).forEach(date => {
      const activitiesForDate = groupedActivities[date];
      
      activitiesForDate.forEach(activity => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const timelineDate = document.createElement('div');
        timelineDate.className = 'timeline-date';
        timelineDate.textContent = date;
        
        const timelineContent = document.createElement('div');
        timelineContent.className = 'timeline-content';
        
        const activityTitle = document.createElement('p');
        
        if (activity.type === 'journal') {
          activityTitle.innerHTML = `<strong>New Journal Entry:</strong> "${activity.title}"`;
        } else if (activity.type === 'image') {
          activityTitle.innerHTML = `<strong>Added Image to:</strong> "${activity.journalTitle}"`;
        }
        
        const activityTime = document.createElement('small');
        activityTime.className = 'text-muted';
        activityTime.textContent = formatTime(new Date(activity.date));
        
        timelineContent.appendChild(activityTitle);
        timelineContent.appendChild(activityTime);
        
        timelineItem.appendChild(timelineDate);
        timelineItem.appendChild(timelineContent);
        
        timelineContainer.appendChild(timelineItem);
      });
    });
  }
  
  // Helper function to group activities by date
  function groupActivitiesByDate(activities) {
    const grouped = {};
    
    activities.forEach(activity => {
      const date = formatDate(new Date(activity.date));
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(activity);
    });
    
    return grouped;
  }
  
  // Format date for display
  function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    }
  }
  
  // Format time for display
  function formatTime(date) {
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }
  
  // Handle username edit button click
  if (editUsernameBtn) {
    editUsernameBtn.addEventListener('click', function() {
      const currentUsername = currentUser.name;
      
      // Create modal for editing username
      const modalHTML = `
        <div class="modal fade" id="editUsernameModal" tabindex="-1" aria-labelledby="editUsernameModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header bg-gradient-primary text-white border-0">
                <h5 class="modal-title fw-bold" id="editUsernameModalLabel">
                  <i class="fas fa-user-edit me-2"></i>Edit Username
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <form id="usernameForm" class="needs-validation" novalidate>
                  <div class="mb-3">
                    <label for="newUsername" class="form-label">New Username</label>
                    <input type="text" class="form-control form-control-lg" id="newUsername" value="${currentUsername}" required>
                    <div class="invalid-feedback">
                      Please enter a valid username.
                    </div>
                  </div>
                  <div class="text-muted mb-3 small">
                    Your username is displayed on your profile and for all your journal entries.
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0 d-flex justify-content-center gap-3 pb-4">
                <button type="button" class="btn btn-lg btn-outline-secondary px-4" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-lg btn-primary px-4" id="saveUsernameBtn">
                  <i class="fas fa-check me-2"></i>Save
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add the modal to the DOM if it doesn't exist
      if (!document.getElementById('editUsernameModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
      }
      
      // Initialize the modal
      const usernameModal = new bootstrap.Modal(document.getElementById('editUsernameModal'));
      const saveUsernameBtn = document.getElementById('saveUsernameBtn');
      
      // Show the modal
      usernameModal.show();
      
      // Add event listener to the save button
      saveUsernameBtn.addEventListener('click', async function() {
        const newUsername = document.getElementById('newUsername').value.trim();
        
        // Validate input
        if (!newUsername) {
          document.getElementById('newUsername').classList.add('is-invalid');
          return;
        }
        
        // Show loading state
        saveUsernameBtn.disabled = true;
        saveUsernameBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';
        
        try {
          // Update the username via API
          const response = await fetch(`${API_ENDPOINT}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: newUsername
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update username');
          }
          
          const updatedUser = await response.json();
          
          // Update current user data in localStorage
          const userData = JSON.parse(localStorage.getItem('userData'));
          userData.user.name = newUsername;
          localStorage.setItem('userData', JSON.stringify(userData));
          
          // Update UI elements
          currentUser.name = newUsername;
          
          // Update profile username (@username)
          if (profileUsername) {
            profileUsername.textContent = '@' + newUsername.toLowerCase().replace(/\s+/g, '');
          }
          
          // Update sidebar username
          const sidebarUsername = document.getElementById('user-name');
          if (sidebarUsername) {
            sidebarUsername.textContent = newUsername;
          }
          
          // Show success notification
          showNotification('Username updated successfully!', 'success');
          
          // Close the modal
          usernameModal.hide();
        } catch (error) {
          console.error('Error updating username:', error);
          showNotification('Failed to update username. Please try again.', 'error');
          
          // Reset button state
          saveUsernameBtn.disabled = false;
          saveUsernameBtn.innerHTML = '<i class="fas fa-check me-2"></i>Save';
        }
      });
    });
  }
  
  // Handle edit bio button click
  if (editBioBtn) {
    editBioBtn.addEventListener('click', function() {
      // Get current bio text
      const bioTextNode = Array.from(profileBio.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      const currentBio = bioTextNode ? bioTextNode.textContent.trim() : '';
      
      // Create modal for editing bio
      const modalHTML = `
        <div class="modal fade" id="editBioModal" tabindex="-1" aria-labelledby="editBioModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header bg-gradient-primary text-white border-0">
                <h5 class="modal-title fw-bold" id="editBioModalLabel">
                  <i class="fas fa-edit me-2"></i>Edit Bio
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <form id="bioForm" class="needs-validation" novalidate>
                  <div class="mb-3">
                    <label for="newBio" class="form-label">Your Bio</label>
                    <textarea class="form-control" id="newBio" rows="4" required>${currentBio}</textarea>
                    <div class="invalid-feedback">
                      Please enter a valid bio.
                    </div>
                  </div>
                  <div class="text-muted mb-3 small">
                    Your bio is displayed on your profile and helps others get to know you better.
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0 d-flex justify-content-center gap-3 pb-4">
                <button type="button" class="btn btn-lg btn-outline-secondary px-4" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
                <button type="button" class="btn btn-lg btn-primary px-4" id="saveBioBtn">
                  <i class="fas fa-check me-2"></i>Save
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add the modal to the DOM if it doesn't exist
      if (!document.getElementById('editBioModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
      }
      
      // Initialize the modal
      const bioModal = new bootstrap.Modal(document.getElementById('editBioModal'));
      const saveBioBtn = document.getElementById('saveBioBtn');
      
      // Show the modal
      bioModal.show();
      
      // Add event listener to the save button
      saveBioBtn.addEventListener('click', async function() {
        const newBio = document.getElementById('newBio').value.trim();
        
        // Validate input (allow empty bio)
        if (newBio === null) {
          document.getElementById('newBio').classList.add('is-invalid');
          return;
        }
        
        // Show loading state
        saveBioBtn.disabled = true;
        saveBioBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...';
        
        try {
          // Update the bio via API
          const response = await fetch(`${API_ENDPOINT}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              bio: newBio
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update bio');
          }
          
          const updatedUser = await response.json();
          
          // Update current user data in localStorage
          const userData = JSON.parse(localStorage.getItem('userData'));
          userData.user.bio = newBio;
          localStorage.setItem('userData', JSON.stringify(userData));
          
          // Update UI elements
          currentUser.bio = newBio;
          
          // Update profile bio text
          const bioTextNode = Array.from(profileBio.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
          if (bioTextNode) {
            bioTextNode.textContent = newBio;
          } else {
            // If there's no text node yet, create one
            profileBio.prepend(document.createTextNode(newBio));
          }
          
          // Show success notification
          showNotification('Bio updated successfully!', 'success');
          
          // Close the modal
          bioModal.hide();
        } catch (error) {
          console.error('Error updating bio:', error);
          showNotification('Failed to update bio. Please try again.', 'error');
          
          // Reset button state
          saveBioBtn.disabled = false;
          saveBioBtn.innerHTML = '<i class="fas fa-check me-2"></i>Save';
        }
      });
    });
  }
  
  // Function to show notifications
  function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add icon based on type
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${icon} me-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  // Export data button
  const exportDataBtn = document.getElementById('exportDataBtn');
  
  // Handle export data button click
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', function() {
      showExportOptionsModal();
    });
  }
  
  // Function to show export options modal
  function showExportOptionsModal() {
    // Create the modal if it doesn't exist
    if (!document.getElementById('exportOptionsModal')) {
      const modalHTML = `
        <div class="modal fade" id="exportOptionsModal" tabindex="-1" aria-labelledby="exportOptionsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header bg-gradient-primary text-white border-0">
                <h5 class="modal-title fw-bold" id="exportOptionsModalLabel">
                  <i class="fas fa-download me-2"></i>Export Your Data
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <p class="text-muted small mb-3">Select the format you want to export your journal entries:</p>
                <div class="d-grid gap-2">
                  <button id="exportJSONBtn" class="btn btn-outline-primary">
                    <i class="fas fa-file-code me-2"></i>JSON Format
                  </button>
                  <button id="exportTextBtn" class="btn btn-outline-primary">
                    <i class="fas fa-file-alt me-2"></i>Plain Text
                  </button>
                  <button id="exportPDFBtn" class="btn btn-outline-primary">
                    <i class="fas fa-file-pdf me-2"></i>PDF Format
                  </button>
                </div>
              </div>
              <div class="modal-footer border-0 d-flex justify-content-center gap-3 pt-1 pb-4">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  <i class="fas fa-times me-2"></i>Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add the modal to the DOM
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Add event listeners to export buttons
      document.getElementById('exportJSONBtn').addEventListener('click', function() {
        exportData('json');
      });
      
      document.getElementById('exportTextBtn').addEventListener('click', function() {
        exportData('text');
      });
      
      document.getElementById('exportPDFBtn').addEventListener('click', function() {
        exportData('pdf');
      });
    }
    
    // Show the modal
    const exportModal = new bootstrap.Modal(document.getElementById('exportOptionsModal'));
    exportModal.show();
  }
  
  // Function to export data
  async function exportData(format) {
    if (!currentUser) return;
    
    try {
      // Show loading state
      const exportBtn = document.getElementById(`export${format.toUpperCase()}Btn`);
      const originalBtnText = exportBtn.innerHTML;
      exportBtn.disabled = true;
      exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Exporting...';
      
      // Fetch user's journals
      const response = await fetch(`${API_ENDPOINT}/journals/user/${currentUser.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch your journal entries');
      }
      
      const journals = await response.json();
      
      // Format filename with current date
      const dateStr = formatDateForFilename(new Date());
      let filename = `echoes_journals_${dateStr}`;
      let content = '';
      let mimeType = '';
      
      // Generate content based on format
      if (format === 'json') {
        content = JSON.stringify(journals, null, 2);
        filename += '.json';
        mimeType = 'application/json';
      } else if (format === 'text') {
        content = journals.map(journal => {
          const date = new Date(journal.createdAt || Date.now()).toLocaleDateString();
          return `TITLE: ${journal.title || 'Untitled'}\nDATE: ${date}\n\n${journal.content || ''}\n\n----------\n\n`;
        }).join('');
        filename += '.txt';
        mimeType = 'text/plain';
      } else if (format === 'pdf') {
        // For PDF, we'll use a simple approach that converts HTML to PDF using browser printing
        // In a real app, you might want to use a proper PDF library
        
        // Create HTML content
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Journal Entries Export</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .journal-entry { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
              .journal-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
              .journal-date { font-size: 14px; color: #666; margin-bottom: 15px; }
              .journal-content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>My Journal Entries</h1>
            <p>Exported on ${new Date().toLocaleDateString()} by ${currentUser.name}</p>
            <hr>
            ${journals.map(journal => {
              const date = new Date(journal.createdAt || Date.now()).toLocaleDateString();
              return `
                <div class="journal-entry">
                  <div class="journal-title">${journal.title || 'Untitled'}</div>
                  <div class="journal-date">${date}</div>
                  <div class="journal-content">${journal.content || ''}</div>
                </div>
              `;
            }).join('')}
          </body>
          </html>
        `;
        
        // Create a blob of HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open a new window with the HTML content
        const printWindow = window.open(url, '_blank');
        
        printWindow.onload = function() {
          // Wait a bit for styles to apply, then print
          setTimeout(() => {
            printWindow.print();
            exportBtn.disabled = false;
            exportBtn.innerHTML = originalBtnText;
          }, 500);
        };
        
        // Close the modal
        const exportModal = bootstrap.Modal.getInstance(document.getElementById('exportOptionsModal'));
        exportModal.hide();
        
        return; // Return early for PDF as we're handling it differently
      }
      
      // Download the file (for JSON and Text formats)
      downloadFile(content, filename, mimeType);
      
      // Close the modal
      const exportModal = bootstrap.Modal.getInstance(document.getElementById('exportOptionsModal'));
      exportModal.hide();
      
      // Show success notification
      showNotification(`Your journal entries have been exported as ${filename}`, 'success');
      
    } catch (error) {
      console.error('Error exporting data:', error);
      showNotification(`Error exporting data: ${error.message}`, 'error');
    } finally {
      // Reset button state (except for PDF which is handled separately)
      if (format !== 'pdf') {
        const exportBtn = document.getElementById(`export${format.toUpperCase()}Btn`);
        if (exportBtn) {
          exportBtn.disabled = false;
          if (format === 'json') {
            exportBtn.innerHTML = '<i class="fas fa-file-code me-2"></i>JSON Format';
          } else if (format === 'text') {
            exportBtn.innerHTML = '<i class="fas fa-file-alt me-2"></i>Plain Text';
          }
        }
      }
    }
  }
  
  // Helper function to format date for filename
  function formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
  
  // Helper function to download file
  function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  // Initialize profile page
  loadUserProfile();
});