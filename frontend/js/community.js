// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleContainer = document.getElementById('sidebarToggleContainer');
  const sidebarToggle = document.getElementById('sidebarToggle');
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
  
  // Initialize sidebar state
  function updateSidebarState() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add('sidebar-hidden');
      mainContent.classList.add('main-content-expanded');
      toggleContainer.style.left = '0';
      updateToggleIcon(true);
    } else {
      if (!sidebar.classList.contains('sidebar-hidden')) {
        toggleContainer.style.left = '250px';
        updateToggleIcon(false);
      } else {
        toggleContainer.style.left = '0';
        updateToggleIcon(true);
      }
    }
  }
  
  // Initial setup
  updateSidebarState();
  
  // Toggle sidebar when the button is clicked
  sidebarToggle.addEventListener('click', function() {
    const isSidebarHidden = sidebar.classList.contains('sidebar-hidden');
    sidebar.classList.toggle('sidebar-hidden');
    mainContent.classList.toggle('main-content-expanded');
    
    if (sidebar.classList.contains('sidebar-hidden')) {
      toggleContainer.style.left = '0';
      updateToggleIcon(true);
    } else {
      toggleContainer.style.left = '250px';
      updateToggleIcon(false);
    }
  });
  
  // Handle window resize events
  window.addEventListener('resize', updateSidebarState);
  
  // Section dropdown toggles
  const dropdownToggles = ['navDropdown', 'accountDropdown', 'helpDropdown'];
  const sections = ['navSection', 'accountSection', 'helpSection'];

  dropdownToggles.forEach((id, index) => {
    document.getElementById(id).addEventListener('click', function() {
      this.classList.toggle('up');
      const section = document.getElementById(sections[index]);
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    });
  });
});

// Simulate community data (this would typically come from an API or a database)
const communities = [
  { 
    name: 'Nature Lovers', 
    description: 'A community for people who enjoy exploring nature and sharing their outdoor experiences.', 
    rules: 'Be respectful, keep it peaceful, no inappropriate content.',
    members: 243
  },
  { 
    name: 'Tech Enthusiasts', 
    description: 'For those who are passionate about technology and want to discuss the latest innovations.', 
    rules: 'No spamming, stay on topic, be respectful of others\' opinions.',
    members: 187
  },
  { 
    name: 'Book Club', 
    description: 'A space for avid readers to discuss books, share recommendations, and analyze literary works.', 
    rules: 'No spoilers without warning, be kind to others, respect diverse opinions.',
    members: 112
  },
  {
    name: 'Mindful Journaling',
    description: 'A community focused on reflective and mindful journaling practices for personal growth.',
    rules: 'Be supportive, respect privacy, focus on constructive feedback.',
    members: 78
  }
];

// Function to display the community list
function displayCommunities() {
  const communityList = document.getElementById('communityList');
  communityList.innerHTML = '';

  communities.forEach(community => {
    const card = document.createElement('div');
    card.classList.add('community-card', 'col-lg-4', 'col-md-6', 'col-sm-12');
    card.innerHTML = `
      <h4>${community.name}</h4>
      <p>${community.description}</p>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <small>${community.members} members</small>
      </div>
      <button class="btn btn-primary" onclick="joinCommunity('${community.name}')">Join</button>
    `;
    communityList.appendChild(card);
  });
}

// Function to handle joining a community
function joinCommunity(name) {
  alert(`You have joined the ${name} community!`);
  // In a real app, you would send a request to the server here
}

// Handle the creation of a new community
document.addEventListener('DOMContentLoaded', function() {
  // Display initial communities
  displayCommunities();
  
  // Set up form submission handler
  document.getElementById('createCommunityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const communityName = document.getElementById('communityName').value;
    const communityDescription = document.getElementById('communityDescription').value;
    const communityRules = document.getElementById('communityRules').value;

    if (communityName && communityDescription && communityRules) {
      const newCommunity = {
        name: communityName,
        description: communityDescription,
        rules: communityRules,
        members: 1 // Starting with yourself as the first member
      };

      // Simulate saving the new community (you would save this data to the server)
      communities.push(newCommunity);
      displayCommunities(); // Re-render the community list with the new community
      
      // Show success message
      alert('Community created successfully!');
      
      // Reset form fields
      document.getElementById('createCommunityForm').reset();
    } else {
      alert('Please fill in all fields to create a community!');
    }
  });
});

// Logout functionality removed - now handled by logout.js
