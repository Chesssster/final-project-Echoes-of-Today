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
  const profileJoinDate = document.querySelector('.profile-info .mb-2');
  const profileBio = document.querySelector('.profile-bio');
  
  // Timeline element
  const timelineContainer = document.querySelector('.timeline');
  
  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';
  
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
  
  // Check if user is logged in
  function checkAuth() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Redirect to login page if not logged in
      window.location.href = 'login.html';
      return null;
    }
    return JSON.parse(userData);
  }
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  // Format time for display
  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Group activities by date
  function groupActivitiesByDate(activities) {
    const groups = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(activity);
    });
    
    return groups;
  }
  
  // Get relative date label
  function getRelativeDateLabel(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // Format as MMM DD (e.g., Apr 18)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
  
  // Load user profile data from API
  async function loadProfileData() {
    try {
      // Get logged in user data
      const userData = checkAuth();
      if (!userData) return;
      
      // Show loading state
      profileName.innerHTML = '<span class="placeholder col-7"></span>';
      profileUsername.innerHTML = '<span class="placeholder col-4"></span>';
      profileBio.innerHTML = '<span class="placeholder col-12"></span><span class="placeholder col-10"></span>';
      timelineContainer.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"></div></div>';
      
      // Fetch profile data from API
      const response = await fetch(`${API_BASE_URL}/users/profile/${userData.user.id}?userId=${userData.user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      
      // Update profile UI with data
      profileName.textContent = data.user.name;
      profileUsername.textContent = `@${data.user.email.split('@')[0]}`;
      profileJoinDate.textContent = `Joined ${formatDate(data.user.createdAt)}`;
      
      // Update profile bio if available or set default
      profileBio.textContent = data.user.bio || 'No bio provided. Edit your profile to add a bio.';
      
      // Update recent activity timeline
      updateActivityTimeline(data.recentActivity);
      
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      // Show error message
      timelineContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Failed to load profile data. Please refresh the page or try again later.
        </div>
      `;
    }
  }
  
  // Update activity timeline with data
  function updateActivityTimeline(activities) {
    if (!activities || activities.length === 0) {
      timelineContainer.innerHTML = `
        <div class="text-center p-4">
          <p class="text-muted">No recent activity found.</p>
        </div>
      `;
      return;
    }
    
    // Group activities by date
    const groupedActivities = groupActivitiesByDate(activities);
    
    // Clear timeline
    timelineContainer.innerHTML = '';
    
    // Create timeline items for each date group
    Object.keys(groupedActivities).forEach(dateKey => {
      const dateActivities = groupedActivities[dateKey];
      const dateLabel = getRelativeDateLabel(dateActivities[0].date);
      
      // Add activities for this date
      dateActivities.forEach(activity => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        const timelineDate = document.createElement('div');
        timelineDate.className = 'timeline-date';
        timelineDate.textContent = dateLabel;
        
        const timelineContent = document.createElement('div');
        timelineContent.className = 'timeline-content';
        
        const activityContent = document.createElement('p');
        const activityTime = document.createElement('small');
        activityTime.className = 'text-muted';
        activityTime.textContent = formatTime(activity.date);
        
        // Set content based on activity type
        if (activity.type === 'journal') {
          activityContent.innerHTML = `<strong>New Journal Entry:</strong> "${activity.title}"`;
        } else if (activity.type === 'image') {
          activityContent.innerHTML = `<strong>Added Image to:</strong> "${activity.journalTitle}"`;
        }
        
        timelineContent.appendChild(activityContent);
        timelineContent.appendChild(activityTime);
        
        timelineItem.appendChild(timelineDate);
        timelineItem.appendChild(timelineContent);
        
        timelineContainer.appendChild(timelineItem);
      });
    });
  }
  
  // Event Listeners
  sidebarToggle.addEventListener('click', toggleSidebar);
  navDropdown.addEventListener('click', () => toggleSection(navDropdown, navSection));
  accountDropdown.addEventListener('click', () => toggleSection(accountDropdown, accountSection));
  helpDropdown.addEventListener('click', () => toggleSection(helpDropdown, helpSection));
  
  // Initialize sections
  initSections();
  
  // Load profile data when page loads
  loadProfileData();
});