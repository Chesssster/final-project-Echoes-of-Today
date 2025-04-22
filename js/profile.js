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
  const profileUsername = document.querySelector('.profile-info .text-muted');
  const profileBio = document.querySelector('.profile-bio');
  
  // Check for saved sidebar state
  const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
  
  // Initialize sidebar state based on saved preference
  if (sidebarHidden) {
    sidebar.classList.add('sidebar-hidden');
    mainContent.classList.add('main-content-expanded');
    sidebarToggleContainer.style.left = '0';
    updateToggleIcon(true);
  } else {
    updateToggleIcon(false);
  }
  
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
  
  // Toggle sidebar function
  function toggleSidebar() {
    const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    
    // Update toggle button position
    if (sidebar.classList.contains('sidebar-hidden')) {
      sidebarToggleContainer.style.left = '0';
      localStorage.setItem('sidebarHidden', 'true');
      updateToggleIcon(true);
    } else {
      // Use actual sidebar width for responsive layouts
      const sidebarWidth = getComputedStyle(sidebar).width;
      sidebarToggleContainer.style.left = sidebarWidth;
      localStorage.setItem('sidebarHidden', 'false');
      updateToggleIcon(false);
    }
  }
  
  // Toggle sections function
  function toggleSection(dropdown, section) {
    dropdown.classList.toggle('up');
    
    // Use slideUp/slideDown effect
    if (dropdown.classList.contains('up')) {
      section.style.maxHeight = section.scrollHeight + 'px';
      section.style.opacity = '1';
      section.style.visibility = 'visible';
    } else {
      section.style.maxHeight = '0';
      section.style.opacity = '0';
      section.style.visibility = 'hidden';
    }
  }
  
  // Set initial section states
  function initSections() {
    // Default all sections to be visible
    [navSection, accountSection, helpSection].forEach(section => {
      section.style.maxHeight = section.scrollHeight + 'px';
      section.style.opacity = '1';
      section.style.visibility = 'visible';
      section.style.overflow = 'hidden';
      section.style.transition = 'all 0.3s ease';
    });
  }
  
  // Load profile data
  function loadProfileData() {
    // In a real application, fetch this data from a server/API
    // For now, we'll use localStorage
    const profileData = JSON.parse(localStorage.getItem('userProfile')) || {
      name: 'John Doe',
      username: 'johndoe',
      joined: 'April 2025',
      bio: 'Nature enthusiast and amateur photographer. I journal daily to capture life\'s moments both big and small.',
      profilePicUrl: 'https://via.placeholder.com/150'
    };
    
    // Update profile elements with data
    profileName.textContent = profileData.name;
    profileUsername.textContent = '@' + profileData.username;
    profileBio.textContent = profileData.bio;
    
    // Set profile picture if available
    if (profileData.profilePicUrl) {
      profilePicture.src = profileData.profilePicUrl;
    }
    
    return profileData;
  }
  
  // Create edit profile modal
  function createEditProfileModal() {
    // Get current profile data
    const currentProfile = loadProfileData();
    
    // Create modal if it doesn't exist
    if (!document.getElementById('editProfileModal')) {
      const modalHTML = `
        <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="profileEditForm">
                  <div class="mb-3">
                    <label for="profileName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="profileName" value="${currentProfile.name}">
                  </div>
                  <div class="mb-3">
                    <label for="profileUsername" class="form-label">Username</label>
                    <input type="text" class="form-control" id="profileUsername" value="${currentProfile.username}">
                  </div>
                  <div class="mb-3">
                    <label for="profileBio" class="form-label">Bio</label>
                    <textarea class="form-control" id="profileBio" rows="3">${currentProfile.bio}</textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveProfileBtn">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add modal to the page
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      // Add event listener to save button
      document.getElementById('saveProfileBtn').addEventListener('click', saveProfileChanges);
    }
    
    // Return the modal instance
    return new bootstrap.Modal(document.getElementById('editProfileModal'));
  }
  
  // Save profile changes
  function saveProfileChanges() {
    // Get values from form
    const name = document.getElementById('profileName').value;
    const username = document.getElementById('profileUsername').value;
    const bio = document.getElementById('profileBio').value;
    
    // Get current profile data
    const currentProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    // Update profile data
    const updatedProfile = {
      ...currentProfile,
      name,
      username,
      bio
    };
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Update UI
    profileName.textContent = name;
    profileUsername.textContent = '@' + username;
    profileBio.textContent = bio;
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
    
    // Show success message
    alert('Profile updated successfully!');
  }
  
  // Handle profile picture change
  function handleProfilePictureChange() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Trigger click event
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          // Update profile picture
          profilePicture.src = e.target.result;
          
          // Get current profile data
          const currentProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
          
          // Update profile data with new image URL
          const updatedProfile = {
            ...currentProfile,
            profilePicUrl: e.target.result
          };
          
          // Save to localStorage
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        };
        
        reader.readAsDataURL(this.files[0]);
      }
      
      // Remove the file input
      document.body.removeChild(fileInput);
    });
  }
  
  // Add event listeners
  sidebarToggle.addEventListener('click', toggleSidebar);
  
  navDropdown.addEventListener('click', () => toggleSection(navDropdown, navSection));
  accountDropdown.addEventListener('click', () => toggleSection(accountDropdown, accountSection));
  helpDropdown.addEventListener('click', () => toggleSection(helpDropdown, helpSection));
  
  // Add edit profile button to the page
  const profileInfo = document.querySelector('.profile-info');
  if (profileInfo) {
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-outline-primary mt-2';
    editButton.textContent = 'Edit Profile';
    editButton.id = 'editProfileBtn';
    profileInfo.appendChild(editButton);
    
    // Add event listener to edit button
    editButton.addEventListener('click', function() {
      const modal = createEditProfileModal();
      modal.show();
    });
  }
  
  // Add event listener to change photo button
  if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', handleProfilePictureChange);
  }
  
  // Logout button functionality
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out?')) {
        // Redirect to login page or perform logout
        window.location.href = 'login.html';
      }
    });
  }
  
  // Initialize sections
  initSections();
  
  // Load profile data
  loadProfileData();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (!sidebar.classList.contains('sidebar-hidden')) {
      const sidebarWidth = getComputedStyle(sidebar).width;
      sidebarToggleContainer.style.left = sidebarWidth;
    }
  });
});