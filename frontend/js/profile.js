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
  
  // Load user profile data
  function loadUserProfile() {
    if (!currentUser) return;
    
    // Set basic profile information
    profileName.textContent = currentUser.name;
    profileUsername.textContent = '@' + currentUser.name.toLowerCase().replace(/\s+/g, '');
    
    // Fetch profile picture
    fetchProfilePicture();
    
    // Fetch user's activity
    fetchUserActivity();
  }
  
  // Fetch profile picture
  async function fetchProfilePicture() {
    try {
      const response = await fetch(`${API_BASE_URL}/profile-pictures/${currentUser.id}`);
      
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
      const reader = new FileReader();
      
      reader.onload = async function(e) {
        const imageData = e.target.result;
        
        // Display the selected image immediately
        profilePicture.src = imageData;
        
        // Upload to server
        try {
          const response = await fetch(`${API_BASE_URL}/profile-pictures`, {
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
            throw new Error('Failed to upload profile picture');
          }
          
          console.log('Profile picture updated successfully');
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          alert('Failed to update profile picture. Please try again.');
        }
      };
      
      reader.readAsDataURL(file);
    }
  });
  
  // Fetch user's recent activity
  async function fetchUserActivity() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${currentUser.id}`);
      
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
  
  // Helper function to format date
  function formatDate(date) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
  
  // Helper function to format time
  function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Initialize the page
  loadUserProfile();
});